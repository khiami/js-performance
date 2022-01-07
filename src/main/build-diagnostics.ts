import * as vscode from 'vscode'
import { Extension, PromiseStatus } from '../enum'
import { SnippetCase } from '../types'
import { formatAccountingStyle, reversedRatio, } from '../utils'


export const buildDiagnostics = (items: SnippetCase[], interval: number, textDocument: vscode.TextDocument): vscode.Diagnostic[]=> {

  try {

    if ( !items?.length ) return []

    const text = textDocument.getText()

    const durationSortedCases: SnippetCase[] = items.sort((a, b)=> 
      a.duration! - b.duration!)
    const sortedCaseDurations: number[] = durationSortedCases.map(a=> 
      a.duration!)

    const fulfilledWording: string[] = !durationSortedCases?.length ? 
      []:
      [
        'Sorted by fastest to slowest', '\r\n', durationSortedCases
        .map((a, index)=> 
          `${index+1}. ${reversedRatio(a.duration!, index, sortedCaseDurations)} "${a.label?.trim()}" took ${a.duration?.toFixed(2)} ms`)
        .join('\r\n')]
      

    // get the definition matching, location to put diagnostics
    const matching: RegExpMatchArray | null = /(?![\/]{2,}\s+)definition/i.exec(textDocument.getText())

    // terminate 
    if ( !text?.length || !matching?.length || !matching.index || !~matching.index ) return []

    const diagnostics: vscode.Diagnostic[] = !matching?.length ?
      []:
      matching.map(a=> {

        const range = new vscode.Range(
          textDocument.positionAt(matching.index!),
          textDocument.positionAt(matching.index! + a.length))

        const diagnostic = new vscode.Diagnostic(
          range, 
          `The test took ${durationSortedCases.slice(-1)[0]?.duration?.toFixed(2)} ms and executed ${formatAccountingStyle(interval.toString(), 0)} times`, 
          vscode.DiagnosticSeverity.Information)

        diagnostic.source =  Extension.TITLE
        diagnostic.relatedInformation = [
          {
            message: fulfilledWording.join('\r\n'),
            location: {
              uri: textDocument.uri,
              range,
            },
          }
        ]

        return diagnostic

      })


    return diagnostics

  } catch(e) {

    console.log( 'build-diagnostic - e', e )
    return []
    
  }

}