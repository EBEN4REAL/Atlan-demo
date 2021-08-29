<template>
    <div
        class="flex justify-between py-4 pr-4 border-b rounded pl-9 group"
        @click="$emit('gtcCardClicked', entity)"
    >
        <!-- projections start here -->
        <div class="flex flex-row w-full">
            <div class="mr-4">
                <img
                    v-if="entity.typeName === 'AtlasGlossary'"
                    :src="GlossarySvg"
                />
                <img
                    v-else-if="entity.typeName === 'AtlasGlossaryCategory'"
                    :src="CategorySvg"
                    :width="25"
                />
                <img
                    v-else-if="entity.typeName === 'AtlasGlossaryTerm'"
                    :src="TermSvg"
                />
            </div>

            <div class="flex flex-col w-3/4 ml-1">
                <span
                    class="flex items-center text-base leading-6 text-gray-700 cursor-pointer "
                >
                    <Tooltip
                        :tooltip-text="entity.displayText"
                        class="hover:underline"
                        @click="redirectToProfile"
                    />

                    <component
                        :is="statusObject?.icon"
                        v-if="statusObject && projection.includes('status')"
                        class="inline-flex w-auto h-4 mb-1 ml-2"
                    />
                </span>

                <div
                    v-if="projection.includes('description')"
                    class="text-sm leading-5 text-gray-500"
                >
                    {{ entity?.attributes?.shortDescription }}
                </div>
                <div
                    v-if="
                        projection?.includes('owners') &&
                        getCombinedUsersAndGroups(entity).length
                    "
                    class="flex items-baseline mt-1 mr-4 text-xs leading-5  text-gray"
                >
                    <span
                        class="mr-1"
                        v-html="
                            'Owned by ' +
                            getTruncatedUsers(
                                getCombinedUsersAndGroups(entity),
                                20
                            )
                        "
                    />
                </div>
            </div>
        </div>
        <!-- TODO: replace with 3-dot menu component -->
        <ThreeDotMenu
            :entity="entity"
            :redirectToProfile="redirectToProfile"
            class="opacity-0"
        />
    </div>
</template>
<script lang="ts">
    import { defineComponent, computed, PropType } from 'vue'
    import { useRouter } from 'vue-router'
    // components
    import Status from '@/discovery/preview/tabs/info/assetDetails/status.vue'
    import Owners from '@/glossary/common/owners.vue'
    import ThreeDotMenu from '@/glossary/common/threeDotMenu.vue'
    import Tooltip from '@common/ellipsis/index.vue'

    // Composables
    import useAssetInfo from '~/composables/asset/useAssetInfo'
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

            // computed
            const statusObject = computed(() =>
                StatusList.find(
                    (status) =>
                        status.id === props.entity?.attributes?.assetStatus
                )
            )

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
                            ? `<b>${truncated[0]}</b>`
                            : `<b>${truncated.length}</b> other(s)`

                    return `<b>${displayArray.join(', ')}</b> and ${lastElm}`
                } else {
                    // Check if everything can be directly displayed
                    // If so then take the last element from array, append it with 'and'
                    const lastElm = displayArray.pop()
                    return displayArray.length
                        ? `<b>${displayArray.join(
                              ', '
                          )}</b> and <b>${lastElm}</b>`
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
                TermSvg,
                GlossarySvg,
                CategorySvg,
                statusObject,
                redirectToProfile,
                getTruncatedUsers,
                getCombinedUsersAndGroups,
            }
        },
    })
</script>
