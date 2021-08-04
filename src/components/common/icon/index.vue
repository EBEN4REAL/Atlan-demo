<template>
  <span class="svg-icon">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      :class="$props.class"
      :viewBox="`0 0 ${width} ${height}`"
    >
      <path fill="currentColor" :d="svgPath" /></svg
  ></span>
</template>
 
<script lang="ts">
import { defineComponent, computed } from "vue";
import {
  findIconDefinition,
  IconName,
  IconPrefix,
} from "@fortawesome/fontawesome-svg-core";

export default defineComponent({
  name: "Icon",
  props: {
    icon: {
      type: String,
      required: false,
      default() {
        return "fal fa-user";
      },
    },
    class: String,
  },
  setup(props) {
    let iconArray: any[] = [];

    if (props.icon) {
      iconArray = props.icon.split(" ");
    }

    let definition: any = null;
    if (iconArray.length > 0) {
      definition = computed(() =>
        findIconDefinition({
          prefix: <IconPrefix>iconArray[0],
          iconName: <IconName>iconArray[1],
        })
      );
    }

    const width = computed(() => {
      if (!definition?.value) {
        return 0;
      }
      return definition?.value.icon[0];
    });
    const height = computed(() => {
      if (!definition?.value) {
        return 0;
      }

      return definition?.value.icon[1];
    });
    const svgPath = computed(() => {
      if (!definition?.value) {
        return "";
      }

      return <string>definition.value.icon[4];
    });
    //   height = computed(() => definition.value.icon[1]);
    //   svgPath = computed(() => <string>definition.value.icon[4]);

    return { width, height, svgPath };
  },
});
</script>

<style lang="less" scoped>
</style>