<template>
    <a-dropdown v-model:visible="isVisible" @click.stop="() => {}">
        <a-button class="" @click.prevent size="small">
            <AtlanIcon icon="KebabMenu" class="" />
        </a-button>
        <template #overlay>
            <a-menu>
                <a-menu-item
                    v-if="showLinks"
                    key="copyLink"
                    class="flex items-center"
                    @click="handleCopyProfileLink"
                >
                    <div class="flex items-center">
                        <AtlanIcon icon="CopyOutlined" class="m-0 mr-2" />
                        <p class="p-0 m-0">
                            Copy
                            {{ assetTypeLabel[entity?.typeName] }}
                            profile link
                        </p>
                    </div>
                </a-menu-item>
                <!-- Bulk upload hidden for GA  : only available for secret url i.e. ?sandbox=true-->
                <a-menu-divider></a-menu-divider>
                <!-- Archive -->
                <a-menu-item
                    v-if="showGtcCrud"
                    key="archive"
                    class="text-red-700"
                    @click="closeMenu"
                >
                    <template v-if="entityDeletePermission">
                        <RemoveGTCModal :entity="entity" :redirect="true">
                            <template #trigger>
                                <div class="flex items-center">
                                    <AtlanIcon
                                        icon="Trash"
                                        class="mr-2 text-red-700"
                                    />
                                    <p class="p-0 m-0 text-gray-700 capitalize">
                                        Archive
                                    </p>
                                </div>
                            </template>
                        </RemoveGTCModal>
                    </template>
                    <template v-else>
                        <a-tooltip
                            placement="right"
                            title="You don't have permission to perform this action"
                        >
                            <div class="flex items-center cursor-not-allowed">
                                <AtlanIcon
                                    icon="Trash"
                                    class="mr-2 text-red-100"
                                />
                                <p class="p-0 m-0 text-gray-400 capitalize">
                                    Archive
                                </p>
                            </div>
                        </a-tooltip>
                    </template>
                </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
</template>
<script lang="ts">
    import {
        defineComponent,
        ref,
        PropType,
        inject,
        toRefs,
        watch,
        Ref,
        computed,
    } from 'vue'
    import { useRouter, useRoute } from 'vue-router'

    // components
    import { message } from 'ant-design-vue'
    // utils
    import { copyToClipboard } from '~/utils/clipboard'
    import RemoveGTCModal from '@/glossary/modal/removeGTCModal.vue'
    import assetTypeLabel from '@/glossary/constants/assetTypeLabel'
    // composables
    // import useDeleteGlossary from '~/components/glossary/composables/useDeleteGlossary'
    import {
        Glossary,
        Category,
        Term,
    } from '~/types/glossary/glossary.interface'

    export default defineComponent({
        components: {
            RemoveGTCModal,
        },
        props: {
            entity: {
                type: Object as PropType<Glossary | Category | Term>,
                required: true,
                default: () => {},
            },
            entityDeletePermission: { type: Boolean, required: true },
            showLinks: {
                type: Boolean,
                required: false,
                default: () => true,
            },
            showGtcCrud: {
                type: Boolean,
                required: false,
                default: () => true,
            },
            showUnlinkAsset: {
                type: Boolean,
                required: false,
                default: () => false,
            },

            treeMode: {
                type: Boolean,
                required: false,
                default: () => false,
            },
            visible: {
                type: Boolean,
                required: false,
                default: true,
            },
        },
        emits: ['unlinkAsset'],
        setup(props, context) {
            // data
            const { entity } = toRefs(props)
            const isVisible = ref(false)
            const isModalVisible = ref<boolean>(false)
            const router = useRouter()
            const route = useRoute()
            const sandbox = computed(() => route?.query?.sandbox || '')
            const showCategories = ref(false)

            const glossaryId = computed(() => {
                if (props.entity?.typeName === 'AtlasGlossary')
                    return props.entity?.guid ?? ''
                return props.entity?.attributes?.anchor?.guid ?? ''
            })
            const categoryId = computed(() => {
                if (props.entity?.typeName === 'AtlasGlossaryCategory')
                    return props.entity?.guid
                return ''
            })
            const categoryQf = computed(() => {
                if (props.entity?.typeName === 'AtlasGlossaryCategory')
                    return props.entity?.attributes?.qualifiedName
                return ''
            })

            const closeMenu = () => {
                isVisible.value = false
            }
            const showModal = () => {
                isModalVisible.value = true
                isVisible.value = false
            }

            const handleCancel = () => {
                isModalVisible.value = false
            }

            // copy profile link
            const handleCopyProfileLink = () => {
                const baseUrl = window.location.origin
                const text = `${baseUrl}/glossary/${glossaryId.value}`
                copyToClipboard(text)
                message.success({
                    content: 'Copied!',
                })
                closeMenu()
            }

            return {
                handleCopyProfileLink,
                assetTypeLabel,
                isVisible,
                isModalVisible,
                handleCancel,
                showModal,
                closeMenu,

                glossaryId,
                categoryId,
                categoryQf,
                showCategories,
                entity,
                sandbox,
            }
        },
    })
</script>
<style lang="less" module></style>
