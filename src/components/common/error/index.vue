<template>
  <div class="flex items-center justify-center min-h-screen min-w-screen">
    <fa icon="fal exclamation-triangle" class="text-red-500"></fa>
    {{ error }}
  </div>
</template>
  
  <script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "HelloWorld",
  props: {
    error: {
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