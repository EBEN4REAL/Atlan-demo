<template>
  <div class="flex items-center justify-center w-full h-full">
    <a-spin :size="size"></a-spin>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "HelloWorld",
  props: {
    size: {
      type: String,
      required: false,
      default() {
        return "default";
      },
    },
  },
  computed: {},
  mounted() {},
  methods: {},
});
</script>