<template>
    <div class="flex items-center justify-center w-full h-full text-2xl">
        <CustomRadioButton
            v-model:data="selected"
            class="pb-4 border-b"
            :list="template.map((l) => ({ id: l, label: l }))"
            @change="handleInputChange"
        ></CustomRadioButton>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, inject, computed, ref } from 'vue'
    import CustomRadioButton from '@common/radio/customRadioButton.vue'
    import json from './Untitled-1.json'

    export default defineComponent({
        name: 'WorkflowSetup',
        components: { CustomRadioButton },
        emits: ['change'],
        setup(props, { emit }) {
            const uiConfig = inject('uiConfig')
            const selected = ref('')

            const template = computed(() => {
                if (uiConfig.value)
                    return JSON.parse(uiConfig.value[0]?.data?.templates)
                return []
            })

            const handleInputChange = () => {
                emit('change', selected.value, 'dag')
            }

            const config = computed(() => {
                return json
                if (uiConfig.value) {
                    return JSON.parse(uiConfig.value[0].data.uiConfig)
                }
                return []
            })
            return { uiConfig, selected, template, config, handleInputChange }
        },
    })
</script>
