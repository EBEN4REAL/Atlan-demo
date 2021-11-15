<template>
    <div
        class="group-hover:opacity-100 leading-5"
        :class="{
            'opacity-100': isVisible,
            'opacity-0 treeMode': treeMode,
            'opacity-100': visible,
        }"
    >
        <a-dropdown
            v-model:visible="isVisible"
            :trigger="treeMode ? ['click'] : ['click']"
            :class="{
                [$style.treeMode] : treeMode,
                [$style.threeDotMenu]: true
            }"
            @click.stop="() => {}"
        >
            <a-button
                class="px-2 three-dot-menu"
                :class="{
                    ' border-0 shadow-none outline-none':
                         treeMode,
                    'treeMode h-4 w-4 ml-0.5': treeMode,
                }"
                @click.prevent
            >
                <!-- <fa icon="fal ellipsis-v" class="h-4" /> -->
                <AtlanIcon icon="Add" class="h-4 m-0" />
            </a-button>
            <template #overlay>
                <a-menu :class="$style.threeDotMenu">

                    <a-menu-item
                        v-if="
                            entity?.typeName !== 'AtlasGlossaryTerm' 
                        "
                        key="add"
                        @click="closeMenu"
                    >
                        <AddGtcModal
                            mode="create"
                            entityType="term"
                            :parentGlossaryGuid="parentGlossaryGuid"
                        >
                            <template #header>
                                <ModalHeader
                                    parentEntityType="AtlasGlossary"
                                    :parentEntityTitle="parentGlossaryTitle"
                                    entity-to-add="term"
                                />
                            </template>
                            <template #trigger>
                                <div class="flex items-center">
                                    <AtlanIcon icon="Term" class="m-0 mr-2" />
                                    <p class="p-0 m-0">Create New Term</p>
                                </div>
                            </template>
                        </AddGtcModal>
                    </a-menu-item>

                    <a-menu-item
                        v-if="
                            entity?.typeName !== 'AtlasGlossaryTerm' 
                        "
                        key="addCat"
                        @click="closeMenu"
                    >
                        <AddGtcModal
                            mode="create"
                            entityType="category"
                            :parentGlossaryGuid="parentGlossaryGuid"
                        >
                            <template #header>
                                <ModalHeader
                                    parentEntityType="AtlasGlossary"
                                    :parentEntityTitle="parentGlossaryTitle"
                                    entity-to-add="term"
                                />
                            </template>
                            <template #trigger>
                                <div class="flex items-center">
                                    <AtlanIcon
                                        icon="Category"
                                        class="m-0 mr-2"
                                    />
                                    <p class="p-0 m-0">Create New Category</p>
                                </div>
                            </template>
                        </AddGtcModal>
                    </a-menu-item>

                    <!-- <a-menu-divider /> -->
                </a-menu>
            </template>
        </a-dropdown>
    </div>
</template>
<script lang="ts">
    import {
        defineComponent,
        ref,
    } from 'vue'

    // components
    import AddGtcModal from '@/glossary/modal/addGtcModal.vue'
    import ModalHeader from '@/glossary/modal/modalHeader.vue'

    export default defineComponent({
        name: 'GlossaryAddCta',
        components: {
            AddGtcModal,
            ModalHeader,
        },
        props: {
            parentGlossaryGuid: {
                type: String,
                required: true,
            },
            parentGlossaryTitle: {
                type: String,
                required: true,
            },
            treeMode: {
                type: Boolean,
                required: false,
                default: true,
            },
            visible: {
                type: Boolean,
                required: false,
                default: true,
            },
        },
        setup(props, context) {
            // data
            const isVisible = ref(false)

            const closeMenu = () => {
                isVisible.value = false
            }



            return {
                isVisible,
                closeMenu,
            }
        },
    })
</script>
<style lang="less" module>
    .treeMode {
        @apply bg-black bg-opacity-0 !important;
    }
    .threeDotMenu {
        :global(.ant-dropdown-menu-item) {
            padding: 9px 16px !important;
            margin: 0;
        }
        :global( .ant-dropdown-menu-submenu-title) {
            padding: 9px 16px !important;
            margin: 0;
        }
    }
</style>
