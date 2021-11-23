import * as vscode from 'vscode'

export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number,
) => {
  let timeout: any = 0

  const debounced = (...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), waitFor)
  }

  return debounced
}

export const log = (...args: unknown[]): Thenable<string | undefined> => 
  vscode.window.showInformationMessage( args.join( ' ' ))


export const sanitizeCaseName = (v: string = ''): string=> {

    // https://stackoverflow.com/questions/286921/efficiently-replace-all-accented-characters-in-a-string
    // convert all accented chars to latin chars
  
    // added to retain the accented characters e.g.
    // first name in French is Prénom
    // before normalize, it's turned into Prnom
    // after normalize, the term is turned to be Prenom
  
    const unaccented: string = v
  
      .trim()
  
      // changed accented to latin chars
      .normalize('NFKD')
  
      // remove all emoji chars
      .replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '')
      .replace(/(\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
  
      // remove accented chars
      .replace(/[\u0300-\u036F]/g, '')
  
      // remove all non words, digits, space, hyphens
      .replace(/[^\w\d\s\-]+/g, '')
  
      // remove all chars matching pattern - lookup comment #1
      .replace(/\s+(\-{1,})\s+/g, '-')
  
      // remove all consecutive (at least 2) hyphens
      .replace(/\-{2,}/g, '')
      .trim()
  
      // replace space with hyphen
      .replace(/\s/g, '-')
  
      // remove all underscores
      .replace(/\_/g, '')
  
    return unaccented.toLowerCase()
  
    // comment #1
    /*
      e.g. First name - Country
      this will result in first-name---country
      this shouldn't occur as the separator is '---' (three/3) hyphens
    */
  
  }

  export const validateObject = (object: unknown): boolean=> 
    typeof object !== 'undefined' && 
    !!object && 
    (typeof object === 'string' ? 
      !!(<string>object)?.length:
      true)



export function generateRandomNumber(min?: number, max?: number): number {

  const isMaxValid = min !== undefined && min !== null
  const isMinValid = max !== undefined && max !== null

  if ( isMaxValid && isMinValid ) return ~~(Math.random() * (max - min + 1)) + min

  return Math.round(Math.random() * 1e20) || Math.round(Math.random() * 1e20)

}

export function filterAndJoin(a: any[], separator: string): string {

  return a
    .filter(b=> !!a && !!b?.length)
    .join(separator)

}

export function isValid(ob: any): boolean {
  return ob !== undefined && ob !== null
}