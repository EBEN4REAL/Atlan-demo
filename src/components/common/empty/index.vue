<template>
  <div
    class="flex flex-col items-center justify-center w-full h-full text-center"
  >
    {{ empty }}
    <a-button class="mt-2" @click="handleClick">{{ buttonText }}</a-button>
  </div>
</template>
  
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    empty: {
      type: String,
      required: false,
      default() {
        return "";
      },
    },
    buttonText: {
      type: String,
      required: false,
      default() {
        return "";
      },
    },
  },
  emits: ["event"],
  setup(props, { emit }) {
    const handleClick = () => {
      emit("event");
    };
    return {
      handleClick,
    };
  },
});
</script>