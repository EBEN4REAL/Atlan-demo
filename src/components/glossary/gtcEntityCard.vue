<template>
    <div
        class="flex justify-between py-4 pl-5 pr-4 border-b group"
        @click="$emit('gtcCardClicked', entity)"
    >
        <!-- projections start here -->
        <div class="flex flex-row w-full">
            <div class="mr-2">
                <img
                    v-if="entity.typeName === 'AtlasGlossary'"
                    :src="GlossarySvg"
                />
                <AtlanIcon
                    v-else-if="entity.typeName === 'AtlasGlossaryCategory'"
                    icon="Category"
                    class="h-6"
                />

                <AtlanIcon
                    v-else-if="entity.typeName === 'AtlasGlossaryTerm'"
                    icon="Term"
                    class="h-6 mt-1"
                />
            </div>

            <div class="flex flex-col justify-center w-3/4 ml-1 text-gray-700">
                <span class="flex items-center cursor-pointer">
                    <Tooltip
                        :tooltip-text="entity.displayText"
                        class="text-lg font-normal leading-7 text-gray-700  hover:underline"
                        @click="redirectToProfile"
                    />

                    <component
                        :is="statusObject?.icon"
                        v-if="statusObject && projection.includes('status')"
                        class="inline-flex w-auto h-4 ml-2"
                    />
                </span>

                <div
                    v-if="
                        projection.includes('description') &&
                        entity?.attributes?.shortDescription !== '' &&
                        entity?.attributes?.shortDescription !== undefined
                    "
                    class="mt-1 text-sm leading-5 text-gray-700"
                >
                    {{ entity?.attributes?.shortDescription }}
                </div>
                <div class="flex items-center w-full text-sm">
                    <div
                        v-if="
                            projection.includes('linkedAssets') &&
                            assetCount !== 0
                        "
                        class="mt-2 mr-4"
                    >
                        <p class="items-baseline p-0 m-0 font-normal">
                            <span class="font-bold">{{ assetCount }}</span>
                            Linked Assets
                        </p>
                    </div>

                    <div
                        v-if="
                            projection?.includes('owners') &&
                            getCombinedUsersAndGroups(entity).length
                        "
                        class="flex items-center mt-2 text-sm leading-5 text-gray-700 "
                    >
                        <AtlanIcon icon="AddUser" class="m-0 mr-1" />

                        <span
                            class="mr-1"
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
                        projection.includes('description') && parentCategories
                    "
                    class="flex items-center mt-2 text-sm leading-5 text-gray-700 "
                >
                    <div
                        v-for="item in parentCategories"
                        class="px-3 py-1 mr-2 bg-white border rounded-3xl"
                    >
                        {{ item }}
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
    import { defineComponent, computed, PropType, watch, onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    // components
    import Status from '@common/sidebar/status.vue'
    import Owners from '@/glossary/common/owners.vue'
    import ThreeDotMenu from '@/glossary/common/threeDotMenu.vue'
    import Tooltip from '@common/ellipsis/index.vue'

    // Composables
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import useTermLinkedAssets from '~/composables/glossary/useTermLinkedAssets'
    // static
    import { assetInterface } from '~/types/assets/asset.interface'
    import TermSvg from '~/assets/images/gtc/term/term.png'
    import CategorySvg from '~/assets/images/gtc/category/category.png'
    import GlossarySvg from '~/assets/images/gtc/glossary/glossary.png'

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

            const { linkedAssets, isLoading, error, fetchLinkedAssets } =
                useTermLinkedAssets()
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
            const assets = computed(() => linkedAssets.value?.entities ?? [])
            const assetCount = computed(() => assets.value?.length ?? 0)
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

            onMounted(() => {
                if (termName.value) fetchLinkedAssets(termName.value)
            })
            const parentCategories = computed(() => {
                const catQualifiedName =
                    props.entity?.attributes?.parentCategory?.uniqueAttributes
                        ?.qualifiedName
                return catQualifiedName?.split(/[@.]/)
            })

            console.log(termName.value)
            return {
                TermSvg,
                GlossarySvg,
                CategorySvg,
                statusObject,
                redirectToProfile,
                getTruncatedUsers,
                getCombinedUsersAndGroups,
                assetCount,
                assets,
                parentCategories,
            }
        },
    })
</script>
