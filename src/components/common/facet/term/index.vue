<template>
    <div class="w-full" data-test-id="terms-facet">
        <div class="w-full mt-1 overflow-y-auto" :style="{ height: height }">
            <GlossaryTree :checkable="true" @check="onCheck" />
        </div>
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        Ref,
        ref,
        toRef,
        toRefs,
        watch,
    } from 'vue'

    import { useTimeoutFn, useVModels } from '@vueuse/core'

    import GlossaryTree from '~/components/glossary/index.vue'

    export default defineComponent({
        components: {
            GlossaryTree,
        },
        name: 'TermFacet',
        props: {
            modelValue: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            showNone: {
                type: Boolean,
                default() {
                    return true
                },
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const queryText = ref('')
            const { showNone } = toRefs(props)
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)

            const onCheck = (checkedNodes) => {
                localValue.value = checkedNodes.map((term) => term.attributes.qualifiedName)
            }



            watch(
                () => localValue.value,
                (prev, cur) => {
                    if (!localValue.value) {
                        localValue.value = null
                    }
                    // if (!localValue.value?.empty) {
                    //     delete localValue.value.empty
                    // }
                    if (localValue.value?.length === 0) {
                        localValue.value = null
                    }
                    modelValue.value = localValue.value
                    emit('change')
                }
            )


            /* Adding this when parent data change, sync it with local */
            watch(modelValue, () => {
                localValue.value = modelValue.value
            })

            return {
                localValue,
                queryText,
                showNone,
                onCheck,
            }
        },
    })
</script>

<style lang="less" module>
    .atlanReverse {
        > span:nth-child(2) {
            @apply w-full pl-0;
        }

        :global(.ant-checkbox) {
            top: 0px !important;
        }
    }
</style>
