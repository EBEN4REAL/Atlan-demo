/* eslint-disable vue/require-default-prop */
<template>
    <div class="w-full">
        <a-tree-select
            :value="selectedValue"
            style="width: 100%"
            :dropdown-style="{
                maxHeight: '400px',
                maxWidth: '300px;',
                overflow: 'auto',
            }"
            :tree-data="treeData"
            :class="$style.connector"
            placeholder="Select a connector"
            dropdown-class-name="connectorDropdown"
            :allow-clear="true"
            :tree-data-simple-mode="true"
            @change="onChange"
        >
            <template #title="node">
                <div class="flex items-center" v-if="node.type == 'connector'">
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
                </div>
            </template>

            <template #suffixIcon>
                <AtlanIcon icon="ChevronDown" class="h-4 -mt-0.5 -ml-0.5" />
            </template>
        </a-tree-select>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, ref, Ref, toRefs } from 'vue'

    import { capitalizeFirstLetter } from '~/utils/string'
    import { useVModels } from '@vueuse/core'

    import useConnectionData from '~/composables/connection/useConnectionData'

    export default defineComponent({
        props: {
            connector: {
                type: String,
                required: false,
                default() {
                    return undefined
                },
            },
            connection: {
                type: String,
                required: false,
                default() {
                    return undefined
                },
            },
            filterSourceIds: {
                type: Array as PropType<string[]>,
                required: false,
                default() {
                    return []
                },
            },
        },
        components: {},
        emits: [
            'change',
            'update:data',
            'update:connector',
            'update:connection',
        ],
        setup(props, { emit }) {
            const { connector, connection } = useVModels(props, emit)
            const { list, sourceList } = useConnectionData()

            const selectedValue = ref(connection.value || connector.value)

            const treeData = computed(() => {
                const mappedConnection = list.value.map((i) => ({
                    id: i.attributes.qualifiedName,
                    key: i.attributes.qualifiedName,
                    pId: i.attributes.connectorName,
                    name: i.attributes.displayName || i.attributes.name,
                    value: i.attributes.qualifiedName,
                    connector: i.attributes.connectorName,
                    image: sourceList.find(
                        (s) => s.id === i.attributes.connectorName
                    )?.image,
                    count: i.attributes.assetCount,
                    type: 'connection',
                    isLeaf: true,
                    children: null,
                    slots: {
                        title: 'title',
                    },
                }))
                const mappedConnector = sourceList.map((i) => ({
                    id: i.id,
                    name: i.id,
                    key: i.id,
                    value: i.id,
                    connector: i.id,
                    image: i.image,
                    isLeaf: false,
                    children: null,
                    type: 'connector',
                    slots: {
                        title: 'title',
                    },
                }))
                mappedConnection.push(...mappedConnector)
                return mappedConnection
            })

            const onChange = (value) => {
                if (value) {
                    selectedValue.value = value
                    if (value.split('/').length > 1) {
                        connection.value = value
                        connector.value = null
                    } else {
                        connector.value = value
                        connection.value = null
                    }
                } else {
                    selectedValue.value = null
                    connector.value = null
                    connection.value = null
                }
                emit('change')
            }

            return {
                selectedValue,
                list,
                onChange,
                treeData,
                capitalizeFirstLetter,
            }
        },
    })
</script>
<style lang="less">
    .connectorDropdown {
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
