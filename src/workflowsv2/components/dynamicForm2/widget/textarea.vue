<template>
    <a-textarea
        :class="isEdit && isKey ? 'bg-gray-100' : ''"
        v-bind="componentProps"
        :value="formState[property.id]"
        @input="formState[property.id] = handleInput($event)"
    >
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
    </a-textarea>
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
            isEdit: {
                required: false,
            },
        },
        setup(props, { emit }) {
            const { property, isEdit } = toRefs(props)
            const formState = inject('formState')
            const componentProps = computed(() => property.value.ui)

            const handleInput = (e) => e.target.value

            const isKey = () => {
                if (property.value.id.endsWith('.key')) return true
                return false
            }

            return {
                componentProps,
                formState,
                handleInput,
                isKey,
            }
        },
    })
</script>
