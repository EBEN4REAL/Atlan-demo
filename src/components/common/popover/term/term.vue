<template>
    <a-popover
        :placement="placement"
        :trigger="trigger"
        @visibleChange="handleVisibleChange"
    >
        <template #content>
            <div class="p-4" style="width: 374px">
                <!-- using v-if="!fetchedTerm" below as when using loader the loader dissapears if changes too quicky -->
                <div
                    v-if="!fetchedTerm"
                    class="flex items-center justify-center w-full h-full"
                >
                    <AtlanLoader class="h-7" />
                </div>
                <div v-else-if="fetchedTerm" class="space-y-2">
                    <div class="flex text-xs gap-x-2">
                        <div class="flex space-x-2 text-gray-700">
                            <AtlanIcon icon="Term" />
                            <span>TERM</span>
                        </div>
                        <span class="text-gray-200">&bull;</span>
                        <div
                            v-if="anchorAttributes(fetchedTerm)?.name"
                            class="flex mr-2 space-x-2 text-gray-500"
                        >
                            <AtlanIcon icon="Glossary" />
                            <span>
                                {{ anchorAttributes(fetchedTerm).name }}
                            </span>
                        </div>
                    </div>

                    <div class="flex">
                        <div class="flex space-x-2 font-bold text-gray-700">
                            <Ellipsis
                                :tooltip-text="attributes?.localName"
                                :rows="2"
                                :classes="'max-w-xs'"
                            />
                            <!-- <span class="max-w-xs truncate">
                                {{ attributes?.localName }}
                            </span> -->
                            <CertificateBadge
                                v-if="certificateStatus(fetchedTerm)"
                                :status="certificateStatus(fetchedTerm)"
                                :username="certificateUpdatedBy(fetchedTerm)"
                                :timestamp="certificateUpdatedAt(fetchedTerm)"
                            />
                        </div>
                    </div>

                    <div
                        v-if="attributes?.localDescription"
                        style="font-size: 12px"
                        class=""
                    >
                        <div class="text-gray-500">Description</div>
                        <div class="text-gray-700">
                            {{ attributes?.localDescription }}
                        </div>
                    </div>
                    <!-- <div
                        v-if="attributes?.localCategories?.length"
                        style="font-size: 12px"
                        class=""
                    >
                        <div class="text-gray-500">Categories</div>
                        <div
                            class="leading-5 text-gray-700 truncate overflow-ellipsis"
                        >
                            <Category
                                v-modal="attributes?.localCategories"
                                :selected-asset="fetchedTerm"
                                :edit-permission="false"
                            />
                        </div>
                    </div> -->

                    <div
                        v-if="
                            attributes?.localOwners?.ownerGroups?.length ||
                            attributes?.localOwners?.ownerUsers?.length
                        "
                        style="font-size: 12px"
                        class=""
                    >
                        <div class="text-gray-500">Owned by</div>
                        <div
                            class="flex flex-wrap gap-1 leading-5 text-gray-700 truncate overflow-ellipsis"
                        >
                            <template
                                v-for="username in attributes?.localOwners
                                    ?.ownerUsers"
                                :key="username"
                            >
                                <PopOverUser :item="username">
                                    <UserPill
                                        :username="username"
                                        :allow-delete="false"
                                        :enable-hover="true"
                                    ></UserPill>
                                </PopOverUser>
                            </template>

                            <template
                                v-for="name in attributes?.localOwners
                                    ?.ownerGroups"
                                :key="name"
                            >
                                <PopOverGroup :item="name">
                                    <GroupPill
                                        :name="name"
                                        :allow-delete="false"
                                        :enable-hover="true"
                                    ></GroupPill>
                                </PopOverGroup>
                            </template>
                        </div>
                    </div>
                    <div
                        v-if="attributes?.localSeeAlso?.length"
                        style="font-size: 12px"
                        class=""
                    >
                        <div class="text-gray-500">Related Terms</div>
                        <div
                            class="flex flex-wrap gap-1 leading-5 text-gray-700 truncate overflow-ellipsis"
                        >
                            <template
                                v-for="term in attributes?.localSeeAlso"
                                :key="term.guid"
                            >
                                <TermPill :term="term" :allow-delete="false" />
                            </template>
                        </div>
                    </div>
                    <div class="w-full pt-4">
                        <router-link
                            :to="`/glossary/${fetchedTerm.guid}/overview`"
                        >
                            <AtlanButton2
                                color="secondary"
                                class="w-full p-0 h-7"
                                label="View Term profile"
                            />
                        </router-link>
                    </div>
                </div>
                <div v-else-if="error" class="">
                    <ErrorView />
                </div>
            </div>
        </template>
        <slot />
    </a-popover>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        onMounted,
        PropType,
        ref,
        toRefs,
        watch,
    } from 'vue'

    // components
    import Category from '@/common/input/categories/categories.vue'
    import AtlanButton from '@/UI/button.vue'
    import ErrorView from '@/common/error/index.vue'

    // composables
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    // types
    import { Term } from '~/types/glossary/glossary.interface'

    // import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
    import CertificateBadge from '@/common/badge/certificate/index.vue'
    import updateAssetAttributes from '~/composables/discovery/updateAssetAttributes'
    import Ellipsis from '@/common/ellipsis/index.vue'

    import UserPill from '@/common/pills/user.vue'
    import GroupPill from '@/common/pills/group.vue'
    import TermPill from '@/common/pills/term.vue'
    import PopOverUser from '@/common/popover/user/user.vue'
    import PopOverGroup from '@/common/popover/user/groups.vue'

    export default defineComponent({
        name: 'TermPopover',
        components: {
            UserPill,
            GroupPill,
            TermPill,
            PopOverUser,
            PopOverGroup,
            ErrorView,
            Category,
            Ellipsis,
            AtlanButton,
            CertificateBadge,
        },
        props: {
            term: {
                type: Object,
                required: true,
            },
            loading: {
                type: Boolean,
                required: true,
            },
            error: {
                required: true,
            },
            fetchedTerm: {
                required: true,
            },
            placement: {
                type: String,
                required: false,
                default: 'left',
            },
            trigger: {
                type: String,
                required: false,
                default: 'hover',
            },
        },
        emits: ['visible'],
        setup(props, { emit }) {
            const { term } = toRefs(props)

            const { fetchedTerm, loading } = toRefs(props)

            const {
                isScrubbed,
                certificateStatus,
                certificateUpdatedBy,
                certificateUpdatedAt,
                anchorAttributes,
            } = useAssetInfo()

            const scrubbed = computed(() => isScrubbed(fetchedTerm.value))

            const attributes = ref()

            watch([loading, fetchedTerm], () => {
                if (fetchedTerm.value) {
                    attributes.value = updateAssetAttributes(fetchedTerm)
                }
            })

            const handleVisibleChange = (v) => {
                emit('visible', v, term.value)
            }

            onMounted(() => {
                if (fetchedTerm.value) {
                    attributes.value = updateAssetAttributes(fetchedTerm)
                }
            })

            return {
                anchorAttributes,
                attributes,
                certificateUpdatedBy,
                certificateUpdatedAt,
                isScrubbed,
                certificateStatus,
                handleVisibleChange,
            }
        },
    })
</script>

<style lang="less" module></style>
