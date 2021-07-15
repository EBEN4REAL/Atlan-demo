<template>
{{id}}
{{ isLoading }}
{{data}}
{{error}}
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useHead } from "@vueuse/head";

import useGTCEntity from '~/composables/glossary/useGtcEntity';
import { watch } from "vue";
import { onMounted } from "vue";

export default defineComponent({
  props:{
    id: {
      type: String,
      required: true,
      default: ''
    }
  },
  setup(props) {
    const id = computed(() => props.id);

    const {data, error, isLoading, fetchEntity } = useGTCEntity('term');

    onMounted(() => {
      fetchEntity(id.value)
    })

    watch(id, (newGuid) => {
      fetchEntity(newGuid)
    })

    return {
      data,
      error,
      isLoading,
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
