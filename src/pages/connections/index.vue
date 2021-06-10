<template>
  <div class="h-full overflow-auto">
    <div class="flex justify-between px-6 pt-6 mb-2">
      <h2 class="text-lg font-medium">Overview</h2>
      <fa icon="fal sync"></fa>
    </div>
    <div class="grid grid-cols-12 gap-6 px-6">
      <div class="col-span-4 p-4 bg-white rounded-md shadow-sm">
        <p class="mb-0 text-xs tracking-wide text-gray-500 uppercase">
          Connections
        </p>
        <div class="mt-2 text-2xl font-medium text-gray-800">214</div>
      </div>
      <div class="col-span-4 p-4 bg-white rounded-md shadow-sm">
        <p class="mb-0 text-xs tracking-wide text-gray-500 uppercase">
          Connections
        </p>
        <div class="mt-2 text-2xl font-medium text-gray-800">214</div>
      </div>
    </div>
    <div class="flex justify-between px-6 pt-6 mb-1">
      <h2 class="font-medium text-md">Run History</h2>
      <fa icon="fal sync"></fa>
    </div>
    <div class="">
      <div class="px-6">
        <RunList></RunList>
      </div>
      <!-- <div
      class="flex items-center justify-center w-full px-5 py-4 border-b border-gray-100 bg-gray-50"
    ></div> -->
    </div>
  </div>
</template>
      
      
<script lang="ts">
import { defineComponent } from "vue";
import RunList from "@/connection/home/runlist/index.vue";

export default defineComponent({
  name: "HelloWorld",
  components: { RunList },
  data() {
    return {};
  },
  mounted() {},
  computed: {},
  methods: {},
});
</script>
      
      
<route lang="yaml">
meta:
  layout: default
  requiresAuth: true
</route>