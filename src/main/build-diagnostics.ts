import * as vscode from 'vscode'
import { Extension } from '../enum'
import { SnippetCase } from '../types'


export const caseRegexByLabel = (name: string): RegExp=> 
  new RegExp(`/([\/]{2,}\s+case\s+${name}`, 'i')


export const diagonosticByMatching = (matchingItem: any, matching: RegExpExecArray|null, doc: vscode.TextDocument)=> {

  if ( !matching ) return 

  const diagnostics: vscode.Diagnostic[] = matching.map(item=> {

    const range = new vscode.Range(
      doc.positionAt(matching.index),
      doc.positionAt(matching.index + item.length))

    const diagnostic = new vscode.Diagnostic(
      range,
      `This is the fastest case`,
      vscode.DiagnosticSeverity.Information)

    diagnostic.source =  'Js Performance'
    diagnostic.relatedInformation = [{
      message: `Executed in ${a.stdout} ms`,
      location: {
        uri: doc.uri,
        range,
      },
    }]

    return diagnostic

  })

  return diagnostic 

}

export const buildDiagnostics = (cases: SnippetCase[], textDocument: vscode.TextDocument): vscode.Diagnostic[]=> {

  if ( !cases?.length ) return []


  // todo
  // 1. Highlight the case result under the // case <case-title>
  // 2. Highlight the fastest case
  // 3. Highlight the slowest case
  // 4. Show report of all cases on the // definition


  const casesByDurationSortedAsc: SnippetCase[] = cases.sort((a, b)=> a.stdout! - b.stdout!)
  const fastestCase: SnippetCase = casesByDurationSortedAsc[0]
  const slowestCase: SnippetCase = casesByDurationSortedAsc[ casesByDurationSortedAsc.length - 1 ]

  const fastestCaseMatching: RegExpMatchArray | null = fastestCase.content.match(caseRegexByLabel(fastestCase.label))
  const slowestCaseMatching: RegExpMatchArray | null = slowestCase.content.match(caseRegexByLabel(slowestCase.label))

  const definitionCaseMatching: RegExpMatchArray | null = slowestCase.content.match(/(?![\/]{2,}\s+)definition/i)


  // const matchingCase: RegExpMatchArray | null = a.content.match(/([\/]{2,}\s+case[\s\S]+?(?=[\/]{2,}\s+(case|definition)|$))/gi)

  // if ( !matchingCase?.length ) return []
  

  // const matching: RegExpExecArray|null = new RegExp('result', 'gi')?.exec(textDocument.getText())

  // const diagnostics: vscode.Diagnostic[] = !matching?.length ?
  //   []:
  //   matching.map(item=> {

  //     const range = new vscode.Range(
  //       textDocument.positionAt(matching.index),
  //       textDocument.positionAt(matching.index + item.length))

  //     const diagnostic = new vscode.Diagnostic(
  //       range,
  //       `This is the fastest case`,
  //       vscode.DiagnosticSeverity.Information)

  //     diagnostic.source =  'Js Performance'
  //     diagnostic.relatedInformation = [{
  //       message: `Executed in ${a.stdout} ms`,
  //       location: {
  //         uri: textDocument.uri,
  //         range,
  //       },
  //     }]

  //     return diagnostic

  //   })


  // return diagnostics

  return []

}