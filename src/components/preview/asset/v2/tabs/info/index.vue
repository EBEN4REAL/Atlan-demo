<template>
    <a-collapse
        v-model:activeKey="activeKey"
        :bordered="false"
        class="bg-transparent"
        :class="$style.filter"
    >
        <a-collapse-panel
            v-for="item in List"
            :key="item.id"
            class="bg-transparent"
        >
            <template #header>
                <div :key="item.id" class="flex justify-between select-none">
                    {{ item.label }}
                </div>
            </template>
            <component
                :is="item.component"
                :ref="
                    (el) => {
                        refMap[item.id] = el
                    }
                "
                :item="item"
                :data="dataMap[item.id]"
                :selectedAsset="selectedAsset"
                @change="handleChange"
            ></component>
        </a-collapse-panel>
    </a-collapse>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        defineAsyncComponent,
        Ref,
        PropType,
    } from 'vue'
    import { List } from './List'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        props: {
            id: String,
            componentData: {
                type: Object as PropType<any>,
            },
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        components: {
            assetDetails: defineAsyncComponent(
                () => import('./assetDetails/index.vue')
            ),
            metaData: defineAsyncComponent(
                () => import('./metaData/index.vue')
            ),
            linkedAsset: defineAsyncComponent(
                () => import('./linkedAsset/index.vue')
            ),
            heirarchy: defineAsyncComponent(
                () => import('./heirarchy/index.vue')
            ),
        },
        setup(props) {
            const refMap: Ref<{
                [key: string]: any
            }> = ref({})
            // Mapping of Data to child compoentns
            const dataMap: { [key: string]: any } = ref({})
            const activeKey: Ref<string> = ref('')

            const handleChange = (value: any) => {}
            return {
                List,
                activeKey,
                refMap,
                dataMap,
                handleChange,
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
            padding-left: 18px !important;
            padding-right: 0px !important;
        }
        :global(.ant-collapse-arrow) {
            left: 0px !important;
        }

        :global(.ant-collapse-content-box) {
            padding-right: 0px;
            padding-left: 0px;
            padding-top: 0px;
        }
    }
</style>
