<template>
    <div class="flex w-full px-4 gap-x-3">
        <div v-if="connector === '__glossary'" class="flex items-center">
            <GlossarySelect
                :key="connector"
                v-model="localValue.glossaryQualifiedName"
                placeholder="All Glossary"
                class="w-full"
                :persona="persona"
            ></GlossarySelect>
        </div>
        <div v-else class="flex items-center" style="min-width: 150px">
            <ConnectionSelect
                :key="connector"
                v-model="localValue.connectionQualifiedName"
                :connector="connector"
                placeholder="All Connections"
                class="w-full"
                :persona="persona"
            ></ConnectionSelect>
        </div>

        <AssetDropdown
            :key="localValue.connectionQualifiedName"
            :persona="persona"
            :connector="filteredConnector"
            :bg-gray-for-selector="false"
            :filter="localValue"
            @change="handleAssetChange"
        ></AssetDropdown>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, watch, computed } from 'vue'

    import { useVModels } from '@vueuse/core'

    import ConnectionSelect from './connection.vue'
    import GlossarySelect from './glossary.vue'
    import AssetDropdown from './assetDropdown.vue'

    import useAssetStore from '~/store/asset'
    import { useConnectionStore } from '~/store/connection'

    export default defineComponent({
        name: 'ConnectionFilter',
        components: {
            ConnectionSelect,
            AssetDropdown,
            GlossarySelect,
        },
        props: {
            modelValue: {
                required: false,
                default() {
                    return {}
                },
            },
            connector: {
                required: false,
                default() {
                    return ''
                },
            },
            persona: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue, connector, persona } = useVModels(props, emit)
            const localValue = ref(modelValue.value)

            const store = useConnectionStore()
            const filteredConnector = computed(() =>
                store.getSourceList?.find((item) => item.id === connector.value)
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
                connector,
                handleAssetChange,
            }
        },
    })
</script>
