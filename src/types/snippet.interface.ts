export interface SnippetCase {
  content: string;
  name: string;
  label: string;
  duration?: number;
}

export interface Snippet {
  definition: string;
  cases: SnippetCase[];
  interval?: number|null;
}