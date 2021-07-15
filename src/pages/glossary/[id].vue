<template>
  <div class="px-12">
    <div class="flex flex-row mt-6 mb-5">
      <div class="mr-5">logo</div>
      <div class="flex flex-col">
        <span class="secondaryHeading"
          >GLOSSARY</span
        >
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
    <hr />
    <div class="mt-8 flex flex-row mb-10">
      <div class="flex flex-col mr-8">
        <span class="secondaryHeading">
          CATEGORIES
        </span>
        <span class="mt-2 text-xl leading-4 text-black">8</span>
      </div>
      <div class="flex flex-col mr-8">
        <span class="secondaryHeading">
          TERMS
        </span>
        <span class="mt-2 text-xl leading-4 text-black">{{ termCount }}</span>
      </div>
      <div class="flex flex-col mr-8">
        <span v-if="shortDescription" class="secondaryHeading">
          SHORT DESCRIPTION
        </span>
        <span class="mt-2 text-xs leading-4 text-gray-500">{{shortDescription}}</span>
      </div>
    </div>
    <Readme class="min-w-full" placeholder="Add some details here..." :parentAssetId="id" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useHead } from "@vueuse/head";

import useGTCEntity from "~/composables/glossary/useGtcEntity";
import { watch } from "vue";
import { onMounted } from "vue";

import Readme from "@/common/readme/index.vue"

export default defineComponent({
  props: {
    id: {
      type: String,
      required: true,
      default: "",
    },
  },
  components: {Readme},
  setup(props) {
    const id = computed(() => props.id);

    const { data, error, isLoading, fetchEntity } = useGTCEntity("glossary");

    const title = computed(() => data.value?.name);
    const shortDescription = computed(() => data.value?.shortDescription);
    const termCount = computed(() => data.value?.terms?.length ?? 0)
    onMounted(() => {
      fetchEntity(id.value);
    });

    watch(id, (newGuid) => {
      fetchEntity(newGuid);
    });

    return {
      data,
      title,
      shortDescription,
      termCount,
      error,
      isLoading,
      id,
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
