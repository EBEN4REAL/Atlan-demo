<template>
  <div class="ml-9 py-6 pr-6 w-1/2 flex flex-col text-left">
    <h2 class="text-gray-700 text-xl leading-7 ml-6"> Top Terms</h2>
    <div v-for="term in termsList.slice(0, numberOfTerms)" :key="term.guid" class=" border-l-2 pl-6">
        <TermPreviewCard :term="term" />
    </div>
    <div class="items-start">
    <a-button type="link">See all {{termCount}} terms -></a-button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, onMounted } from "vue";
import { useHead } from "@vueuse/head";

import { Components } from "~/api/atlas/client";

import useGlossaryTerms from "~/composables/glossary/useGlossaryTerms";

import Readme from "@/common/readme/index.vue";
import TermPreviewCard from "@/glossary/termPreviewCard.vue";

interface PropsType {
  terms?: Components.Schemas.AtlasGlossaryTerm[];
  glossaryGuid?: string;
  numberOfTerms: number;
}

export default defineComponent({
  props: ["terms", "numberOfTerms"],
  components: { Readme, TermPreviewCard },
  setup(props: PropsType) {
    const terms = computed(() => props.terms);
    const glossaryGuid = computed(() => props.glossaryGuid);
   
   const {
      data: glossaryTerms,
      termsError,
      termsLoading,
      fetchGlossaryTerms,
    } = useGlossaryTerms();

    const numberOfTerms = computed(() => props.numberOfTerms ?? 3)

    const termsList = computed(() => {
        if(glossaryGuid.value) return glossaryTerms?.value
        else if (terms.value?.length) return terms?.value
        else return []
    })
    const termCount = computed(() => termsList.value?.length);


onMounted(() => {
      if (glossaryGuid.value) fetchGlossaryTerms(glossaryGuid.value);
    });

    return {
      termsList,
      termCount,
      numberOfTerms
    };
  },
});
</script>