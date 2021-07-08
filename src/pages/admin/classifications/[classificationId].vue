<template>
  <p class="text-2xl text-gray">Classifications</p>
  <ClassificationProfileWrapper
    :classificationName="classificationName"
  ></ClassificationProfileWrapper>
</template>

<script lang="ts">
import { defineComponent, computed, toRaw } from "vue";
import ClassificationProfileWrapper from "~/components/admin/classifications/profileWrapper.vue";
import { useHead } from "@vueuse/head";

export default defineComponent({
  name: "AssetClassificationProfileLayout",
  components: {
    ClassificationProfileWrapper,
  },
  props: {
    classificationId: String,
  },
  setup(props, context) {
    useHead({
      title: computed(() => props.classificationId),
    });
    const classificationName = computed(() => props.classificationId);
    return {
      classificationName,
    };
  },
});
</script>
<style lang="less" scoped></style>
