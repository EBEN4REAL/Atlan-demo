<template>
    <div
        class="flex justify-between py-4 border-b rounded px-9"
        @click="$emit('gtcCardClicked', entity)"
    >
        <!-- projections start here -->
        <div class="flex flex-row">
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
                    class="text-base leading-6 text-gray-700 cursor-pointer"
                    @click="redirectToProfile"
                >
                    {{ entity.displayText }}
                    <component
                        :is="statusObject?.icon"
                        v-if="statusObject && projection.includes('status')"
                        class="inline-flex self-center w-auto h-4 mb-1"
                    />
                </span>

                <div
                    v-if="projection.includes('description')"
                    class="text-sm leading-5 text-gray-500"
                >
                    {{ entity?.attributes?.shortDescription }}
                </div>
                <div
                    v-if="projection.includes('owners')"
                    class="text-xs leading-4 text-gray"
                >
                    {{ entity?.attributes?.ownerUsers?.split(',') }}
                </div>
            </div>
        </div>
        <!-- TODO: replace with 3-dot menu component -->
        <div>
            <a-dropdown :trigger="['click']">
                <a-button class="px-2.5" @click.prevent>
                    <fa icon="fal ellipsis-v" class="h-4" />
                </a-button>
                <template #overlay>
                    <a-menu>
                        <a-menu-item @click="redirectToProfile">
                            <template #icon>
                                <Fa
                                    class="w-auto h-3 text-white"
                                    icon="fal external-link-alt"
                            /></template>
                            Go to term profile</a-menu-item
                        >
                        <a-menu-item>
                            <template #icon>
                                <Fa
                                    class="w-auto h-3 text-white  group-hover:text-primary"
                                    icon="fal external-link-alt"
                            /></template>
                            Copy term profile link</a-menu-item
                        >
                        <a-menu-divider />

                        <a-menu-item>
                            <Status
                                v-if="entity.guid"
                                :selectedAsset="entity"
                            />
                        </a-menu-item>
                        <a-sub-menu key="owner" title="Add Owner">
                            <template #icon>
                                <fa
                                    icon="fal trash-alt"
                                    class="w-auto h-3 mr-2"
                                ></fa>
                            </template>
                            <a-menu-item class="bg-white">
                                <Owners :selectedAsset="entity" />
                            </a-menu-item>
                        </a-sub-menu>
                        <a-sub-menu key="expert" title="Add Expert">
                            <template #icon>
                                <fa
                                    icon="fal trash-alt"
                                    class="w-auto h-3 mr-2"
                                ></fa>
                            </template>
                            <a-menu-item>5d menu item</a-menu-item>
                            <a-menu-item>6th menu item</a-menu-item>
                        </a-sub-menu>
                        <a-menu-divider />
                        <a-menu-item>
                            <template #icon>
                                <fa
                                    icon="fal trash-alt"
                                    class="w-auto h-3 mr-2"
                                ></fa>
                            </template>
                            Archive</a-menu-item
                        >
                    </a-menu>
                </template>
            </a-dropdown>
        </div>
    </div>
</template>
<script lang="ts">
    import { defineComponent, computed, PropType } from 'vue'
    import { useRouter } from 'vue-router'
    // components
    import Status from '@/discovery/preview/tabs/info/assetDetails/status.vue'
    import Owners from '@/glossary/common/owners.vue'
    // static
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
        components: { Status, Owners },
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
            // computed
            const statusObject = computed(() =>
                StatusList.find(
                    (status) =>
                        status.id === props.entity?.attributes?.assetStatus
                )
            )

            // methods
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
            }
        },
    })
</script>
