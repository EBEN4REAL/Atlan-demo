<template>
    <div
        class="flex justify-between w-full py-6 pl-0 pr-4 border-b cursor-pointer  group"
        :class="[bulkSelectMode && isChecked ? 'bg-primary-light' : '']"
        @click="$emit('gtcCardClicked', entity)"
    >
        <!-- checkbox for bulk -->
        <a-checkbox
            :checked="isChecked"
            class="mt-1 ml-2 mr-3 opacity-0 group-hover:opacity-100"
            :class="bulkSelectMode ? 'opacity-100' : 'opacity-0'"
            @click.stop
            @change="(e) => $emit('listItem:check', e, entity)"
        />

        <div class="flex flex-row w-full">
            <div class="flex flex-col justify-center w-full max-w-2xl ml-1">
                <!-- display name and status -->
                <span class="flex items-center mb-1 cursor-pointer">
                    <AtlanIcon
                        v-if="entity.typeName === 'AtlasGlossary'"
                        icon="Glossary"
                        class="h-5"
                    />

                    <AtlanIcon
                        v-else-if="entity.typeName === 'AtlasGlossaryCategory'"
                        icon="Category"
                        class="h-5"
                    />

                    <AtlanIcon
                        v-else-if="entity.typeName === 'AtlasGlossaryTerm'"
                        icon="Term"
                        class="h-5"
                    />

                    <span
                        class="
                            ml-2
                            mt-0.5
                            text-lg
                            font-bold
                            leading-7
                            truncate
                            text-primary
                            hover:underline
                            overflow-ellipsis
                        "
                        @click="redirectToProfile"
                    >
                        {{ entity?.displayText }}
                    </span>
                    <component
                        :is="statusObject?.icon"
                        v-if="statusObject && projection.includes('status')"
                        class="inline-flex w-auto h-4 ml-2"
                    />
                </span>

                <!-- linked assets count  -->
                <div class="flex items-center w-full text-sm">
                    <div
                        v-if="
                            projection.includes('linkedAssets') &&
                            entity.typeName === 'AtlasGlossaryTerm'
                        "
                        class="mr-4"
                    >
                        <p class="items-baseline p-0 m-0 text-gray-500">
                            <span class="text-gray-700">{{ assetCount }}</span>
                            Linked Assets
                        </p>
                    </div>

                    <div
                        v-if="
                            projection?.includes('owners') &&
                            getCombinedUsersAndGroups(entity).length
                        "
                        class="flex items-center text-sm leading-5 text-gray-500 "
                    >
                        <AtlanIcon icon="User" class="m-0 mr-1" />

                        <span
                            class="mr-1 capitalize"
                            v-html="
                                getTruncatedUsers(
                                    getCombinedUsersAndGroups(entity),
                                    20
                                )
                            "
                        />
                    </div>
                </div>
                <!-- description -->
                <div
                    v-if="
                        projection.includes('description') &&
                        entity?.attributes?.shortDescription !== '' &&
                        entity?.attributes?.shortDescription !== undefined
                    "
                    class="mt-3 text-sm leading-5 text-gray-500"
                >
                    {{ entity?.attributes?.shortDescription }}
                </div>
                <!-- classification and categories -->
                <ScrollStrip>
                    <template v-if="projection?.includes('classifications')">
                        <Pill
                            v-for="clsf in entity.classifications"
                            :key="clsf.typeName"
                            class="flex-none mt-2"
                            :label="clsf.typeName"
                            :has-action="false"
                        >
                            <template #prefix>
                                <AtlanIcon
                                    icon="Shield"
                                    class="text-pink-400 h-3.5 w-auto"
                                />
                            </template>
                        </Pill>
                    </template>
                    <template v-if="projection?.includes('categories')">
                        <Pill
                            v-for="cat in parentCategories"
                            :key="cat"
                            class="flex-none mt-2"
                            :label="cat"
                            :has-action="false"
                        >
                            <template #prefix>
                                <AtlanIcon
                                    icon="Category"
                                    class="text-gray h-3.5 w-auto"
                                />
                            </template>
                        </Pill>
                    </template>
                </ScrollStrip>
            </div>
        </div>

        <!-- three dot menu -->
        <ThreeDotMenu
            :entity="entity"
            :redirectToProfile="redirectToProfile"
            :visible="false"
            class="mt-1 opacity-0"
        />
    </div>
</template>
<script lang="ts">
    import {
        defineComponent,
        computed,
        PropType,
        watch,
        onMounted,
        inject,
    } from 'vue'
    import { useRouter } from 'vue-router'
    // components
    import ThreeDotMenu from '~/components/glossary/threeDotMenu/threeDotMenu.vue'
    import Tooltip from '@common/ellipsis/index.vue'
    import Pill from '@/UI/pill/pill.vue'
    import ScrollStrip from '@/UI/scrollStrip.vue'

    // Composables
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    // static
    import { assetInterface } from '~/types/assets/asset.interface'

    import {
        Glossary,
        Category,
        Term,
    } from '~/types/glossary/glossary.interface'

    import { List as StatusList } from '~/constant/status'

    export default defineComponent({
        components: { ThreeDotMenu, Tooltip, ScrollStrip, Pill },
        props: {
            entity: {
                type: Object as PropType<Glossary | Category | Term>,
                required: true,
                default: () => {},
            },
            projection: {
                type: Array as PropType<string[]>,
                required: false,
                default: () => ['description'],
            },
            isChecked: {
                type: Boolean,
                required: false,
                default: () => false,
            },
            bulkSelectMode: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        emits: ['gtcCardClicked', 'listItem:check'],
        setup(props) {
            const router = useRouter()
            const { ownerGroups, ownerUsers } = useAssetInfo()
            const referredEntities = inject('referredEntities')

            // computed
            const statusObject = computed(() =>
                StatusList.find(
                    (status) =>
                        status.id === props.entity?.attributes?.assetStatus
                )
            )

            // get linked assets count
            const assetCount = computed(() => {
                if (props.entity.typeName === 'AtlasGlossaryTerm')
                    return (
                        props.entity?.attributes?.assignedEntities?.length ?? 0
                    )
                return 0
            })

            // get parent categories for a term
            const parentCategories = computed(() => {
                if (props.entity?.typeName === 'AtlasGlossaryTerm') {
                    const catQualifiedName =
                        props.entity?.attributes?.categories?.map(
                            (category) =>
                                category?.displayText ?? category?.guid
                        )
                    return catQualifiedName
                }
                return []
            })

            // methods

            // TODO: extract this function as a util function to be used at multiple places
            function getTruncatedUsers(arr: string[], wordCount: number = 30) {
                const strSize: number[] = [0]
                let idx = 0
                arr.forEach((name) => {
                    strSize.push(strSize[strSize.length - 1] + name.length)
                })

                // Check upto how long it is possible to display
                while (strSize[idx] < wordCount && idx < strSize.length) {
                    idx++
                }
                idx--

                /** The elements that would be displayed */
                const displayArray = arr.slice(0, idx)
                /** The elements that would be truncated as x other(s) */
                const truncated = arr.slice(idx)

                // Check if something needs to be truncated
                if (truncated.length) {
                    // If there is only 1 element to be truncated then compare the
                    // length of name and 'x others(s)'
                    const lastElm =
                        truncated.length == 1 &&
                        truncated[0].length <
                            `${truncated.length} other(s)`.length
                            ? `${truncated[0]}`
                            : `${truncated.length} other(s)`

                    return `${displayArray.join(', ')} and ${lastElm}`
                } else {
                    // Check if everything can be directly displayed
                    // If so then take the last element from array, append it with 'and'
                    const lastElm = displayArray.pop()
                    return displayArray.length
                        ? `${displayArray.join(', ')} and ${lastElm}`
                        : lastElm
                }
            }

            // TODO: extract this function as a util function to be used at multiple places
            function getCombinedUsersAndGroups(item: assetInterface) {
                return [...ownerUsers(item), ...ownerGroups(item)].filter(
                    (name) => name.length
                )
            }
            const redirectToProfile = () => {
                if (props.entity.typeName === 'AtlasGlossary')
                    router.push(`/glossary/${props.entity.guid}`)
                else if (props.entity.typeName === 'AtlasGlossaryCategory')
                    router.push(`/glossary/category/${props.entity.guid}`)
                else if (props.entity.typeName === 'AtlasGlossaryTerm')
                    router.push(`/glossary/term/${props.entity.guid}`)
            }

            return {
                statusObject,
                redirectToProfile,
                getTruncatedUsers,
                getCombinedUsersAndGroups,
                assetCount,
                parentCategories,
                referredEntities,
            }
        },
    })
</script>
