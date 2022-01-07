import { Snippet, SnippetCase } from '../types'
import { sanitizeCaseName } from '../utils'

export const definitionRegex: RegExp = /[\/]{2,}\s+definition[\s\S]+?(?=([\/]{2,}\s+case|$))/
export const caseRegex: RegExp = /([\/]{2,}\s+case[\s\S]+?(?=[\/]{2,}\s+(case|definition)|$))/gi
export const caseNameRegex: RegExp = /[\/]{2,}\s+case([\S\s]+?)\n/
export const executionTimeRegex: RegExp = /^[\/]{2,}\s+definition[\s\S]\s*(run|go|execute|play|perform)[es\s]*(\d+)[\s]*time[s]?[\s\S]/i


export const getDefinition = (content: string): string => 
  (content.match(definitionRegex) || [])[0]

export const extractCaseName = (a: string): string=> 
  (caseNameRegex.exec(a)||[])[1]

export const getExecutionTime = (content: string): number|null=> {

  const [ _, _1, value ] = content.match(executionTimeRegex) || []
  const converted: number|null = !value?.length ? 
    null:
    parseInt(value)


  return isNaN(converted as number)?
    null:
    converted

}

  

export const parseSnippet = (content: string): Snippet | null => {

  const definition: string = getDefinition(content)
  
  if ( !definition?.length ) return null
  
  const interval: number|null = getExecutionTime(content)
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
    cases,
    interval,
  }

}