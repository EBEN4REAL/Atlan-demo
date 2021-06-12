<template>
  <div class="flex w-full h-full">
    <div class="flex flex-col w-1/4 h-full overflow-hidden bg-white border-r">
      <div class="px-4 py-4 pb-2">
        <p class="mb-0 text-2xl">Admin Centre</p>
      </div>

      <div class="flex flex-grow w-full px-4 mb-2 overflow-y-auto">
        <a-menu mode="inline" :class="$style.sidebar" @click="handleClick">
          <a-menu-item-group class="mb-3" title="Workspace">
            <a-menu-item key="general"> General </a-menu-item>

            <a-menu-item key="members"> Members </a-menu-item>
            <a-menu-item key="groups">Groups</a-menu-item>
            <a-menu-item key="apikeys"> API Keys </a-menu-item>
            <a-menu-item key="integrations"> Integrations </a-menu-item>
            <a-menu-item key="billing"> Billing & License </a-menu-item>
          </a-menu-item-group>

          <a-menu-item-group class="mb-3" title="Access Control">
            <a-menu-item key="classifications"> Classifications </a-menu-item>
            <a-menu-item key="metadata polcies">
              Metadata Policies
            </a-menu-item>
            <a-menu-item key="data policies"> Data Policies </a-menu-item>
          </a-menu-item-group>
          <a-menu-item-group class="mb-3" title="Metadata Management">
            <a-menu-item key="bm"> Business Metadata </a-menu-item>
            <a-menu-item key="enum"> Enums </a-menu-item>
          </a-menu-item-group>
          <a-menu-item-group class="mb-3" title="Cloud & Compliance">
            <a-menu-item key="accesslogs"> Access Logs </a-menu-item>
            <a-menu-item key="auditlogs"> Audit Logs </a-menu-item>
            <a-menu-item key="releases"> Releases </a-menu-item>
            <a-menu-item key="health"> Health Status </a-menu-item>
            <a-menu-item key="observe"> Observability </a-menu-item>
          </a-menu-item-group>
        </a-menu>
      </div>
    </div>
    <div class="w-3/4 p-6">
      <input type="file" @change="loadTextFromFile" />
      <a-upload
        v-model:file-list="fileList"
        name="file"
        @change="handleFileUpload"
      >
        <a-button>
          <upload-outlined></upload-outlined>
          Click to Upload
        </a-button>
      </a-upload>
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import xml2js from "~/cjs/xml2js.js";
//import xml2js from "xml2js";
const Xml2js = xml2js.default ? xml2js.default : xml2js;

const reader = new FileReader();

interface FileIte {
  uid: string;
  name?: string;
  status?: string;
  response?: string;
  url?: string;
}

interface FileInfo {
  file: FileItem;
  fileList: FileItem[];
}

export default defineComponent({
  setup() {
    const router = useRouter();
    const handleClick = (e: Event) => {
      router.push("/admin/" + e.key);
    };

    const fileList = ref([]);

    const handleFileUploadSetup = (info: FileInfo) => {
      console.log(info.file);

      reader.readAsText(info.file);
    };

    return {
      fileList,
      handleClick,
      handleFileUploadSetup,
    };
  },
  methods: {
    loadTextFromFile(ev) {
      const file = ev.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => this.$emit("load", e.target.result);
      reader.readAsText(file);

      var parser = new Xml2js.Parser();
      reader.addEventListener("load", (event) => {
        const xml = event.target.result;
        console.log("onFileUpload -> xml", xml);
        parser.parseString(xml, (err, jsonResult) => {
          console.dir(jsonResult);
          //this.parseJSONFromUploadedXMLFile(jsonResult);
        });
      });
    },
    handleFileUpload(file) {
      console.log(file.fileList);
      reader.readAsText(file.file);
      reader.addEventListener("load", (event) => {
        const xml = event.target.result;
        console.log("onFileUpload -> xml", xml);
        // parseString(xml, (err, jsonResult) => {
        //   console.dir(jsonResult);
        //   //this.parseJSONFromUploadedXMLFile(jsonResult);
        // });
      });
    },
  },
});
</script>


<style lang="less" module>
.sidebar {
  &:global(.ant-menu-inline) {
    @apply border-none !important;
  }

  :global(.ant-menu-item-group-title) {
    @apply px-0;
  }

  :global(.ant-menu-item) {
    height: 32px;
    line-height: 32px;
  }

  :global(.ant-menu-item::after) {
    @apply border-none !important;
  }

  :global(.ant-menu-item-selected) {
    @apply rounded !important;
  }
}
</style>


<route lang="yaml">
  meta:
    layout: default
    requiresAuth: true
</route>