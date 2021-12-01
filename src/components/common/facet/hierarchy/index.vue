<template>
    <div class="flex flex-col w-full px-3 gap-y-2">
        <ConnectorSelect
            v-model="localValue.connectorName"
            class="w-full"
        ></ConnectorSelect>
        <ConnectionSelect
            v-if="localValue.connectorName"
            :connector="localValue.connectorName"
            class="w-full"
            v-model="localValue.connectionQualifiedName"
        ></ConnectionSelect>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, watch } from 'vue'

    import ConnectorSelect from '@/common/select/connector.vue'
    import ConnectionSelect from '@/common/select/connection.vue'

    import { useVModels } from '@vueuse/core'

    export default defineComponent({
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
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)

            watch(
                () => localValue.value.connectorName,
                (state, prevState) => {
                    if (!localValue.value.connectorName) {
                        delete localValue.value.connectorName
                        delete localValue.value.connectionQualifiedName
                    }

                    if (state !== prevState) {
                        delete localValue.value.connectionQualifiedName
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

                    modelValue.value = localValue.value
                    emit('change')
                }
            )

            return {
                localValue,
            }
        },
    })
</script>
