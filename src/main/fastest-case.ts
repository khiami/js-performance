import { PromiseStatus } from '../enum'
import { SnippetCase } from '../types'

export const captureFastestCase = (items: SnippetCase[]): SnippetCase => 
  [ ...items ].sort((a, b)=> 
    a.duration! - b.duration!)[0]