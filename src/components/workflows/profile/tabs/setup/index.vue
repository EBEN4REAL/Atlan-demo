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
    import { defineComponent, computed, ref, toRefs } from 'vue'
    import CustomRadioButton from '@common/radio/customRadioButton.vue'

    export default defineComponent({
        name: 'WorkflowSetupTab',
        components: { CustomRadioButton },
        props: {
            uiConfig: {
                type: Object,
                required: false,
                default: null,
            },
        },
        emits: ['change'],
        setup(props, { emit }) {
            const selected = ref('')
            const { uiConfig } = toRefs(props)
            const template = computed(() => {
                if (uiConfig.value?.length)
                    return JSON.parse(uiConfig.value[0]?.data?.templates)
                return []
            })

            const handleInputChange = () => {
                emit('change', selected.value, 'dag')
            }

            return { selected, template, handleInputChange }
        },
    })
</script>
