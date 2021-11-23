import * as vscode from 'vscode'
import { dirname, } from 'path'
import { Extension, PromiseStatus, StorageKey } from './enum'
import { Snippet, SnippetCase } from './types'

import { debounce, filterAndJoin, isValid, log } from './utils'
import { parseSnippet, CustomStatusBar, buildDiagnostics, StorageService, generateCase, captureFastestCase } from './main'

export function activate(context: vscode.ExtensionContext) {
	
	// create a status bar class-instance
	const statusBar: CustomStatusBar = new CustomStatusBar()

	// create a diagnostic collection to report the benchmark results
	const diagnosticCollecion: vscode.DiagnosticCollection = vscode.languages.createDiagnosticCollection('javascript')

	// Momento instance
	const storage: StorageService = new StorageService(context.workspaceState)

	// reset storage on activation
	storage.update(StorageKey.SELECTION_LISTENER, null)



	// run when command is triggered
	// let disposable = vscode.commands.registerCommand('jsperformance.runBenchmark', () => {

	const editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor


	if ( !editor ) return 

	const userConfig: any = { interval: vscode.workspace.getConfiguration(Extension.JSPERFORMANCE) }
	const caseInterval: number = parseInt(userConfig as string) || 1e5


	// listen on selection change, debounce of 500ms
	const onSelectionChange = (e: vscode.TextEditorSelectionChangeEvent): any=> {

		storage.update(StorageKey.SELECTION_LISTENER, Date.now())

		// aggregate user selections with a newline char
		const selectedText: string = !e?.selections?.length ? 
			'':
			e?.selections.map(a=> editor.document.getText(a)).join('\n')


		// capture the active file path (necessary to place test-case correctly)
		const activeFilePath: string|undefined = vscode.window.activeTextEditor?.document?.uri?.fsPath

		// terminate with updated status bar message
		if ( !selectedText?.length || !activeFilePath ) return statusBar.update( '' )

		// update status bar messaging
		statusBar.update( '$(sync~spin) Loading ..' )


		// parse selection
		const parsedSnippet: Snippet|null = parseSnippet(selectedText)

		// generate js cases
		const p: Array<Promise<SnippetCase>> = !parsedSnippet?.cases?.length ? 
			[]:
			(

				// clear previous diagnostic results, if any
				diagnosticCollecion.clear(),

				// start generating the parsed cases
				parsedSnippet.cases.map((a, index)=> 
					generateCase(a, dirname(activeFilePath), index, caseInterval)))


		// show results
		return !p?.length ?
			statusBar.update( '' ):
			Promise.allSettled(p)
				.then((items: any[])=> {

					const resolvedCases: any[] = items?.filter(a=> a.status === PromiseStatus.FULFILLED)
					const rejectedCases: any[] = items?.filter(a=> a.status === PromiseStatus.REJECTED)

					const fastestCase: SnippetCase = captureFastestCase(items) || <SnippetCase>{}
					const { label }: SnippetCase = fastestCase

					const resolvedMessage: string = !label?.length ? 
						'':
						`Fastest case is "${label}"`

					const rejectedMessage: string|undefined = !rejectedCases?.length ?
						undefined:
						`You have ${rejectedCases?.length} rejected case${rejectedCases?.length > 1 ? 's':''}. Double check your selection and try again.`	

					const statusBarMessage: Array<string|undefined> = [ resolvedMessage || '', !rejectedCases?.length ? undefined:`${rejectedCases?.length} Rejected case${rejectedCases?.length > 1 ? 's':''}` ]

					// update status bar message
					statusBar.update( filterAndJoin(statusBarMessage, '. ') )


					// todo
					// 1. register escape button to clear all diagnostics

					
					// refresh the benchmark results, highlighted on definition
					return diagnosticCollecion.set(editor.document.uri, buildDiagnostics(resolvedCases, editor.document))

				})
				.catch(e=> 

					// notify errors when caught
					log( 'caught error ', e ))
	

	}

	return isValid(storage.get(StorageKey.SELECTION_LISTENER)) ?
		undefined:

		// push to subscriptions only if the listener was assigned
		context.subscriptions.push(
			// register listener with debounce effect
			vscode.window.onDidChangeTextEditorSelection(debounce(onSelectionChange, 5e2)))

	// })


	// push disposable to terminate when extension is deactivated
	// return context.subscriptions.push(disposable)

}

// this method is called when your extension is deactivated
export function deactivate(context: vscode.ExtensionContext) {

	// dispose all subscriptions
	return !context.subscriptions?.length ?
		undefined:
		context.subscriptions.forEach(s=> 
			s.dispose())
}