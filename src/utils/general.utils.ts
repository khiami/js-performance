import * as vscode from 'vscode'
import { PromiseStatus } from '../enum'

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

  return isMaxValid && isMinValid  ? 
    ~~(Math.random() * (max - min + 1)) + min:
    Math.round(Math.random() * 1e20) || Math.round(Math.random() * 1e20)

}

export const filterAndJoin = (a: any[], separator: string): string =>
  a
  .filter(b=> !!a && !!b?.length)
  .join(separator)


export const isValid = (ob: unknown): boolean=>
  ob !== undefined && ob !== null

export function reversedRatio(value: number, index: number, sequence: number[]): string {

  const length: number = sequence?.length
  const ratio: number = !length || !~index || !~value || (!!sequence && !!length && length - 1 === index) ?
      0:
      Math.abs(((value - sequence[length - 1]) / sequence[length - 1]) * 100)

  return !ratio ?
    '0%':
    `${ratio.toFixed(2)}%`

}

export const settledPromiseValue = (items: PromiseSettledResult<any>[]): any[] => 
  items
    .filter(a=> a.status === PromiseStatus.FULFILLED)
    .map(a=> (a as { value: any }).value)