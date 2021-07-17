<template>
  <div class="w-full pt-4 overflow-y-auto rounded container-height">
    <div class="flex items-stretch">
      <div class="flex">
        <div
          class="flex items-center justify-center py-0.5 px-1.5 border rounded mr-2"
        >
          <img
            src="https://img.icons8.com/ios/50/000000/notion.png"
            alt="notion"
            class="w-6 h-6 mr-2"
          />
          <p class="mb-0 text-gray-500">Notion</p>
        </div>
      </div>
      <div class="flex">
        <div
          class="flex items-center justify-center py-1 px-1.5 border rounded mr-2"
        >
          <img
            src="https://img.icons8.com/ios/50/000000/notion.png"
            alt="notion"
            class="w-6 h-6 mr-2"
          />
          <p class="mb-0 text-gray-500">Project Gdrive</p>
        </div>
      </div>
      <div class="">
        <a-button class="h-full px-2.5 rounded p-2">
          <span class="flex items-center justify-center">
            <fa icon="fal plus"></fa
          ></span>
        </a-button>
      </div>
    </div>
    <div class="mt-8 border rounded h-80">
      <p class="px-4 py-2 text-lg border-b text-gray-dark">Project Overview</p>
    </div>
    <div class="flex h-64 mt-6">
      <div class="flex-1 mr-6 border rounded">
        <p class="px-4 py-2 text-lg border-b text-gray-dark">FAQs</p>
      </div>
      <div class="flex-1 h-64 border rounded">
        <p class="px-4 py-2 text-lg border-b text-gray-dark">Flat Files</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject, toRaw, Ref, watch } from "vue";
import { useHead } from "@vueuse/head";

export default defineComponent({
  components: {},
  props: {
    id: String,
  },
  setup(props) {
    useHead({
      title: "Project Home",
    });

    return {};
  },
});
</script>

<style lang="less" scoped>
.view {
  border: 3px solid white;
  margin-left: -8px;
}
.container-height {
  height: calc(100vh - 20rem);
}
</style>

<route lang="yaml">
      meta:
        layout: default
        requiresAuth: true
    </route>
