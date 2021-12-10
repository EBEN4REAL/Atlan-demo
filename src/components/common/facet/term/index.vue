<template>
    <div class="w-full" data-test-id="terms-facet">
        <div class="w-full mt-1 overflow-y-auto" :style="{ height: height }">
            <GlossaryTree v-model:checkedKeys="checkedKeys" :checkable="true" @check="onCheck" />
        </div>
        <div class="px-4 pt-1" v-if="showNone">
            <a-checkbox
                v-model:checked="localValue.empty"
                class="inline-flex flex-row-reverse items-center w-full  atlan-reverse"
            >
                <component
                    :is="noStatus"
                    class="inline-flex self-center w-auto h-4 mb-0.5"
                />
                <span class="mb-0 ml-1 text-gray-500">No Terms</span>
            </a-checkbox>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        toRefs,
        watch,
    } from 'vue'

    import { useVModels } from '@vueuse/core'
    import noStatus from '~/assets/images/status/nostatus.svg'

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
                localValue.value.terms = checkedNodes.map((term) => term.attributes.qualifiedName)
            }
            const checkedKeys = ref(modelValue.value.terms?.map((term) => term?.attributes?.guid ?? term.guid))

            watch(
                () => localValue.value.terms,
                (prev, cur) => {
                    if (!localValue.value.terms) {
                        delete localValue.value.terms
                    }
                    if (!localValue.value.empty) {
                        delete localValue.value.empty
                    }
                    if (localValue.value.terms?.length === 0) {
                        delete localValue.value.terms
                    }
                    modelValue.value = localValue.value
                    emit('change')
                }
            )
            watch(() => localValue.value.empty, () => {
                emit('change')
            })

            /* Adding this when parent data change, sync it with local */
            watch(modelValue, () => {
                localValue.value = modelValue.value
                checkedKeys.value = modelValue.value.terms?.map((term) => term?.attributes?.guid ?? term.guid)

            })

            return {
                localValue,
                queryText,
                showNone,
                onCheck,
                noStatus,
                checkedKeys
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
