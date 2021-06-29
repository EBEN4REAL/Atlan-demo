import * as monaco from 'monaco-editor';
import TurndownService from "turndown";

let turndownService = new TurndownService({});

let verifiedIcon =  "";

const savedQueries = () => {
    return  [
    {
        label: "Sum of Profit by Segment",
        detail: "Sum of Profit by Segment",
        kind: monaco.languages.CompletionItemKind.Reference,
        documentation:
          {
            value: turndownService.turndown(
              'By:&nbsp;<a target="_blank" href="https://wiki.atlan.com" rel="noopener noreferrer nofollow"> Prukalpa</a></p><div style="text-align: right"> <i>Updated a month ago by Prukalpa</i></div><p><img src="'+verifiedIcon +'" width="30"height="30"><i class="fa fa-gear fa-spin fa-2x" style="color: firebrick"></i>Verified</p><p><code>SELECT "Segment", SUM("Profit") AS "sum of Profit" FROM "superstore_sales_data_2016-present" WHERE "Ship Mode_sales" = "Standard Class" GROUP BY "Segment"</code></p>'
            ),
          },
          // {
          //   value: turndownService.turndown("<i class='fas badge-check text-green-500'></i> :blush: Verified"),
          // },
        //documentation: turndownService.turndown("<i class='fas badge-check text-green-500'></i>"),
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