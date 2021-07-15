<template>
{{id}}
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { useHead } from "@vueuse/head";
import { computed } from "vue";

export default defineComponent({
  props: ["id"],
  setup(props) {
    const id = computed(() => props.id);

    return {
      id
    }
  },
});
</script>

<route lang="yaml">
  meta:
    layout: default
    requiresAuth: true
</route>
