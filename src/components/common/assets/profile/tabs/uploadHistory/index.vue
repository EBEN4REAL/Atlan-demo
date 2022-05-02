<template>
    <div v-if="!isLoading">
        <div v-for="run in runs" :key="item" class="m-5">
            <RunItem :run="run" />
        </div>
    </div>
</template>

<script lang="ts">
    import {
        watch,
        defineComponent,
        ref,
        PropType,
        computed,
        toRefs,
    } from 'vue'
    // composables
    import { useRunDiscoverList } from '~/workflowsv2/composables/useRunDiscoverList'
    import RunItem from '~/components/common/assets/profile/tabs/uploadHistory/item.vue'

    export default defineComponent({
        name: 'UploadHistoryTab',
        components: { RunItem },
        props: {},
        setup(props) {
            // data
            const limit = ref(30)
            const offset = ref(0)

            const facets = computed(() => ({
                prefix: 'atlan-gtc-bulk-upload-04880942',
                filterOut: [
                    'atlan-typedef-seeder',
                    'atlan', // atlan-upadate
                    'cloud-es-log-policy',
                    'cloud-backups',
                ],
            }))

            const preference = ref({
                sort: 'metadata.creationTimestamp-desc',
            })

            const {
                list: runs,
                quickChange,
                resetState,
                isLoading,
                data,
            } = useRunDiscoverList({
                facets,
                limit,
                offset,
                preference,
            })

            watch(runs, () => {
                console.log(runs.value)
                console.log(data.value)
            })
            return {
                runs,
                isLoading
            }
        },
    })
</script>

<style lang="less" module>
    .glossaryTermsTab {
        :global(.ant-tabs-tab:first-child) {
            @apply ml-0 !important;
        }
    }
</style>
