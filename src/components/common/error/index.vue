<template>
  <div
    class="flex flex-col items-center justify-center w-full h-full text-center"
  >
    <fa icon="fas exclamation-circle" class="mb-2 text-4xl text-red-500"></fa>
    {{ error || "Something went wrong. Please try again" }}
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