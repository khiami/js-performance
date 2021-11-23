import { PromiseStatus } from '../enum'
import { SnippetCase } from '../types'

export const captureFastestCase = (items: any[])=> {

  const filtered: SnippetCase[] = items
    .filter(a=> a.status === PromiseStatus.FULFILLED)
    .map(a=> a.value)

  const sorted: SnippetCase[] = [...filtered].sort((a, b)=> 
    a.stdout! - b.stdout!)

  return sorted[0]

}