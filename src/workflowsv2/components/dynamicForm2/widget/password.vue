<template>
    <a-input-password
        :class="isEdit ? 'bg-gray-100' : ''"
        v-bind="componentProps"
        v-model:value="formState[property.id]"
    ></a-input-password>
</template>

<script>
    import { defineComponent, toRefs, computed, ref, inject } from 'vue'
    import { useVModels, debouncedWatch } from '@vueuse/core'

    export default defineComponent({
        name: 'FormBuilder',
        props: {
            property: {
                required: false,
                type: Object,
                default: () => {},
            },
            modelValue: {
                required: false,
            },
            isEdit: {
                required: false,
            },
        },
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            const { property, isEdit } = toRefs(props)
            const formState = inject('formState')
            const componentProps = computed(() => property.value.ui)

            return { componentProps, formState, isEdit }
        },
    })
</script>

<style lang="scss" scoped></style>
