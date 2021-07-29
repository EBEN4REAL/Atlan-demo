<template>
<div>
  {{guid}}
{{ isLoading }}
{{data}}
{{error}}
</div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, onMounted } from "vue";

import useGTCEntity from '~/composables/glossary/useGtcEntity';

interface PropsType {
  id: string;
}

export default defineComponent({
  props:{
    id: {
      type: String,
      required: true,
      default: ''
    }
  },
  setup(props: PropsType) {
    const guid = computed(() => props.id);

    const {data, error, isLoading, fetchEntity } = useGTCEntity('term');

    onMounted(() => {
      fetchEntity(guid.value)
    })

    watch(guid, (newGuid) => {
      fetchEntity(newGuid)
    })

    return {
      data,
      error,
      isLoading,
      guid
}
  },
});
</script>

<route lang="yaml">
  meta:
    layout: default
    requiresAuth: true
</route>
