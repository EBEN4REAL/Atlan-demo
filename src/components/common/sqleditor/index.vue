<template>
  <textarea id="editor"></textarea>
</template>
  
<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from "vue";

import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/sql/sql.js";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/hint/sql-hint.js";
// import { parseQuery } from "~/composables/parser/queryparser";

// import { PostgreSQLLexer } from "~/grammar/PostgreSQLLexer";
// import { PostgreSQLParserParser } from "~/grammar/PostgreSQLParserParser";

// import autosuggest from "antlr4-autosuggest";

// Create an autosuggester, providing it with the lexer and parser classes
// const autosuggest = require("antlr4-autosuggest");

import { antlr4tsSQL, SQLDialect } from "antlr4ts-sql";

// import base style

export default defineComponent({
  components: {},
  data() {
    return {
      editor: null,
    };
  },
  setup() {
    // const root = ref(null);
    // const editor = new CodeMirror(this.$refs.codemirror, {
    //   lineNumbers: true,
    //   tabSize: 2,
    //   mode: "text/x-pgsql",
    // });

    let sqltext = ref("SELECT * FROM TABLE");
    let editor = ref(null) as unknown as Ref<CodeMirror.EditorFromTextArea>;

    onMounted(() => {
      // the DOM element will be assigned to the ref after initial render
      //   console.log(root.value); // <div>This is a root element</div>
      editor.value = CodeMirror.fromTextArea(
        document.getElementById("editor"),
        {
          lineNumbers: true,
          value: sqltext.value,
          mode: "text/x-pgsql",
          extraKeys: { "Ctrl-Space": "autocomplete" }, // To invoke the auto complete
          hint: CodeMirror.hint.sql,
          hintOptions: {
            tables: {
              table1: ["col_A", "col_B", "col_C"],
              table2: ["other_columns1", "other_columns2"],
            },
          },
        }
      );

      editor.value.on("changes", () => {
        console.log("change");
        sqltext.value = editor.value.getValue();
      });

      editor.value.on("keyup", function () {
        CodeMirror.commands.autocomplete(editor.value);
      });
      //   const autosuggester = autosuggest.autosuggester(
      //     PostgreSQLParserParser,
      //     PostgreSQLLexer
      //   );

      // Suggest completions for the string "ABC"
      //   let suggestions = autosuggester.autosuggest("ABC");

      //   console.log(suggestions);

      const antlr4tssql = new antlr4tsSQL(SQLDialect.PLpgSQL);

      editor.value.on("cursorActivity", () => {
        console.log("change dadads");
        console.log(editor.value.getCursor().ch);

        const query = editor.value.getValue();
        const parseTree = antlr4tssql.getParseTreeFromSQL(query);
        console.log(parseTree);

        // const options = {
        //   // Don't complete automatically in case of only one suggestion
        //   completeSingle: false,
        //   hint: () => ({
        //     from: { line: 0, ch: suggestionsInfo.result?.range.start ?? 0 },
        //     to: {
        //       line: 0,
        //       ch:
        //         (suggestionsInfo.result?.range.end ?? 0) +
        //         (isKeyResult ? 1 : 0) + // for key result, extend index by 1 to cover the '=' in query
        //         1, // end index is excluded so let's add 1
        //     },
        //     list: suggestionsInfo.suggestions.map((text, index) => ({
        //       // Append '=' to the key and ' ' to the value
        //       text: isKeyResult ? `${text}=` : `${text} `,
        //     })),
        //   }),
        // };

        // codeMirrorEditor.showHint(options);
        // const query = "SELECT * FROM table1";
        // const antlr4tssql = new antlr4tsSQL(SQLDialect.PLpgSQL);
        // const parseTree = antlr4tssql.getParseTreeFromSQL(query);
        // console.log(parseTree);
        // const result = parseQuery(sqltext.value, editor.value.getCursor().ch);
        // console.log(result);
      });
    });

    return {
      editor,
      sqltext,
    };
  },
  mounted() {
    // const editor = new CodeMirror(this.$refs.codemirror, {
    //   lineNumbers: true,
    //   tabSize: 2,
    //   mode: "text/x-pgsql",
    // });
    // this.editor = EditorView.fromTextArea(document.getElementById("editor"), {
    //   lineNumbers: true,
    // });
    // this.editor?.on("change", function (cm) {});
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
  
  