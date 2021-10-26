<template>
    <div v-if="!isLoaded" class="">
        <div class="w-full px-5 mt-2">
            <p v-for="(v, k) in selectedWorkflow?.labels" :key="v" class="mb-2">
                <template v-if="k !== 'com.atlan.orchestration/atlan-ui'">
                    <div
                        class="mb-1 text-sm tracking-wide text-gray-500 capitalize "
                    >
                        {{ formatLabel(k) }}:
                    </div>
                    <div class="mb-0 text-gray-700 break-all">{{ v }}</div>
                </template>
            </p>
        </div>
    </div>
    <div
        v-else
        class="flex items-center justify-center h-full mt-4 text-sm leading-none "
    >
        <a-spin size="small" class="mr-2 leading-none"></a-spin>
        <span>Getting info</span>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
        name: 'InfoTab',
        components: {},
        props: {
            selectedWorkflow: {
                type: Object,
                required: true,
            },
            isLoaded: {
                type: Boolean,
            },
        },

        setup() {
            const formatLabel = (k) => {
                const nameSpace = k.split('.')[0]
                if (nameSpace === 'workflows' || nameSpace === 'com')
                    return k.split('/')[k.split('/').length - 1]
                if (nameSpace === 'org') {
                    const split = k.split('.')
                    return split[split.length - 1]
                }
                return k
            }
            return {
                formatLabel,
            }
        },
    })
</script>

<style lang="less" module></style>
