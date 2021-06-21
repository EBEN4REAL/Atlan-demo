<template>
  <ClassificationProfileWrapper
    :classificationName="classificationName"
  ></ClassificationProfileWrapper>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import ClassificationProfileWrapper from "~/components/admin/classifications/profileWrapper.vue";

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
    console.log(classificationName.value, "hello");
    return {
      classificationName,
    };
  },
});
</script>
<style lang="less" scoped></style>
