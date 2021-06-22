<template> </template>

<script lang="ts">
import { defineComponent, toRaw } from "vue";
import { useStore } from "~/store";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Classifications",
  setup() {
    const router = useRouter();
    const store = useStore();
    let alternateClassificationName = "demo";
    const classifications = toRaw(store.state.classification.classifications);
    if (classifications.length > 0) {
      alternateClassificationName = classifications[0].name;
      console.log(alternateClassificationName, "alternate");
    }
    router.push(`/admin/classifications/${alternateClassificationName}`);
  },
});
</script>
<style lang="less" scoped></style>
