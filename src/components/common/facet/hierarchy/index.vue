<template>
    <div class="flex flex-col w-full px-3 gap-y-2">
        <ConnectorSelect
            v-model="localValue.connectorName"
            :showCount="true"
            class="w-full"
            :persona="persona"
            @change="handleConnectorChange"
        ></ConnectorSelect>
        <div class="flex items-center w-full" v-if="localValue.connectorName">
            <div class="mr-1">
                <a-tooltip title="Connection" placement="right">
                    <AtlanIcon class="w-4 h-4" icon="Connection"
                /></a-tooltip>
            </div>
            <div style="width: calc(100% - 22px)">
                <ConnectionSelect
                    :key="localValue.connectorName"
                    :connector="localValue.connectorName"
                    class="w-full"
                    :persona="persona"
                    v-model="localValue.connectionQualifiedName"
                ></ConnectionSelect>
            </div>
        </div>

        <AssetDropdown
            :key="localValue.connectionQualifiedName"
            class="mt-0 mb-0"
            :persona="persona"
            :connector="filteredConnector"
            @change="handleAssetChange"
            :bgGrayForSelector="false"
            :filter="localValue"
        ></AssetDropdown>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, watch, computed } from 'vue'

    import ConnectorSelect from '@/common/select/connector.vue'
    import ConnectionSelect from '@/common/select/connection.vue'
    import AssetDropdown from '@/common/dropdown/hierarchy/assetDropdown.vue'

    import { useVModels } from '@vueuse/core'

    import useAssetStore from '~/store/asset'
    import { useConnectionStore } from '~/store/connection'

    export default defineComponent({
        name: 'ConnectionFilter',
        props: {
            modelValue: {
                required: false,
                default() {
                    return {}
                },
            },
        },
        components: {
            ConnectorSelect,
            ConnectionSelect,
            AssetDropdown,
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)

            const store = useConnectionStore()
            const filteredConnector = computed(() =>
                store.getSourceList?.find(
                    (item) => item.id === localValue.value.connectorName
                )
            )

            watch(
                () => localValue.value.connectorName,
                (state, prevState) => {
                    if (!localValue.value.connectorName) {
                        delete localValue.value.connectorName
                        delete localValue.value.connectionQualifiedName
                    }

                    if (state !== prevState) {
                        delete localValue.value.connectionQualifiedName
                        delete localValue.value.attributeValue
                        delete localValue.value.attributeName
                    }

                    modelValue.value = localValue.value
                    emit('change')
                }
            )
            watch(
                () => localValue.value.connectionQualifiedName,
                (state, prevState) => {
                    if (!localValue.value.connectionQualifiedName) {
                        delete localValue.value.connectionQualifiedName
                    }
                    if (state !== prevState) {
                        delete localValue.value.attributeValue
                        delete localValue.value.attributeName
                    }

                    modelValue.value = localValue.value
                    emit('change')
                }
            )

            const assetStore = useAssetStore()

            const persona = computed(() => {
                if (assetStore.globalState.length === 2) {
                    if (assetStore.globalState[0] === 'persona') {
                        return assetStore.globalState[1]
                    }
                }
                return ''
            })

            const handleAssetChange = (val) => {
                if (val.attributeName && val.attributeValue) {
                    localValue.value.attributeValue = val.attributeValue
                    localValue.value.attributeName = val.attributeName
                    modelValue.value = localValue.value
                    emit('change')
                } else {
                    localValue.value.attributeValue = ''
                    localValue.value.attributeName = ''
                    emit('change')
                }
            }

            return {
                localValue,
                persona,

                filteredConnector,

                handleAssetChange,
            }
        },
    })
</script>
