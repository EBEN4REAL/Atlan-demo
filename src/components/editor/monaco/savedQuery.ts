import * as monaco from 'monaco-editor';

const savedQueries = () => {
    return  [
    {
        label: "Sum of Profit by Segment",
        detail: "Saved",
        kind: monaco.languages.CompletionItemKind.Reference,
        documentation: "Plain description about the keyword goes here",
        insertText: `SELECT "Segment", SUM("Profit") AS "sum of Profit" FROM "superstore_sales_data_2016-present" WHERE "Ship Mode_sales" = 'Standard Class' GROUP BY "Segment"`,
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
      },
      {
        label: "Profit by Segment",
        detail: "Number",
        kind: monaco.languages.CompletionItemKind.Reference,
        documentation: "Plain description about the keyword goes here",
        insertText: `SELECT "Segment", SUM("Profit") AS "sum of Profit" FROM "superstore_sales_data_2016-present" GROUP BY "Segment"`,
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
      }
]
}

export default savedQueries;