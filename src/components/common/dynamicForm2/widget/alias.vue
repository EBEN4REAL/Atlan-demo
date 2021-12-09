<template>
    <a-input v-bind="componentProps" :value="formState[property.id]">
        <template
            #prefix
            v-if="componentProps.prefixText || componentProps.prefixImage"
        >
            <span class="flex items-center">
                <img
                    :src="componentProps.prefixImage"
                    class="w-auto h-4 pr-1"
                />

                <span>{{ componentProps.prefixText }}</span></span
            >
        </template>
    </a-input>
</template>

<script>
    import {
        defineComponent,
        toRefs,
        computed,
        ref,
        reactive,
        watch,
        inject,
    } from 'vue'
    import { useVModels, debouncedWatch } from '@vueuse/core'
    // import { Form } from 'ant-design-vue'
    // const { useForm } = Form

    export default defineComponent({
        name: 'FormBuilder',
        props: {
            property: {
                required: false,
                type: Object,
                default: () => {},
            },
            prefixImage: {
                required: false,
                type: String,
                default: () => '',
            },
            prefixText: {
                required: false,
                type: String,
                default: () => '',
            },
        },
        setup(props, { emit }) {
            const { property } = toRefs(props)
            const formState = inject('formState')
            const componentProps = computed(() => property.value.ui)

            const cleanInput = (str) => {
                let temp = str.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '-')
                temp = temp?.toLowerCase().replace(/[^a-zA-Z0-9-]/g, '')

                return temp
            }


            return {
                property,
                componentProps,
                formState,
                cleanInput,
            }
        },
    })
</script>

<style lang="scss" scoped></style>
