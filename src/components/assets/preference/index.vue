<template>
    <div class="flex flex-col py-1 rounded gap-y-3">
        <div class="">
            <p class="mb-2 text-sm text-gray-500">Show/Hide</p>
            <div class="flex flex-wrap">
                <CustomRadioButton
                    :list="displayProperties"
                    :isMultiple="true"
                    v-model="localValue"
                    @change="handleChange"
                ></CustomRadioButton>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import { useVModels } from '@vueuse/core'

    import { displayProperties } from '~/constant/displayProperties'
    import CustomRadioButton from '@common/radio/customRadioButton.vue'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    export default defineComponent({
        name: 'PreferenceSelector',
        components: {
            CustomRadioButton,
        },
        props: {
            modelValue: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)
            const sendPreferenceEvent = (id, selectedIds) => {
                const visible = selectedIds.indexOf(id) > -1
                useAddEvent('discovery', 'view_preference', 'changed', {
                    visible: visible,
                    preference: id,
                })
            }
            const handleChange = (id) => {
                modelValue.value = localValue.value
                console.log('preference changed', {
                    final: localValue.value,
                    clicked: id,
                })
                emit('change')
                sendPreferenceEvent(id, localValue.value)
            }

            return {
                localValue,
                handleChange,
                displayProperties,
            }
        },
    })
</script>
