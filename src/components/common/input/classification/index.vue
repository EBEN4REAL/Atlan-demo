<template>
    <div class="flex flex-col justify-between text-xs text-gray-500">
        <p class="mb-1 text-sm">Classifications</p>

        <div
            v-if="list.length > 0 || list.length"
            class="flex flex-wrap gap-1 text-sm"
        >
            <template v-for="classification in list" :key="classification.guid">
                <div
                    class="flex items-center py-1 pl-1 pr-2 text-gray-700 bg-white border border-gray-200 rounded-full cursor-pointer  hover:bg-pink-400 hover:border-pink-400 group hover:shadow"
                    :class="
                        classification.entityGuid !== selectedAsset.guid
                            ? 'border-dotted'
                            : 'border-solid'
                    "
                >
                    <AtlanIcon
                        icon="ShieldFilled"
                        class="text-pink-400 group-hover:text-white"
                        v-if="classification.entityGuid !== selectedAsset.guid"
                    ></AtlanIcon>
                    <AtlanIcon
                        icon="Shield"
                        class="text-pink-400 group-hover:text-white"
                        v-else
                    ></AtlanIcon>

                    <div class="ml-1 group-hover:text-white">
                        {{ classification.displayName || classification.name }}
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, toRefs } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import { assetInterface } from '~/types/assets/asset.interface'

    import { mergeArray } from '~/utils/array'

    export default defineComponent({
        name: 'ClassificationWidget',
        components: {},
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            editPermission: {
                type: Boolean,
                required: false,
                default: true,
            },
        },
        emits: ['update:selectedAsset'],
        setup(props, { emit }) {
            const { selectedAsset } = toRefs(props)

            const { classifications } = useAssetInfo()

            const { classificationList } = useTypedefData()

            const list = computed(() => {
                const { matchingIdsResult } = mergeArray(
                    classificationList.value,
                    classifications(selectedAsset.value),
                    'name',
                    'typeName'
                )

                return matchingIdsResult
            })

            return {
                classifications,
                classificationList,
                list,
            }
        },
    })
</script>
<style lang="less" scoped></style>
