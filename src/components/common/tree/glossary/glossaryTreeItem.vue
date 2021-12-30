<template>
    <div class="flex items-center justify-between w-full py-0 m-0 group">
        <div
            v-if="item?.typeName === 'cta'"
            class="flex flex-col"
            :class="!hasCreateAccess ? '' : 'space-y-2'"
        >
            <AddGtcModal
                v-if="!checkable"
                entityType="AtlasGlossaryTerm"
                :glossaryName="item?.glossaryName"
                :categoryName="item?.categoryName"
                :categoryGuid="item?.categoryGuid"
                :glossary-qualified-name="glossaryQualifiedName"
                @add="handleAdd"
            >
                <template #trigger>
                    <div v-auth="map.CREATE_TERM">
                        <div
                            class="flex items-center hover:underline text-primary"
                        >
                            <AtlanIcon
                                icon="Term"
                                class="m-0 mr-1 align-text-bottom"
                            />
                            <p class="p-0 m-0">+ Term</p>
                        </div>
                    </div>
                </template>
            </AddGtcModal>
            <AddGtcModal
                v-if="!checkable"
                entityType="AtlasGlossaryCategory"
                :glossaryName="item?.glossaryName"
                :categoryName="item?.categoryName"
                :categoryGuid="item?.categoryGuid"
                :glossary-qualified-name="glossaryQualifiedName"
                @add="handleAdd"
            >
                <template #trigger>
                    <div v-auth="map.CREATE_CATEGORY">
                        <div
                            class="flex items-center hover:underline text-primary"
                        >
                            <AtlanIcon
                                icon="Category"
                                class="m-0 mr-1 align-text-bottom"
                            />
                            <p class="p-0 m-0">+ Category</p>
                        </div>
                    </div>
                </template>
            </AddGtcModal>
            <div v-if="checkable || !hasCreateAccess">
                This
                <span v-if="item.categoryName">category</span>
                <span v-else-if="item.glossaryName">glossary</span>
                <span v-else>node</span>
                is empty!
                <br />
                <span v-auth="map.CREATE_TERM"
                    >Go to the
                    <span
                        class="hover:underline text-primary"
                        @click="ctaToProfile"
                        >profile</span
                    >
                    to add some terms.</span
                >
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
                        class="self-center align-text-bottom"
                    />
                </div>
                <Tooltip
                    :tooltip-text="`${title(item)}`"
                    :classes="'w-full '"
                />
            </div>

            <div v-if="!item.dataRef.isLoading && item.dataRef.isError">
                <AtlanIcon icon="Error"></AtlanIcon>
            </div>
            <div
                v-else-if="!checkable"
                v-auth.or="[
                    map.CREATE_CATEGORY,
                    map.CREATE_TERM,
                    map.DELETE_CATEGORY,
                    map.DELETE_TERM,
                    map.DELETE_GLOSSARY,
                ]"
                class="hidden group-hover:flex"
            >
                <Actions
                    :treeMode="true"
                    :glossaryName="getAnchorName(item) || title(item)"
                    :categoryName="title(item)"
                    :categoryGuid="categoryId"
                    :entity="item"
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
    } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import useGlossaryData from '~/composables/glossary2/useGlossaryData'
    import Actions from './actions.vue'
    import AddGtcModal from '@/glossary/modal/addGtcModal.vue'
    import Tooltip from '@/common/ellipsis/index.vue'
    import { useRouter, useRoute } from 'vue-router'

    import {
        Glossary,
        Term,
        Category,
    } from '~/types/glossary/glossary.interface'
    import AtlanIcon from '../../icon/atlanIcon.vue'
    import map from '~/constant/accessControl/map'
    import useAuth from '~/composables/auth/useAuth'

    export default defineComponent({
        components: { Actions, AtlanIcon, AddGtcModal, Tooltip },
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
        },
        emits: ['addSelectedKey'],
        setup(props, { emit }) {
            // data
            const { item } = toRefs(props)
            const route = useRoute()
            const router = useRouter()
            const profileId = computed(() => route?.params?.id || null)
            const { checkAccess } = useAuth()

            const { getEntityStatusIcon } = useGlossaryData()
            const {
                certificateStatus,
                title,
                getAnchorQualifiedName,
                getAnchorName,
            } = useAssetInfo()

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
                console.log(item.value)
                if (item.value.categoryGuid)
                    router.push(`/glossary/${item.value.categoryGuid}`)
                else router.push(`/glossary/${item.value.glossaryGuid}`)
            }
            onMounted(addSelectedKey)
            watch(profileId, () => {
                addSelectedKey()
            })

            const hasCreateAccess = computed(() =>
                checkAccess([map.CREATE_TERM, map.CREATE_CATEGORY], 'or')
            )
            return {
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
                hasCreateAccess,
            }
        },
    })
</script>
<style lang="less" module></style>
