<template>
    <span class="pb-6">
        <div v-if="list.attributeDefs.length > 10" class="px-4 mt-1 mb-2">
            <a-input-search
                ref="searchText"
                v-model:value="attributeSearchText"
                type="text"
                :allow-clear="true"
                :placeholder="`Search ${list.attributeDefs.length} attributes`"
            >
            </a-input-search>
        </div>
        <div
            ref="container"
            class="mr-2 overflow-y-auto"
            style="max-height: 25rem"
        >
            <div
                v-for="(a, x) in attributeSearchText.length
                    ? filterList(list.attributeDefs)
                    : list.attributeDefs.slice(
                          0,
                          showAll ? list.attributeDefs.length : 10
                      )"
                :key="x"
                class="ml-2"
            >
                <AttributeItem
                    :a="a"
                    :applied="data.applied[a.name] || {}"
                    :operators="getOperatorMap(a)"
                    @handleAttributeInput="setBMfilter"
                />
            </div>
        </div>
        <div class="px-4 my-2">
            <div
                v-if="
                    !showAll &&
                    attributeSearchText === '' &&
                    list.attributeDefs.length > 10
                "
                class="flex items-center w-auto font-bold text-center cursor-pointer select-none  outlined text-primary"
                @click="
                    () => {
                        showAll = true
                        showScrollBar()
                    }
                "
            >
                {{ `Show ${list.attributeDefs.length - 10} more` }}
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
    import { defineComponent, PropType, ref, provide, nextTick } from 'vue'
    import useEnums from '@/admin/enums/composables/useEnums'
    import { Collapse } from '~/types'
    import AttributeItem from '../common/attributeItems.vue'
    import { Components } from '~/api/atlas/client'
    import { operatorsMap as map } from '~/constant/business_metadata_template'
    import useBusinessMetadataHelper from '~/composables/businessMetadata/useBusinessMetadataHelper'

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
            list: {
                type: Object,
                required: true,
            },
        },
        emits: ['change', 'update:data'],
        setup(props, { emit }) {
            const attributeSearchText = ref('')
            const showAll = ref(false)
            const container = ref(null)

            const { enumListData: enumsList } = useEnums()
            const { getDatatypeOfAttribute } = useBusinessMetadataHelper()

            const isEmptyObject = (obj: Object) =>
                Object.keys(obj).length === 0 && obj.constructor === Object

            provide('enumsList', enumsList)

            const getOperatorMap = (a) =>
                JSON.parse(
                    JSON.stringify(
                        map[getDatatypeOfAttribute(a.typeName)] || map.enum
                    )
                ).map((o) => ({ ...o, checked: false }))
            /**
             * @param {String} a - attribute object of the filter to apply
             * @param {String} appliedValueMap - consists of 1 or more operators mapped with their values
             * @desc - updates the dataMap at parent to be in sync, and emits change to apply filter
             */
            const setBMfilter = (
                a: { name: string },
                appliedValueMap: Object
            ) => {
                // ? if appliedValueMap === {} i.e all applied filters removed, remove the entry
                const newDataMap = {
                    ...props.data,
                    list: props.list,
                    applied: {
                        ...props.data.applied,
                        [a.name]: appliedValueMap,
                    },
                }

                if (isEmptyObject(appliedValueMap))
                    delete newDataMap.applied[a.name]
                emit('update:data', { applied: newDataMap.applied })
                emit('change')
            }

            const filterList = (list: any[]) =>
                list.filter(
                    (a: { options: { displayName: string | string[] } }) =>
                        a.options.displayName
                            .toLowerCase()
                            .includes(attributeSearchText.value.toLowerCase())
                )

            const showScrollBar = () => {
                nextTick(() => {
                    container.value.scrollTop = 1
                    container.value.scrollTop = 0
                })
            }

            return {
                setBMfilter,
                attributeSearchText,
                filterList,
                showAll,
                showScrollBar,
                container,
                getOperatorMap,
            }
        },
    })
</script>

<style>
    .ant-popover-arrow {
        display: none;
    }
</style>
