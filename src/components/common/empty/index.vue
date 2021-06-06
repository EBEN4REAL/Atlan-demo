<template>
  <div class="flex items-center justify-center min-h-screen min-w-screen">
    {{ empty }}
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
  },
  computed: {},
  mounted() {},
  methods: {},
});
</script>