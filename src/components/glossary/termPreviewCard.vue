<template>
  <div class="flex flex-row py-4 border-b-2">
    <div><TermSvg /></div>
    <div class="flex flex-col ml-4">
      <h3 class="text-sm leading-5 text-gray-500">{{ term.name }}</h3>
      <div class="text-xs leading-4 text-gray-400">
        {{ term.shortDescription }}
      </div>
      <div class="text-sm leading-5">{{ term.createdBy }}</div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from "vue";

import { Components } from "~/api/atlas/client";

import * as TermSvg from "~/assets/images/glossary/term.svg";

interface PropsType {
  term: Components.Schemas.AtlasGlossaryTerm;
}

export default defineComponent({
  props: ["term"],
  components: {TermSvg},
  setup(props: PropsType) {
    const term = computed(() => props.term);
    return {
      term,
    };
  },
});
</script>