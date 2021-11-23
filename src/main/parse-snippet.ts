import { Snippet, SnippetCase } from '../types'
import { sanitizeCaseName } from '../utils'

export const definitionRegex: RegExp = /[\/]{2,}\s+definition[\s\S]+?(?=([\/]{2,}\s+case|$))/
export const caseRegex: RegExp = /([\/]{2,}\s+case[\s\S]+?(?=[\/]{2,}\s+(case|definition)|$))/gi
export const caseNameRegex: RegExp = /[\/]{2,}\s+case([\S\s]+?)\n/


export const getDefinition = (content: string): string => 
  (content.match(definitionRegex) || [])[0]

export const extractCaseName = (a: string): string=> 
  (caseNameRegex.exec(a)||[])[1]
  

export const parseSnippet = (content: string): Snippet | null => {

  const definition: string = getDefinition(content)

  if ( !definition?.length ) return null
  
  const matchedCases: string[] = content.match(caseRegex) || []
  
  // const aggregatedCases: string[] = [ ..., lastCase ]
  const cases: SnippetCase[] = matchedCases.map(a=> ({

    // will be used to show the most-performant case
    label: extractCaseName(a)?.trim(),
    
    // will be used to create isolataed test case .case.js file
    get name() {

      return sanitizeCaseName(this.label)
    },

    // concat the definition in every case to make them ready for direct testing..
    content: [definition + a].join('\n')
  }))


  return { 
    definition,
    cases
  }

}