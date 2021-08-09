<template>
    <div class="px-6 py-6">
        <div class="mb-3">
            <Logs></Logs>
        </div>
        <div class="mb-3">
            <p class="mb-1 tracking-wide text-gray-500">Running</p>
            <RunList></RunList>
        </div>
        <div>
            <p class="mb-1 tracking-wide text-gray-500">All</p>
            <ArchivedRunList></ArchivedRunList>
        </div>

        <!-- <div class="grid grid-cols-12 gap-6 px-6">
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
    </div> -->
        <!-- <div class="flex justify-between px-6 pt-6 mb-1">
      <h2 class="font-medium text-md">Run History</h2>
      <fa icon="fal sync"></fa>
    </div> -->
        <!-- <div class="">
      <div class="px-6">
        <RunList></RunList>
      </div>
    </div> -->
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import RunList from '@common/list/runs/index.vue'
    import Logs from '@common/logs/index.vue'
    import ArchivedRunList from '@common/list/archivedruns/index.vue'

    export default defineComponent({
        name: 'HelloWorld',
        components: {
            RunList,
            ArchivedRunList,
            Logs,
        },
        data() {
            return {}
        },
        computed: {},
        mounted() {},
        methods: {},
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
