<template>
    <div
        class="flex justify-between w-full py-6 pl-5 pr-4 border-b cursor-pointer  group"
        @click="$emit('gtcCardClicked', entity)"
    >
        <!-- projections start here -->
        <div class="flex flex-row w-full">
            <div
                class="flex flex-col justify-center w-full max-w-2xl ml-1 text-gray-700 "
            >
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

                    <Tooltip
                        :tooltip-text="entity.displayText"
                        class="ml-2 text-lg font-normal leading-7 text-gray-700  hover:underline"
                        @click="redirectToProfile"
                    />

                    <component
                        :is="statusObject?.icon"
                        v-if="statusObject && projection.includes('status')"
                        class="inline-flex w-auto h-4 ml-2"
                    />
                </span>

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
                        class="flex items-center text-sm leading-5 text-gray-700 "
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
                <div
                    v-if="
                        projection.includes('description') &&
                        entity?.attributes?.shortDescription !== '' &&
                        entity?.attributes?.shortDescription !== undefined
                    "
                    class="mt-3 text-sm leading-5 text-gray-700"
                >
                    {{ entity?.attributes?.shortDescription }}
                </div>

                <!-- <div
                    v-if="
                        entity.typeName === 'AtlasGlossaryCategory' &&
                        projection.includes('heirarchy') &&
                        parentCategory
                    "
                    class="flex items-center mt-2 text-sm leading-5 text-gray-700 "
                >
                    <div
                        v-for="category in parentCategory"
                        :key="category"
                        class="px-3 py-1 mr-2 bg-white border rounded-3xl"
                    >
                        {{ category }}
                    </div>
                </div> -->
                <div class="flex items-center w-full">
                    <div
                        v-if="
                            entity.typeName === 'AtlasGlossaryTerm' &&
                            projection.includes('classifications')
                        "
                        class="flex items-center mt-2 text-sm leading-5 text-gray-700  max-w-max"
                    >
                        <div
                            v-for="item in entity?.classificationNames?.slice(
                                0,
                                2
                            )"
                            :key="item"
                            class="flex items-center px-3 py-1 mr-2 truncate bg-white border  rounded-3xl overflow-ellipsis"
                        >
                            <AtlanIcon
                                icon="Shield"
                                class="mr-1 text-pink-500 mb-0.5"
                            ></AtlanIcon>
                            {{ item }}
                        </div>
                        <div
                            v-if="entity?.classificationNames?.length > 2"
                            class="flex items-center px-3 py-1 mr-2 truncate bg-white border  rounded-3xl overflow-ellipsis"
                        >
                            + {{ entity?.classificationNames?.length - 2 }} more
                        </div>
                    </div>

                    <div
                        v-if="
                            entity.typeName === 'AtlasGlossaryTerm' &&
                            projection.includes('heirarchy') &&
                            parentCategories
                        "
                        class="flex items-center max-w-full mt-2 text-sm leading-5 text-gray-700 "
                    >
                        <div
                            v-for="category in parentCategories?.slice(0, 2)"
                            :key="category"
                            class="px-3 py-1 mr-2 truncate bg-white border  rounded-3xl overflow-ellipsis"
                        >
                            {{ category }}
                        </div>
                    </div>
                    <div
                        v-if="parentCategories > 2"
                        class="flex items-center px-3 py-1 mr-2 truncate bg-white border  rounded-3xl overflow-ellipsis"
                    >
                        + {{ parentCategories?.length - 2 }} more
                    </div>
                </div>
            </div>
        </div>

        <ThreeDotMenu
            :entity="entity"
            :redirectToProfile="redirectToProfile"
            class="opacity-0"
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
    import Status from '@common/sidebar/status.vue'
    import Owners from '@/glossary/common/owners.vue'
    import ThreeDotMenu from '@/glossary/common/threeDotMenu.vue'
    import Tooltip from '@common/ellipsis/index.vue'

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
        components: { Status, Owners, ThreeDotMenu, Tooltip },
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
        },
        emits: ['gtcCardClicked'],
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

            const termName = computed(() =>
                props.entity.typeName === 'AtlasGlossaryTerm'
                    ? props.entity?.attributes?.qualifiedName
                    : undefined
            )
            const assetCount = computed(() => {
                if (props.entity.typeName === 'AtlasGlossaryTerm')
                    return (
                        props.entity?.attributes?.assignedEntities?.length ?? 0
                    )
                return 0
            })

            const parentCategory = computed(() => {
                if (props.entity?.typeName === 'AtlasGlossaryCategory') {
                    const catQualifiedName =
                        props.entity?.attributes?.parentCategory
                            ?.uniqueAttributes?.qualifiedName
                    return catQualifiedName?.split(/[@.]/)
                }
                return ''
            })

            const parentCategories = computed(() => {
                if (props.entity?.typeName === 'AtlasGlossaryTerm') {
                    const catQualifiedName =
                        props.entity?.attributes?.categories?.map(
                            (category) => category?.guid
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
                parentCategory,
                parentCategories,
                referredEntities,
            }
        },
    })
</script>
