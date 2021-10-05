<template>
    <div v-if="!isLoaded" class="">
        <div class="w-full px-5 mt-2">
        <p v-for="(v, k) in selectedWorkflow.metadata.labels" :key="v" class="mb-2">
            <div class="mb-1 text-sm tracking-wide text-gray-500">{{ capitalizeFirstLetter(k.split('-').join(' '))  }}:</div>
            <div class="mb-0 text-gray-700 break-all">{{ v}}</div>
        </p>
    </div>
    </div>
    <div
        v-else
        class="flex items-center justify-center mt-4 text-sm leading-none"
    >
        <a-spin size="small" class="mr-2 leading-none"></a-spin
        ><span>Getting info</span>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        defineAsyncComponent,
        Ref,
        PropType,
        toRefs,
        watch,
    } from 'vue'
    import {capitalizeFirstLetter} from '~/utils/string'
    
    export default defineComponent({
        name: 'InfoTab',
        components: {
        },
        props: {
            selectedWorkflow: {
                type: Object,
                required: true,
            },
            isLoaded: {
                type: Boolean,
            },
        },

        setup(props) {
            const refMap: Ref<{
                [key: string]: any
            }> = ref({})

            
            // const { localStorage } = window
            // // ! FIX this, is it needed, no collapse yet
            // function getUserDefaultCollapseOrderInInfoTab(): string[] {
            //     let activeKeyOrder: string[] | undefined
            //     if (localStorage.getItem('asset_preview_info_tab')) {
            //         activeKeyOrder = JSON.parse(
            //             localStorage.getItem('asset_preview_info_tab') as any
            //         )
            //     }
            //     if (activeKeyOrder && activeKeyOrder?.length > 0)
            //         return JSON.parse(
            //             localStorage.getItem('asset_preview_info_tab') as any
            //         ) as string[]

            //     return ['assetDetails', 'linkedAsset']
            // }
            // function setUserDefaultCollapseOrderInInfoTab(
            //     activeKeyOrder: string[]
            // ) {
            //     localStorage.setItem(
            //         'asset_preview_info_tab',
            //         JSON.stringify(activeKeyOrder)
            //     )
            // }
            
            // const activeKey: Ref<string[]> = ref(
            //     getUserDefaultCollapseOrderInInfoTab()
            // )

            // const handleChange = () => {}
            // const handleCollapseChange = () => {
            //     setUserDefaultCollapseOrderInInfoTab(activeKey.value)
            // }

            return {
                capitalizeFirstLetter,
                refMap,
            }
        },
    })
</script>

<style lang="less" module>
    .filter {
        :global(.ant-collapse-item) {
            @apply border-none;
        }

        :global(.ant-collapse-header) {
            @apply px-5 !important;
            @apply py-4 !important;
        }

        :global(.ant-collapse-arrow) {
            font-size: 0.85rem !important;
            right: 20px !important;
        }

        :global(.ant-collapse-content-box) {
            padding-right: 0px;
            padding-left: 0px;
            padding-top: 0px !important;
            @apply pb-0 !important;
        }
    }
</style>
