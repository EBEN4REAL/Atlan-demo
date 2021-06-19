import * as monaco from 'monaco-editor';

const sqlKeywords = () => {
    return  [
    {
        label: "SELECT",
        detail: "Keyword",
        kind: monaco.languages.CompletionItemKind.Keyword,
        documentation: "Plain description about the keyword goes here",
        insertText: "SELECT",
      },
      {
        label: "Stock Price",
        detail: "Number",
        kind: monaco.languages.CompletionItemKind.Enum,
        documentation: "Plain description about the keyword goes here",
        insertText: "stock_price",
      }
]
}

export default sqlKeywords;