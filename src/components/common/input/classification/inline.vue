<template>
    <div class="flex flex-wrap gap-1 text-sm">
        <a-popover placement="leftBottom" class="classification-popover">
            <template #content>
                {{ selectedValue }}
                <ClassificationFacet
                    :key="guid"
                    v-model="selectedValue"
                    @change="handleChange"
                ></ClassificationFacet>
            </template>
            <a-button shape="circle" class="text-center">
                <span><AtlanIcon icon="Add" class="h-3"></AtlanIcon></span
            ></a-button>
        </a-popover>

        <div
            v-if="list.length > 0 || list.length"
            class="flex flex-wrap gap-1 text-sm"
        >
            <template v-for="classification in list" :key="classification.guid">
                <ClassificationPill
                    :name="classification.name"
                    :displayName="classification?.displayName"
                    :isPropagated="isPropagated(classification)"
                    :allowDelete="true"
                ></ClassificationPill>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, toRefs, watch } from 'vue'
    import ClassificationFacet from '@/common/facet/classification/index.vue'
    import { mergeArray } from '~/utils/array'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import ClassificationPill from '@/common/pills/classification.vue'

    export default defineComponent({
        components: {
            ClassificationFacet,
            ClassificationPill,
        },
        props: {
            guid: {
                type: String,
                required: false,
            },
            modelValue: {
                type: Array,
                required: false,
                default() {
                    return []
                },
            },
        },
        emits: ['change'],
        setup(props, { emit }) {
            const { modelValue, guid } = toRefs(props)
            const localValue = ref(modelValue.value)
            const selectedValue = ref(modelValue.value.map((i) => i.typeName))

            watch(modelValue, () => {
                localValue.value = modelValue.value
                selectedValue.value = modelValue.value.map((i) => i.typeName)
            })

            const { classificationList } = useTypedefData()
            const isPropagated = (classification) => {
                if (!guid?.value) {
                    return false
                }
                if (guid.value === classification.entityGuid) {
                    return false
                }
                return true
            }
            const list = computed(() => {
                const { matchingIdsResult } = mergeArray(
                    classificationList.value,
                    localValue.value,
                    'name',
                    'typeName'
                )
                return matchingIdsResult
            })

            const handleChange = () => {
                localValue.value = []
                selectedValue.value.forEach((i) => {
                    if (
                        !localValue.value.find(
                            (l) => l.typeName === i && !l.propagate
                        )
                    ) {
                        localValue.value.push({
                            entityGuid: guid.value,
                            propagate: false,
                            removePropagationsOnEntityDelete: false,
                            typeName: i,
                        })
                    }
                })
                emit('change', localValue.value)
            }

            return {
                localValue,
                isPropagated,
                list,
                selectedValue,
                handleChange,
                guid,
            }
        },
    })
</script>
<style lang="less" scoped>
    .classification-popover {
        :global(.ant-popover-content) {
            width: 250px !important;
        }
        :global(.ant-popover-inner-content) {
            @apply px-0 mx-0 !important;
            --tw-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
                0 4px 6px -2px rgba(0, 0, 0, 0.05);
            box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
                var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
        }
    }
</style>
