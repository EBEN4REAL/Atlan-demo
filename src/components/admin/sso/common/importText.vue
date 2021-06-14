<template>
  <a-upload
    v-model:file-list="fileList"
    :before-upload="beforeUpload"
    :remove="handleRemove"
    name="file"
    accept=".txt, .doc,.docx,application/msword"
    :multiple="false"
    :showUploadList="false"
    @change="handleChange"
  >
    <a-button class="p-0" type="link">Import</a-button>
  </a-upload>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  emits: ["importCertificate"],
  setup(_, context) {
    const fileList = ref<any>([]);

    const beforeUpload = (file: any) => {
      fileList.value = [...fileList.value, file];
      return false;
    };

    const handleRemove = () => {
      fileList.value = [];
    };

    const handleChange = ({ file }: { file: any }) => {
      if (!file) {
        return;
      }
      const reader = new FileReader();
      reader.readAsText(file);
      reader.addEventListener("load", (event: any) => {
        const text = event.target?.result;
        if (text) context.emit("importCertificate", text);
      });
    };

    return {
      fileList,
      beforeUpload,
      handleRemove,
      handleChange,
    };
  },
});
</script>