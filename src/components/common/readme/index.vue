<template>
  <div class="readme-wrapper w-2/3 h-min-1/2">
    <div
      class="
        ml-2
        py-2
        px-7
        flex
        justify-between
        text-lg
        w-full
        border
        bg-white
        rounded-t
      "
    >
      <div>README</div>
      <div v-if="editable" class="d-flex align-items-center">
        <a-button
          type="link"
          :variant="'btn btn-sm btn-link mb-0 btn-no-focus font-w700'"
          :loadingText="'Updating...'"
          iconMargin="mr-0"
          ><fa icon="fal save"></fa> Save</a-button
        >
        <a-button
          type="link"
          :variant="'btn btn-sm btn-link mb-0 btn-no-focus font-w700 text-muted'"
          @click="editable = false"
          :loading="false"
          :loadingText="'Cancelling...'"
          >Cancel</a-button
        >
      </div>
      <a-button
        v-else
        type="link"
        class="text-sm"
        @click="editable = true"
      >
        <fa icon="fa pencil" class="mx-2 text-xs"/>
        Edit
      </a-button>
    </div>
    <Editor placeholder="some placeholder" class="rounded-t-none" :editable="editable" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import Editor from "@/common/editor/index.vue";

export default defineComponent({
  components: {
    Editor,
  },
  setup() {
    const editable = ref(false);

    return {
      editable,
    };
  },
});
</script>

<style lang="less">
.container {
  display: flex;
  width: 100vw !important;
  align-items: center;
}
</style>

<route lang="yaml">
  meta:
    layout: project
    requiresAuth: true
</route>

