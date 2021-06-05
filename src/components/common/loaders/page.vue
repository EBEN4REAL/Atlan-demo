<template>
  <div class="min-h-screen flex min-w-screen items-center justify-center">
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
        return "";
      },
    },
  },
  computed: {},
  mounted() {},
  methods: {},
});
</script>