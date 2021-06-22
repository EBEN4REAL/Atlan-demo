<template>
  <ClassificationProfileWrapper
    :classificationName="classificationName"
  ></ClassificationProfileWrapper>
</template>

<script lang="ts">
import { defineComponent, computed, toRaw } from "vue";
import ClassificationProfileWrapper from "~/components/admin/classifications/profileWrapper.vue";
import { useStore } from "~/store";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "AssetClassificationProfileLayout",
  components: {
    ClassificationProfileWrapper,
  },
  props: {
    classificationId: String,
  },
  setup(props, context) {
    const classificationName = computed(() => props.classificationId);
    return {
      classificationName,
    };
  },
});
</script>
<style lang="less" scoped></style>
