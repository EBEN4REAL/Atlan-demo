<template>
    <span>
        <div class="pr-1 mx-5 mb-3" v-if="data.list.attributeDefs.length > 5">
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
                        icon="fal times "
                        class="ml-2 mr-1 cursor-pointer"
                        @click="() => (attributeSearchText = '')"
                    />
                </template>
            </a-input>
        </div>
        <div class="mr-5 overflow-y-scroll h-60">
            <div
                v-for="(a, x) in attributeSearchText.length
                    ? filterList(data.list.attributeDefs)
                    : data.list.attributeDefs"
                :key="x"
                class="mx-5"
            >
                <AttributeItem :a="a" @handleAttributeInput="setBMfilter" />
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
        emits: ['change'],
        setup(props, { emit }) {
            const attributeSearchText = ref('')
            const setBMfilter = (
                a: { name: string },
                appliedValueMap: Object
            ) => {
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
            return {
                setBMfilter,
                attributeSearchText,
                filterList,
            }
        },
    })
</script>

<style>
    .ant-popover-arrow {
        display: none;
    }
</style>
