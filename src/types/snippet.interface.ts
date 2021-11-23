export interface SnippetCase {
  content: string;
  name: string;
  label: string;
  stdout?: number;
}

export interface Snippet {
  definition: string;
  cases: SnippetCase[]
}