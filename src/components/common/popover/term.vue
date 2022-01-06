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
                    <AtlanIcon icon="Loader" class="animate-spin h-7" />
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
                            class="leading-5 text-gray-700 truncate overflow-ellipsis"
                        >
                            <Owners
                                v-model="attributes.localOwners"
                                :hide-add-btn="true"
                                :edit-permission="false"
                                :selected-asset="fetchedTerm"
                            />
                        </div>
                    </div>
                    <div class="w-full pt-4">
                        <router-link :to="`/glossary/${term.guid}/overview`">
                            <AtlanButton
                                color="secondary"
                                class="w-full p-0 h-7"
                                padding="compact"
                            >
                                View Term profile
                            </AtlanButton>
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
    import Owners from '@/common/input/owner/index.vue'
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

    export default defineComponent({
        name: 'TermPopover',
        components: {
            Owners,
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
                type: Error,
                required: true,
            },
            fetchedTerm: {
                type: Object,
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
