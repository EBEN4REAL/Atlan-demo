<template>
    <div class="flex items-center justify-center w-full h-full gap-5">
        <div
            v-for="d in template"
            :key="d"
            class="p-3 cursor-pointer rounded-3xl bg-blue-50"
            :class="
                selected === d
                    ? 'border-primary border-2'
                    : 'border-primary-focus border'
            "
            @click="handleInputChange(d)"
        >
            {{ d }}
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, computed, ref, toRefs } from 'vue'

    export default defineComponent({
        name: 'WorkflowSetupTab',
        components: {},
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

            const handleInputChange = (d) => {
                selected.value = d
                emit('change', d, 'dag')
            }

            return { selected, template, handleInputChange }
        },
    })
</script>
