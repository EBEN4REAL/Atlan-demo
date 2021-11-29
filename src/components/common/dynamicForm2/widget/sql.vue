<template>
    <SQLSelect
        :credential="credentialBody"
        :query="property.ui.query"
        v-model="formState[property.id]"
    ></SQLSelect>
</template>

<script>
    import { defineComponent, toRefs, computed, ref, inject } from 'vue'

    import SQLSelect from '@common/select/sql.vue'

    export default defineComponent({
        name: 'FormBuilder',
        components: {
            SQLSelect,
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
