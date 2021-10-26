<template>
    <div class="w-full">
        <a-tree-select
            v-model:treeExpandedKeys="expandedKeys"
            :value="selectedValue"
            style="width: 100%"
            :dropdown-style="{
                maxHeight: '400px',
                overflow: 'auto',
            }"
            :tree-data="treeData"
            :class="$style.connector"
            placeholder="Select a connector"
            dropdown-class-name="connectorDropdown"
            :allow-clear="true"
            :tree-data-simple-mode="true"
            @change="onChange"
            @select="selectNode"
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
        <AssetDropdown
            v-if="connection"
            :connector="filteredConnector"
            :filter="data"
            @change="handleChange"
            @label-change="setPlaceholder($event, 'asset')"
        ></AssetDropdown>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, ref, Ref, toRefs } from 'vue'
    import { Components } from '~/api/atlas/client'

    import { capitalizeFirstLetter } from '~/utils/string'

    import AssetDropdown from '~/components/common/dropdown/assetDropdown.vue'

    import useConnectionData from '~/services2/meta/composable/useConnectionData'

    export default defineComponent({
        props: {
            data: {
                type: Object as PropType<{
                    attributeName: string
                    attributeValue: string
                }>,
                required: true,
            },
            filterSourceIds: {
                type: Array as PropType<string[]>,
                required: false,
                default() {
                    return []
                },
            },
        },
        components: {
            AssetDropdown,
        },
        emits: ['change', 'update:data'],
        setup(props, { emit }) {
            const { list, sourceList } = useConnectionData()

            const treeData = computed(() => {
                const mappedConnection = list.map((i) => ({
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

            const { data, filterSourceIds } = toRefs(props)

            const connector = computed(() => {
                if (data.value?.attributeName === 'connectorName')
                    return data.value?.attributeValue
                else {
                    let qfChunks = data.value?.attributeValue?.split('/')
                    return qfChunks?.length > 1 ? qfChunks[1] : ''
                }
            })

            // QualifiedName format -> tenant/connector/connection/.../.../...
            const connection = computed(() => {
                let qfChunks = data.value?.attributeValue?.split('/')
                return qfChunks?.length > 2
                    ? qfChunks.slice(0, 3).join('/')
                    : ''
            })

            // undefined is necessary here to show the placeholder
            const selectedValue = computed(
                () => connection.value || connector.value || undefined
            )
            const filteredList = computed(() =>
                filterSourceIds.value.length > 0
                    ? list.filter(
                          (item) => !filterSourceIds.value.includes(item.id)
                      )
                    : sourceList
            )

            const filteredConnector = computed(() =>
                filteredList.value.find((item) => item.id === connector.value)
            )

            function setPlaceholder(label: string, type: string) {
                placeholderLabel.value[type] = label
                if (type === 'connector') placeholderLabel.value.asset = ''
            }

            const expandedKeys = ref<string[]>([])

            const selectNode = (value, node?: any) => {
                console.log(value)
                const payload: Components.Schemas.FilterCriteria = {
                    attributeName: undefined,
                    attributeValue: undefined,
                }
                if (value) {
                    const chunks = value?.split('/')
                    if (chunks?.length === 1 && chunks[0]) {
                        payload.attributeName = 'connectorName'
                        payload.attributeValue = chunks[0]
                    } else if (chunks?.length > 2) {
                        payload.attributeName = 'connectionQualifiedName'
                        payload.attributeValue = value
                    }
                }
                emit('update:data', payload)
                emit('change')
            }

            const onChange = (value) => {
                if (!value) {
                    selectNode(undefined, undefined)
                }
            }

            // const list = computed(() => List)
            const checkedValues = ref([])
            const placeholderLabel: Ref<Record<string, string>> = ref({})

            const emitChangedFilters = () => {
                const criterion: Components.Schemas.FilterCriteria[] = []
                if (connection.value) {
                    criterion?.push({
                        attributeName: 'connectionQualifiedName',
                        attributeValue: connection.value,
                        operator: 'eq',
                    })
                } else if (connector.value) {
                    criterion?.push({
                        attributeName: 'connectorName',
                        attributeValue: connector.value,
                        operator: 'eq',
                    })
                }
                emit('change')
            }

            const handleChange = ({
                attributeName,
                attributeValue,
            }: Record<string, string>) => {
                if (attributeName && attributeValue) {
                    emit('update:data', { attributeName, attributeValue })
                    emit('change')
                } else {
                    selectNode(data.value?.attributeValue)
                    emitChangedFilters()
                }
            }

            return {
                data,
                handleChange,
                onChange,
                expandedKeys,
                selectNode,
                selectedValue,
                filteredList,
                list,
                checkedValues,
                treeData,
                capitalizeFirstLetter,
                connector,
                connection,
                filteredConnector,
                placeholderLabel,
                setPlaceholder,
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
