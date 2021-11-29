/* eslint-disable vue/require-default-prop */
<template>
    <div class="w-full">
        <a-tree-select
            style="width: 100%"
            :dropdown-style="{
                maxHeight: '400px',
                maxWidth: '300px;',
                overflow: 'auto',
            }"
            :tree-data="treeData"
            :class="$style.connector"
            placeholder=""
            dropdown-class-name="sqlDropdown"
            :allow-clear="true"
            :tree-data-simple-mode="true"
        >
            <template #title="node">
                {{ node }}
                <!-- <div class="flex items-center" v-if="node.type == 'connector'">
                    <img :src="node.image" class="w-auto h-4 mr-1" />
                    <div v-if="node.type == 'connector'" class="text-gray-700">
                        {{ capitalizeFirstLetter(node.name) }}
                    </div>
                </div>
                <div class="flex flex-col" v-else>
                    <div class="flex items-center">
                        <img :src="node.image" class="w-auto h-4 mr-1" />
                        <div class="">{{ node.name }}</div>
                    </div>

                    <div class="text-xs text-gray-500">
                        {{ node.count }} assets
                    </div>
                </div> -->
            </template>

            <template #suffixIcon>
                <AtlanIcon icon="ChevronDown" class="h-4 -mt-0.5 -ml-0.5" />
            </template>
        </a-tree-select>
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        PropType,
        ref,
        Ref,
        toRefs,
        watch,
    } from 'vue'

    import { useVModels } from '@vueuse/core'

    import { useQueryCredential } from '~/composables/credential/useQueryCredential'

    export default defineComponent({
        props: {
            props: {
                modelValue: {
                    type: [Array, String],
                    required: false,
                },
                query: {
                    type: String,
                    required: false,
                    default: () => '',
                },
                credential: {
                    type: Object,
                    required: false,
                },
            },
        },
        setup(props, { emit }) {
            // const { modelValue } = useVModels(props, emit)
            // const localValue = ref(modelValue.value)
            const { credential, query } = toRefs(props)

            const body = computed(() => {
                return {
                    ...credential.value,
                    query: query.value,
                }
            })

            const { data, refresh, isLoading, error } = useQueryCredential(body)

            watch(credential, () => {
                refresh()
            })

            const treeData = ref([])
            watch(data, () => {
                treeData.value = data.value.results?.map((item) => ({
                    id: item.name,
                    value: item.name,
                    label: item.name,
                    slots: {
                        title: 'title',
                    },
                }))
            })

            // const treeData = computed(() => {
            //     const mappedConnection = list.map((i) => ({
            //         id: i.attributes.qualifiedName,
            //         key: i.attributes.qualifiedName,
            //         pId: i.attributes.connectorName,
            //         name: i.attributes.displayName || i.attributes.name,
            //         value: i.attributes.qualifiedName,
            //         connector: i.attributes.connectorName,
            //         image: sourceList.find(
            //             (s) => s.id === i.attributes.connectorName
            //         )?.image,
            //         count: i.attributes.assetCount,
            //         type: 'connection',
            //         isLeaf: true,
            //         children: null,
            //         slots: {
            //             title: 'title',
            //         },
            //     }))
            //     const mappedConnector = sourceList.map((i) => ({
            //         id: i.id,
            //         name: i.id,
            //         key: i.id,
            //         value: i.id,
            //         connector: i.id,
            //         image: i.image,
            //         isLeaf: false,
            //         children: null,
            //         type: 'connector',
            //         slots: {
            //             title: 'title',
            //         },
            //     }))
            //     mappedConnection.push(...mappedConnector)
            //     return mappedConnection
            // })

            return {
                treeData,
            }
        },
    })
</script>
<style lang="less">
    .sqlDropdown {
        .ant-select-tree-switcher {
            width: 18px !important;
            height: 24px !important;
            line-height: 24px !important;
            margin-top: -12px !important;
        }
        .ant-select-switcher-icon {
            font-weight: normal !important;
        }
    }
</style>
<style lang="less" module>
    .connector {
        :global(.ant-select-selector) {
            box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
            @apply rounded-lg !important;
        }
    }
</style>
