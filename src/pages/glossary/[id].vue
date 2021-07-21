<template>
  <div class="px-12 mb-12">
    <div class="flex flex-row mt-6 mb-5">
      <div class="mr-5">
        <GlossarySvg />
      </div>
      <div class="flex flex-col">
        <span class="secondaryHeading">GLOSSARY</span>
        <h1 class="text-3xl leading-9 m-0 p-0 text-black font-normal">
          {{ title }}
        </h1>
        <div class="text-sm leading-6 text-gray-400 font-normal">
          <span class="mr-3">Cerated 2 weeks ago by @anshul</span>
          <span>&bull;</span>
          <span class="ml-3">Edited 1 week ago by @anshul</span>
        </div>
      </div>
    </div>
    <div class="flex flex-row">
      <a-tabs default-active-key="1" @change="callback" class="border-0">
        <a-tab-pane key="1" tab="Overview">
          <GlossaryProfileOverview :glossary="glossary" />
        </a-tab-pane>
        <a-tab-pane key="2" tab="Terms & Categories">
          Terms & Categories
        </a-tab-pane>
        <a-tab-pane key="3" tab="Activity"> Activity </a-tab-pane>
        <a-tab-pane key="3" tab="Bots"> Bots </a-tab-pane>
        <a-tab-pane key="3" tab="Permissions"> Permissions </a-tab-pane>
      </a-tabs>
      <GlossaryTopTerms v-if="glossaryTerms?.length" :terms="glossaryTerms" />
    </div>

    <!-- <hr /> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useHead } from "@vueuse/head";

import useGTCEntity from "~/composables/glossary/useGtcEntity";
import useGlossaryTerms from "~/composables/glossary/useGlossaryTerms";
import { watch } from "vue";
import { onMounted } from "vue";

import Readme from "@/common/readme/index.vue";
import GlossaryProfileOverview from "@/glossary/glossaryProfileOverview.vue";
import GlossaryTopTerms from "@/glossary/glossaryTopTerms.vue";
import GlossarySvg from "~/assets/images/glossary/glossary.svg";

export default defineComponent({
  props: {
    id: {
      type: String,
      required: true,
      default: "",
    },
  },
  components: { Readme, GlossaryProfileOverview, GlossaryTopTerms,GlossarySvg },
  setup(props) {
    const id = computed(() => props.id);

    const {
      data: glossary,
      error,
      isLoading,
      fetchEntity,
    } = useGTCEntity("glossary");
    const {
      data: glossaryTerms,
      termsError,
      termsLoading,
      fetchGlossaryTerms,
    } = useGlossaryTerms();

    const title = computed(() => glossary.value?.name);
    const shortDescription = computed(() => glossary.value?.shortDescription);
    const termCount = computed(() => glossary.value?.terms?.length ?? 0);
    onMounted(() => {
      fetchEntity(id.value);
      fetchGlossaryTerms(id.value);
    });

    watch(id, (newGuid) => {
      fetchEntity(newGuid);
      fetchGlossaryTerms(newGuid)
    });

    return {
      glossary,
      title,
      shortDescription,
      termCount,
      error,
      isLoading,
      id,
      glossaryTerms,
    };
  },
});
</script>
<style lang="less">
.secondaryHeading {
  @apply tracking-widest text-xs text-gray-400 leading-5;
}
</style>

<route lang="yaml">
  meta:
    layout: default
    requiresAuth: true
</route>
