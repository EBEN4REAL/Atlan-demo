<!-- <template>
  <a-layout class="min-h-screen">
    <a-layout-header
      theme="light"
      class="flex items-center px-0 leading-none align-middle text-primary-100 bg-primary-500"
      style="height: 42px"
    >
      <div
        class="flex items-center h-full px-4 mr-3 align-middle border-r border-primary-400 hover:bg-primary-600"
        @click="handleBack"
      >
        <fa icon="fal chevron-left" class="text-xl"></fa>
      </div>
      <p class="mb-0 leading-none tracking-wide">
        Personal Workspace
      </p></a-layout-header
    >
    <a-layout :hasSider="true">
      <a-layout-sider
        class="border-r bg-sidebar"
        :collapsedWidth="48"
        :collapsed="true"
        :style="{
          overflow: 'auto',
        }"
      >
        <ProjectSidebar class="mt-3"></ProjectSidebar
      ></a-layout-sider>
      <a-layout-content>
        <splitpanes class="bg-white default-theme">
          <pane size="20" class="bg-sidebar">
            <span>1</span>
          </pane>
          <pane size="80" class="shadow-md">
            <div class="min-h-full p-4 m-6 bg-white border rounded">
              <Editor></Editor>
            </div>
          </pane> </splitpanes
      ></a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import Editor from "@/editor/index.vue";
import ProjectSidebar from "~/layouts/project/index.vue";
// import EditorJS from "@editorjs/editorjs";
// import Header from "@editorjs/header";
// import List from "@editorjs/list";

// import { SimpleImage } from "@/block/sql";

// import SQLEditor from "@common/sqleditor/index.vue";

// import CodeMirror from "codemirror";
// import "codemirror/lib/codemirror.css";

// import "codemirror/mode/sql/sql.js";

// import { EditorView } from "@codemirror/next/view";

// import { EditorState } from "@codemirror/next/state";
// // import { history, historyKeymap } from "@codemirror/next/history";
// // import { defaultKeymap } from "@codemirror/next/commands";
// // import { defaultHighlightStyle } from "@codemirror/next/highlight";
// import { sql, PostgreSQL } from "@codemirror/next/lang-sql";

// // import { lineNumbers } from "@codemirror/next/gutter";

// import { basicSetup } from "@codemirror/next/basic-setup";

// import { highlightActiveLine } from "@codemirror/next/highlightActiveLine";

// import base style

export default defineComponent({
  components: {
    ProjectSidebar,
    Editor,
  },
  data() {
    return {
      editor: null,
    };
  },
  setup() {
    const router = useRouter();
    const handleBack = () => {
      router.push("assets");
    };

    return {
      handleBack,
    };
  },
  mounted() {},
});
</script>

<style lang="less">
</style>

<route lang="yaml">
  meta:
    layout: project
    requiresAuth: true
</route>
 -->
