<template></template>

<script lang="ts">
import { defineComponent, toRaw } from "vue";
import { useClassificationStore } from "@/admin/classifications/_store";
import { useRouter } from "vue-router";
import { useHead } from "@vueuse/head";

export default defineComponent({
  name: "Classifications",
  setup() {
    useHead({
      title: "Classifications",
    });
    const router = useRouter();
    const store = useClassificationStore();
    let alternateClassificationName = "demo";
    const classifications = toRaw(store.classifications);
    if (classifications.length > 0) {
      alternateClassificationName = classifications[0].name;
      console.log(alternateClassificationName, "alternate");
    }
    router.push(`/admin/classifications/${alternateClassificationName}`);
  },
});
</script>
<style lang="less" scoped></style>
