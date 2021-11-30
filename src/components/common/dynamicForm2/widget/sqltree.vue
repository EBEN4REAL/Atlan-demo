<template>
    <SQLTreeSelect
        :credential="credentialBody"
        query="show atlan schemas"
    ></SQLTreeSelect>
</template>

<script>
    import { defineComponent, toRefs, computed, ref, inject } from 'vue'

    import SQLTreeSelect from '@common/treeselect/sql/index.vue'
    import { useCredential } from '~/composables/credential/useCredential'
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

            const componentProps = computed(() => property.value.ui)

            const { buildCredentialBody } = useCredential()

            const credentialBody = computed(() =>
                buildCredentialBody(
                    formState,
                    'credential-guid',
                    'atlan-connectors-snowflake-beta'
                )
            )

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
