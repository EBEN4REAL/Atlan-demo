<template>
  <div class="flex flex-row py-4 pl-6">
    <div><img :src="TermSvg" /></div>
    
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

import TermSvg from "~/assets/images/gtc/term/term.png";

interface PropsType {
  term: Components.Schemas.AtlasGlossaryTerm;
}

export default defineComponent({
  components: {},
  props: ["term"],
  setup(props: PropsType) {
    const term = computed(() => props.term);
    return {
      term,
      TermSvg
    };
  },
});
</script>