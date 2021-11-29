<template>
    <SQLTreeSelect></SQLTreeSelect>
</template>

<script>
    import { defineComponent, toRefs, computed, ref, inject } from 'vue'

    import SQLTreeSelect from '@common/treeselect/sql/index.vue'
    import { useVModels } from '@vueuse/core'

    export default defineComponent({
        name: 'FormBuilder',
        components: {
            SQLTreeSelect,
        },
        props: {
            property: {
                required: false,
                type: Object,
                default: () => {},
            },
            modelValue: {
                required: false,
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { property, baseKey } = toRefs(props)
            const formState = inject('formState')
            const credentialBody = inject('credentialBody')

            const componentProps = computed(() => property.value.ui)

            return {
                property,
                componentProps,
                formState,
                credentialBody,
                baseKey,
            }
        },
    })
</script>

<style lang="scss" scoped></style>
