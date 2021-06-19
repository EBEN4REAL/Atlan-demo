<template>
  <div id="monacoeditor" ref="monacoRoot" class="w-100"></div>
</template>
    
  <script lang="ts">
//https://github.com/vitejs/vite/discussions/1791
//https://github.com/vitejs/vite/issues/1927#issuecomment-805803918

import { defineComponent, ref, unref, onMounted, onUnmounted } from "vue";
import fetchColumns from "~/composables/columns/fetchColumns";

import savedQuery from "@/editor/monaco/savedQuery";
import sqlKeywords from "@/editor/monaco/sqlKeywords";
import columnSuggestion from "@/editor/monaco/columnSuggestion";

import { languageTokens } from "@/editor/monaco/sqlTokens";

import * as monaco from "monaco-editor";

// @ts-ignore
self.MonacoEnvironment = {
  getWorker(_: string, label: string) {
    return new Worker("./monaco-editor/esm/vs/editor/editor.worker", {
      type: "module",
    });
    //return new EditorWorker();
  },
};

export default defineComponent({
  setup() {
    const monacoRoot = ref<HTMLElement>();
    let editor: monaco.editor.IStandaloneCodeEditor;

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

    monaco.languages.register({ id: "atlansql" });

    monaco.languages.setMonarchTokensProvider("atlansql", languageTokens);

    monaco.languages.registerCompletionItemProvider("atlansql", {
      provideCompletionItems: function () {
        //For object properties https://microsoft.github.io/monaco-editor/api/interfaces/monaco.languages.completionitem.html
        return {
          suggestions: [
            ...savedQuery(),
            ...sqlKeywords(),
            ...columnSuggestion(unref(list.value)),
          ],
        };
      },
    });

    onMounted(() => {
      editor = monaco.editor.create(monacoRoot.value as HTMLElement, {
        language: "atlansql",
        value: `SELECT * from`,
        renderLineHighlight: "none",
        theme: "vs-dark",
        minimap: {
          enabled: false,
        },
        quickSuggestions: {
          other: true,
          comments: false,
          strings: false,
        },
      });
    });
    onUnmounted(() => {
      editor.dispose();
    });
    return {
      monacoRoot,
    };
  },
});
</script>
    
<style scoped>
#monacoeditor {
  height: 100vh;
}
</style>