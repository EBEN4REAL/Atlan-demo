<template>
    <span>
        <div v-if="data.list.attributeDefs.length > 10" class="pr-1 mx-5 mb-3">
            <a-input
                ref="searchText"
                v-model:value="attributeSearchText"
                type="text"
                class="pr-1 bg-white rounded shadow-none border-right-0"
                :placeholder="`Search ${data.list.attributeDefs.length} attributes`"
            >
                <template #prefix>
                    <fa icon="fal search" class="mr-1 text-gray-500" />
                </template>
                <template #suffix>
                    <fa
                        v-if="attributeSearchText"
                        icon="fal times"
                        class="ml-2 mr-1 cursor-pointer"
                        @click="() => (attributeSearchText = '')"
                    />
                </template>
            </a-input>
        </div>
        <div
            ref="container"
            class="mr-2 overflow-y-scroll"
            style="max-height: 25rem"
        >
            <div
                v-for="(a, x) in attributeSearchText.length
                    ? filterList(data.list.attributeDefs)
                    : data.list.attributeDefs.slice(
                          0,
                          showAll ? data.list.attributeDefs.length : 10
                      )"
                :key="x"
                class="mx-5"
            >
                <AttributeItem
                    :a="a"
                    :applied="data.applied[a.name] || {}"
                    @handleAttributeInput="setBMfilter"
                />
            </div>
        </div>
        <div class="m-3">
            <div
                v-if="
                    !showAll &&
                    attributeSearchText === '' &&
                    data.list.attributeDefs.length > 10
                "
                class="flex items-center w-auto font-bold text-center cursor-pointer select-none  outlined text-primary"
                @click="
                    () => {
                        showAll = true
                        showScrollBar()
                    }
                "
            >
                {{ `Show ${data.list.attributeDefs.length - 5} more` }}
            </div>
            <div
                v-else-if="showAll && attributeSearchText === ''"
                class="flex items-center w-auto font-bold text-center cursor-pointer select-none  outlined text-primary"
                @click="showAll = false"
            >
                {{ `Show less` }}
            </div>
        </div>
    </span>
</template>
<script lang="ts">
    import { defineComponent, PropType, ref } from 'vue'
    import { Collapse } from '~/types'
    import AttributeItem from './attributeItems.vue'
    import { Components } from '~/api/atlas/client'

    export default defineComponent({
        name: 'BusinessMetadata',
        components: { AttributeItem },

        props: {
            item: {
                type: Object as PropType<Collapse>,
                required: true,
            },
            data: {
                type: Object,
                required: true,
            },
        },
        emits: ['change', 'update:data'],
        setup(props, { emit }) {
            const attributeSearchText = ref('')
            const showAll = ref(false)
            const container = ref(null)

            /**
             * @param {String} a - attribute object of the filter to apply
             * @param {String} appliedValueMap - consists of 1 or more operators mapped with their values
             * @desc - updates the dataMap at parent to be in sync, and emits change to apply filter
             */
            const setBMfilter = (
                a: { name: string },
                appliedValueMap: Object
            ) => {
                emit('update:data', {
                    ...props.data,
                    applied: {
                        ...props.data.applied,
                        [a.name]: appliedValueMap,
                    },
                })
                const attributeName = `${props.data.list.name}.${a.name}`

                const criterion: Components.Schemas.FilterCriteria[] = []
                Object.keys(appliedValueMap).forEach((key: string) => {
                    criterion.push({
                        attributeName,
                        operator: key,
                        attributeValue: appliedValueMap[key],
                    })
                })
                emit('change', {
                    id: props.item.id,
                    payload: {
                        condition: 'OR',
                        criterion,
                    } as Components.Schemas.FilterCriteria,
                })
            }

            const filterList = (list) =>
                list.filter((a) =>
                    a.options.displayName.includes(attributeSearchText.value)
                )

            const showScrollBar = () => {
                container.value.scrollTop = 1
                container.value.scrollTop = 0
            }
            return {
                setBMfilter,
                attributeSearchText,
                filterList,
                showAll,
                showScrollBar,
                container,
            }
        },
    })
</script>

<style>
    .ant-popover-arrow {
        display: none;
    }
</style>
