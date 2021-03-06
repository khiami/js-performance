import * as vscode from 'vscode'
import { dirname, } from 'path'
import { Extension, PromiseStatus, StorageKey } from './enum'
import { Snippet, SnippetCase } from './types'

import { captureFastestCase, debounce, filterAndJoin, isValid, log, settledPromiseValue } from './utils'
import { parseSnippet, StatusBarService, buildDiagnostics, StorageService, generateCase } from './main'



export function activate(context: vscode.ExtensionContext) {
	
	// create a status bar class-instance
	const statusBar: StatusBarService = new StatusBarService()

	// create a diagnostic collection to report the benchmark results
	const diagnosticCollecion: vscode.DiagnosticCollection = vscode.languages.createDiagnosticCollection('javascript')

	// Momento instance
	const storage: StorageService = new StorageService(context.workspaceState)

	// reset storage on activation
	storage.update(StorageKey.SELECTION_LISTENER, null)
	

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
			e?.selections.map(a=> e.textEditor.document.getText(a)).join('\n')


		// capture the active file path (necessary to place test-case correctly)
		const activeFilePath: string|undefined = e.textEditor.document?.uri?.fsPath

		// terminate with updated status bar message
		if ( !selectedText?.length || !activeFilePath ) return statusBar.update( '' )

		// update status bar messaging
		statusBar.update( '$(sync~spin) Loading ..' )


		// parse selection
		const parsedSnippet: Snippet|null = parseSnippet(selectedText)
		const interval: number = parsedSnippet?.interval || caseInterval

		// generate js cases
		const p: Array<Promise<SnippetCase>> = !parsedSnippet?.cases?.length ? 
			[]:
			(

				// clear previous diagnostic results, if any
				diagnosticCollecion.clear(),

				// start generating the parsed cases
				parsedSnippet.cases.map((a, index)=> 
					generateCase(a, dirname(activeFilePath), index, interval)))


		// show results
		return !p?.length ?
			(
				statusBar.update( '' ),
				diagnosticCollecion.clear()):
			Promise.allSettled(p)
				.then((items: PromiseSettledResult<SnippetCase>[])=> {

					const resolvedCases: SnippetCase[] = settledPromiseValue(items)
					const rejectedCases: any[] = items.filter(a=> a.status === PromiseStatus.REJECTED)

					const fastestCase: SnippetCase = captureFastestCase(resolvedCases) || <SnippetCase>{}
					const resolvedMessage: string = !fastestCase?.label?.length ? 
						'':
						`Fastest case is "${fastestCase?.label}"`

					const statusBarMessage: Array<string|undefined> = [ resolvedMessage || '', !rejectedCases?.length ? undefined:`${rejectedCases?.length} Rejected case${rejectedCases?.length > 1 ? 's':''}` ]

					// update status bar message
					statusBar.update( filterAndJoin(statusBarMessage, '. ') )

					
					!rejectedCases?.length ? 
						null:
						log( 'rejected cases ', JSON.stringify(rejectedCases.map(a=> a.reason).join('\n\n')) )

					// refresh the benchmark results, highlighted on definition
					return diagnosticCollecion.set(e.textEditor.document.uri, buildDiagnostics(resolvedCases, interval, editor.document))

				})
				.catch(()=> 
					(	
						log( 'Caught error! Review the selection and try again!' ),
						diagnosticCollecion.clear()))
	

	}
	
	
	return isValid(storage.get(StorageKey.SELECTION_LISTENER)) ?
		undefined:

		// push to subscriptions only if the listener was assigned
		context.subscriptions.push(
			// register listener with debounce effect
			vscode.window.onDidChangeTextEditorSelection(debounce(onSelectionChange, 5e2)))


}

// this method is called when your extension is deactivated
export function deactivate(context: vscode.ExtensionContext) {

	// dispose all subscriptions
	return !context.subscriptions?.length ?
		undefined:
		context.subscriptions.forEach(s=> 
			s.dispose())
}