<template>
    <div
        class="flex items-center justify-between w-full py-0 m-0 group"
        :class="isAnimating ? $style.shake : ''"
    >
        <div
            v-if="item?.typeName === 'cta'"
            class="flex flex-wrap items-center w-full"
        >
            <span
                v-if="!checkable && role.toLowerCase() !== 'guest'"
                class="pr-1"
            >
                Add a
            </span>
            <AddGtcModal
                v-if="!checkable && role.toLowerCase() !== 'guest'"
                entityType="AtlasGlossaryTerm"
                :glossaryName="item?.glossaryName"
                :categoryName="item?.categoryName"
                :categoryGuid="item?.categoryGuid"
                :glossary-qualified-name="glossaryQualifiedName"
                @add="handleAdd"
                :createPermission="hasTermAddPermission"
            >
                <template #trigger>
                    <div>
                        <div
                            class="flex items-center hover:underline text-primary"
                        >
                            <AtlanIcon
                                icon="Term"
                                class="m-0 mr-0.5 align-text-bottom"
                            />
                            <p class="p-0 m-0">Term</p>
                        </div>
                    </div>
                </template>
            </AddGtcModal>
            <span
                v-if="!checkable && role.toLowerCase() !== 'guest'"
                class="px-1"
                >or
            </span>

            <AddGtcModal
                v-if="!checkable && role.toLowerCase() !== 'guest'"
                entityType="AtlasGlossaryCategory"
                :glossaryName="item?.glossaryName"
                :categoryName="item?.categoryName"
                :categoryGuid="item?.categoryGuid"
                :glossary-qualified-name="glossaryQualifiedName"
                @add="handleAdd"
                :createPermission="hasCategoryAddPermission"
            >
                <template #trigger>
                    <div>
                        <div
                            class="flex items-center hover:underline text-primary"
                        >
                            <AtlanIcon
                                icon="Category"
                                class="m-0 mr-1 align-text-bottom"
                            />
                            <p class="p-0 m-0">Category</p>
                        </div>
                    </div>
                </template>
            </AddGtcModal>

            <div v-if="checkable || role.toLowerCase() === 'guest'">
                This
                <span v-if="item.categoryName">category</span>
                <span v-else-if="item.glossaryName">glossary</span>
                <span v-else>node</span>
                is empty!
                <br />

                <span v-if="hasTermAddPermission">
                    Go to the
                    <span
                        class="hover:underline text-primary"
                        @click="ctaToProfile"
                    >
                        profile
                    </span>
                    to add some terms.
                </span>
            </div>
        </div>

        <div
            v-else-if="item?.typeName === 'loadMore'"
            class="flex items-center justify-between w-full py-0 m-0 group"
            @click="item.click"
        >
            <div class="text-primary">{{ item.title }}</div>
            <div v-if="item.isLoading">
                <a-spin
                    size="small"
                    icon="Loader"
                    class="w-auto h-4 mr-1 animate-spin"
                ></a-spin>
            </div>
            <div v-else-if="!item.isLoading && item.isError">
                <AtlanIcon icon="Error"></AtlanIcon>
            </div>
        </div>
        <div
            v-else
            class="flex items-center justify-between w-full py-0 m-0 group"
        >
            <div
                class="flex items-center py-0 pr-2"
                :class="[checkable ? 'w-8/12' : 'w-11/12']"
            >
                <div class="w-4 mr-1">
                    <AtlanIcon
                        :icon="
                            getEntityStatusIcon(
                                item.typeName,
                                certificateStatus(item)
                            )
                        "
                        :style="iconSize"
                        class="self-center text-gray-500 align-text-bottom"
                    />
                </div>
                <div v-show="isEditMode">
                    <Name
                        @updateName="handleNameUpdate"
                        v-model="isEditMode"
                        :selected-asset="item"
                    />
                </div>
                <Tooltip
                    v-if="!isEditMode"
                    :tooltip-text="entityTitle"
                    :classes="'w-full '"
                    placement="topRight"
                    :mouseLeaveDelay="0"
                />
            </div>

            <div v-if="!item.dataRef.isLoading && item.dataRef.isError">
                <AtlanIcon icon="Error"></AtlanIcon>
            </div>
            <div v-else-if="!checkable" class="hidden group-hover:flex">
                <Actions
                    :treeMode="true"
                    :glossaryName="getAnchorName(item) || title(item)"
                    :categoryName="title(item)"
                    :categoryGuid="categoryId"
                    :entity="item"
                    @edit="handleEdit"
                ></Actions>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    // library
    import {
        computed,
        defineComponent,
        PropType,
        toRefs,
        inject,
        ref,
        watch,
        onMounted,
        watchEffect,
    } from 'vue'
    import {
        and,
        useActiveElement,
        useMagicKeys,
        useTimeoutFn,
        useVModels,
        whenever,
    } from '@vueuse/core'

    import { useRouter, useRoute } from 'vue-router'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import useGlossaryData from '~/composables/glossary2/useGlossaryData'
    import Actions from './actions.vue'
    import AddGtcModal from '@/glossary/modal/addGtcModal.vue'
    import Tooltip from '@/common/ellipsis/index.vue'
    import Name from '@/glossary/common/name.vue'
    import whoami from '~/composables/user/whoami'

    import {
        Glossary,
        Term,
        Category,
    } from '~/types/glossary/glossary.interface'
    import AtlanIcon from '@/common/icon/atlanIcon.vue'
    import map from '~/constant/accessControl/map'
    import useAuth from '~/composables/auth/useAuth'
    import { fetchGlossaryPermission } from '~/composables/glossary/useGTCPermissions'

    export default defineComponent({
        name: 'GlossaryTreeItem',
        components: { Actions, AtlanIcon, AddGtcModal, Tooltip, Name },
        props: {
            item: {
                type: Object as PropType<Glossary | Term | Category>,
                required: false,
                default: () => {},
            },
            checkable: {
                type: Boolean,
                required: false,
                default: false,
            },
            isAnimating: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        emits: ['addSelectedKey', 'changeEditMode'],
        setup(props, { emit }) {
            // data
            const { item } = toRefs(props)
            const { role } = whoami()
            const route = useRoute()
            const router = useRouter()
            const profileId = computed(() => route?.params?.id || null)
            const isEditMode = ref(false)
            const hasCreatePermission = ref()
            const hasTermAddPermission = ref()
            const hasCategoryAddPermission = ref()
            const { checkAccess } = useAuth()

            const { getEntityStatusIcon } = useGlossaryData()
            const {
                certificateStatus,
                title,
                getAnchorQualifiedName,
                getAnchorName,
            } = useAssetInfo()

            const entityTitle = ref(title(item.value))
            const iconSize = computed(() => {
                if (item.value.typeName === 'AtlasGlossary') {
                    return 'height: 16px !important'
                }

                return 'height: 16px !important'
            })
            const glossaryQualifiedName = computed(() => {
                if (item.value.typeName === 'AtlasGlossary') {
                    return item.value?.attributes?.qualifiedName
                }
                if (item.value.typeName === 'cta') {
                    if (
                        item.value?.parentCategory?.typeName === 'AtlasGlossary'
                    )
                        return item.value?.parentCategory?.attributes
                            ?.qualifiedName
                    return getAnchorQualifiedName(item.value?.parentCategory)
                }
                return getAnchorQualifiedName(item.value)
            })
            const categoryId = computed(() => {
                if (props.entity?.typeName === 'AtlasGlossaryCategory')
                    return props.entity?.guid
                return ''
            })

            const textClass = computed(() => {
                if (item.value.typeName === 'AtlasGlossary') {
                    return 'text-sm text-gray-700'
                }
                if (item.value.typeName === 'AtlasGlossaryCategory') {
                    return 'text-sm text-gray-500'
                }

                return 'text-sm text-gray-700'
            })
            const addGTCNode = inject('addGTCNode')
            const handleAdd = (asset) => {
                addGTCNode(asset, item.value.parentCategory)
            }

            const addSelectedKey = () => {
                if (profileId.value === item.value?.guid) {
                    emit('addSelectedKey', item?.value?.key)
                }
            }
            const ctaToProfile = () => {
                if (item.value.categoryGuid)
                    router.push(`/glossary/${item.value.categoryGuid}`)
                else router.push(`/glossary/${item.value.glossaryGuid}`)
            }
            onMounted(addSelectedKey)
            watch(profileId, () => {
                addSelectedKey()
            })
            watch(item, () => {
                entityTitle.value = title(item.value)
            })

            const handleEdit = (asset) => {
                isEditMode.value = true
            }
            const handleEditCancel = () => {
                if (isEditMode.value) {
                    isEditMode.value = false
                }
            }
            const handleNameUpdate = (val) => {
                entityTitle.value = val
            }
            watch(isEditMode, () => {
                emit('changeEditMode', isEditMode.value)
            })

            // permissions
            // ? evaluate are checked against the glossary & not the category or term
            const parentGlossary = computed(() => {
                if (item.value?.typeName === 'cta') {
                    return {
                        guid:
                            item.value?.glossaryGuid ??
                            item.value?.parentCategory?.attributes?.anchor
                                ?.guid,
                        typeName: 'AtlasGlossary',
                        qualifiedName:
                            item?.value?.glossaryQualifiedName ??
                            item.value?.parentCategory?.attributes
                                ?.qualifiedName,
                    }
                }
                return null
            })

            const {
                termAddPermission,
                categoryAddPermission,
                entityUpdatePermission,
                entityDeletePermission,
                createPermission,
                fetch,
                isEvaluating,
            } = fetchGlossaryPermission(parentGlossary, false)

            const handleLocalPermissionChange = () => {
                console.log(createPermission.value)
                if (createPermission.value !== undefined) {
                    hasCreatePermission.value = createPermission.value
                }
                if (termAddPermission.value !== undefined) {
                    hasTermAddPermission.value = termAddPermission.value
                }
                if (categoryAddPermission.value !== undefined) {
                    hasCategoryAddPermission.value = categoryAddPermission.value
                }
            }
            watch(
                [
                    createPermission,
                    termAddPermission,
                    categoryAddPermission,
                    isEvaluating,
                ],
                () => {
                    handleLocalPermissionChange()
                }
            )
            onMounted(() => {
                if (item.value?.typeName === 'cta') {
                    fetch()
                    handleLocalPermissionChange()
                }
            })

            return {
                isEvaluating,
                termAddPermission,
                categoryAddPermission,
                entityUpdatePermission,
                entityDeletePermission,
                createPermission,
                parentGlossary,
                getEntityStatusIcon,
                certificateStatus,
                title,
                iconSize,
                textClass,
                getAnchorQualifiedName,
                getAnchorName,
                handleAdd,
                glossaryQualifiedName,
                categoryId,
                profileId,
                ctaToProfile,
                map,
                handleEdit,
                isEditMode,
                handleEditCancel,
                handleNameUpdate,
                entityTitle,
                hasCreatePermission,
                hasTermAddPermission,
                hasCategoryAddPermission,
                role,
            }
        },
    })
</script>
<style lang="less" module>
    .skeleton {
        :global(.ant-skeleton-title) {
            @apply mt-0 w-full !important;
        }
    }
    .shake {
        animation: listItemShake 0.5s infinite;
        @apply text-gray-500 !important;
    }
    @keyframes listItemShake {
        15% {
            transform: translate(0.3%, 0);
        }
        30% {
            transform: translate(-0.3%, 0);
        }
        45% {
            transform: translate(0.2%, 0);
        }
        60% {
            transform: translate(-0.2%, 0);
        }
        75% {
            transform: translate(0.1%, 0);
        }
        85% {
            transform: translate(-0.1%, 0);
        }
    }

    // @keyframes listItemShake {
    //     15% {
    //         transform: rotate(0.5deg);
    //     }
    //     30% {
    //         transform: rotate(-0.5deg);
    //     }
    //     45% {
    //         transform: rotate(0.3deg);
    //     }
    //     60% {
    //         transform: rotate(-0.3deg);
    //     }
    //     75% {
    //         transform: rotate(0.2deg);
    //     }
    //     85% {
    //         transform: rotate(-0.2deg);
    //     }
    //     92% {
    //         transform: rotate(0.1deg);
    //     }
    // }
</style>
