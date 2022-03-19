<template>
    <div class="px-3 py-2 bg-white text-gray">
        <!-- Output Parameters -->
        <h3 class="text-base">Parameters</h3>
        <div
            v-if="selectedPod?.outputs?.parameters"
            class="flex flex-col text-sm gap-y-1"
        >
            <template v-for="param in selectedPod?.outputs?.parameters">
                <span class="mt-2 text-gray-500">{{ param.name }}</span>
                <span class="text-gray">{{ param.value }}</span>
            </template>
        </div>
        <span class="text-gray-500" v-else>No output parameters</span>

        <!-- Output Artefacts -->
        <h3 class="mt-4 text-base">Artifacts</h3>
        <div
            v-if="selectedPod?.outputs?.artifacts"
            class="flex flex-col text-sm"
        >
            <div
                v-for="param in selectedPod?.outputs?.artifacts"
                class="flex items-center gap-x-2 gap-y-1"
            >
                <img :src="s3logo" class="w-auto h-4" />
                <a
                    :href="getS3url(param.name, param.s3.key)"
                    class="text-primary hover:underline"
                >
                    {{ param.name }}
                </a>
            </div>
        </div>
        <span class="text-gray-500" v-else>No output artifacts</span>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, toRefs } from 'vue'
    import s3logo from '~/assets/images/source/aws-s3.png'

    export default defineComponent({
        name: 'NodeOverview',
        components: {},
        // mixins: [WorkflowMixin],
        props: {
            selectedPod: {
                type: Object,
                required: false,
                default: () => ({}),
            },
            selectedRun: {
                type: Object,
                required: true,
            },
        },

        setup(props) {
            const { selectedPod, selectedRun } = toRefs(props)
            const getS3url = (fileName: string, url: string) =>
                selectedRun.value?.metadata?.name && selectedPod.value?.id
                    ? `/api/orchestration/artifacts/default/${selectedRun.value.metadata.name}/${selectedPod.value?.id}/${fileName}`
                    : url

            return { s3logo, getS3url }
        },
    })
</script>
