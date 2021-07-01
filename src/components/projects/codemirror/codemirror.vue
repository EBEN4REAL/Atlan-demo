<template>
  <div>
    <p>Asset: superstore_subcategory_sales_profit</p>
    <textarea id="editor"></textarea>
  </div>
</template>
    
  <script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  toRefs,
  isRef,
  unref,
  toRaw,
} from "vue";

//import { SQLAutocomplete, SQLDialect } from "sql-autocomplete";

import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/sql/sql.js";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/hint/sql-hint.js";

import fetchColumns from "~/composables/columns/fetchColumns";

export default defineComponent({
  components: {},
  setup() {
    let editor;

    let entityFilters = {
      condition: "AND",
      criterion: [
        {
          attributeName: "tableQualifiedName",
          operator: "eq",
          attributeValue:
            "default/snowflake/vnmdjjg7g/SALES_DB/SALES_DB/superstore_subcategory_sales_profit",
        },
      ],
    };

    let now = ref(true);

    const { list } = fetchColumns(now, "", entityFilters, 20, 0);

    //columnList.value = list.value;

    // const sqlAutocomplete = new SQLAutocomplete(SQLDialect.MYSQL);

    // sqlAutocomplete.setTableNames([
    //   "NETFLIX_CUSTOMER_PAYMENTS_BY_TYPE",
    //   "superstore_sales_data_2016-present",
    //   "INSTACART_ALL_ORDER",
    // ]);
    // sqlAutocomplete.setColumnNames([
    //   "Row_ID",
    //   "Order_ID",
    //   "Order_Date",
    //   "Ship_Date",
    // ]);

    const getHints = (editor) => {
      let query = editor.getValue();
      let columnList = JSON.parse(JSON.stringify(unref(list.value)));

      // let suggestionList =
      //   sqlAutocomplete
      //     .autocomplete(query)
      //     .filter(function (e) {
      //       return e.value;
      //     })
      //     .map((suggestion) => suggestion.value) || [];

      // console.log(query);
      // console.log(suggestionList);

      let cur = editor.getCursor();
      let curLine = editor.getLine(cur.line);
      let start = cur.ch;
      let end = start;
      while (end < curLine.length && /[\w$]+/.test(curLine.charAt(end))) ++end;
      while (start && /[\w$]+/.test(curLine.charAt(start - 1))) --start;
      var curWord = start != end && curLine.slice(start, end);
      let options = {
        completeSingle: false,
        hint: () => ({
          from: CodeMirror.Pos(cur.line, start),
          to: CodeMirror.Pos(cur.line, end),
          list: columnList.map((column) => column.attributes.name) || [],
        }),
      };
      return options;
    };

    onMounted(() => {
      // the DOM element will be assigned to the ref after initial render
      // console.log(root.value); // <div>This is a root element</div>
      editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
        indentWithTabs: true,
        smartIndent: true,
        lineNumbers: true,
        value: "SELECT * FROM TABLE",
        hint: CodeMirror.hint.sql,
        mode: "text/x-sql",
      })

      editor.on("changes", () => {
        let hintOptions = getHints(editor);
        editor.showHint( hintOptions);
      });
    });

    return {
      editor,
    };
  },
});
</script>
    
  <style lang="less">
.cm-s-neat span.cm-comment {
  color: #a86;
}
.cm-s-neat span.cm-keyword {
  line-height: 1em;
  font-weight: bold;
  color: blue;
}
.cm-s-neat span.cm-string {
  color: #a22;
}
.cm-s-neat span.cm-builtin {
  line-height: 1em;
  font-weight: bold;
  color: #077;
}
.cm-s-neat span.cm-special {
  line-height: 1em;
  font-weight: bold;
  color: #0aa;
}
.cm-s-neat span.cm-variable {
  color: black;
}
.cm-s-neat span.cm-number,
.cm-s-neat span.cm-atom {
  color: #3a3;
}
.cm-s-neat span.cm-meta {
  color: #555;
}
.cm-s-neat span.cm-link {
  color: #3a3;
}

.cm-s-neat .CodeMirror-activeline-background {
  background: #e8f2ff;
}
.cm-s-neat .CodeMirror-matchingbracket {
  outline: 1px solid grey;
  color: black !important;
}
</style>
    
<route lang="yaml">
  meta:
    layout: project
    requiresAuth: true
</route>