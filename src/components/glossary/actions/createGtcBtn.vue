<template>
    <a-dropdown
        v-model:visible="isVisible"
        trigger="hover"
        placement="bottomRight"
    >
        <a-button class="ml-3" size="small">
            <atlan-icon
                icon="Add"
                class="transition duration-300 text-primary"
            />
        </a-button>

        <template #overlay>
            <a-menu class="" mode="vertical">
                <a-menu-item @click="closeMenu">
                    <AddGTCModal
                        :key="selectedGlossaryQf"
                        entityType="AtlasGlossaryTerm"
                        @add="handleAdd"
                        :glossaryQualifiedName="selectedGlossaryQf"
                        :glossaryName="selectedGlosaryName"
                        :showGlossarySelect="
                            selectedGlossaryQf?.length ? false : true
                        "
                    >
                        <template #trigger>
                            <div class="flex items-center">
                                <AtlanIcon icon="Term" class="m-0 mr-2" />
                                <p class="p-0 m-0">Add Term</p>
                            </div>
                        </template>
                    </AddGTCModal>
                </a-menu-item>
                <a-menu-item @click="closeMenu">
                    <AddGTCModal
                        :key="selectedGlossaryQf"
                        entityType="AtlasGlossaryCategory"
                        @add="handleAdd"
                        :glossaryQualifiedName="selectedGlossaryQf"
                        :glossaryName="selectedGlosaryName"
                        :showGlossarySelect="
                            selectedGlossaryQf?.length ? false : true
                        "
                    >
                        <template #trigger>
                            <div class="flex items-center">
                                <AtlanIcon icon="Category" class="m-0 mr-2" />
                                <p class="p-0 m-0">Add Category</p>
                            </div>
                        </template>
                    </AddGTCModal>
                </a-menu-item>
                <a-menu-item @click="closeMenu">
                    <AddGTCModal
                        :key="selectedGlossaryQf"
                        entityType="AtlasGlossary"
                        @add="handleAdd"
                        :glossaryQualifiedName="selectedGlossaryQf"
                        :glossaryName="selectedGlosaryName"
                    >
                        <template #trigger>
                            <div class="flex items-center">
                                <AtlanIcon
                                    icon="GlossaryGray"
                                    class="m-0 mr-2"
                                />
                                <p class="p-0 m-0">Add Glossary</p>
                            </div>
                        </template>
                    </AddGTCModal>
                </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
</template>
<script lang="ts">
    import { defineComponent, computed, ref } from 'vue'
    // data
    import useGlossaryStore from '~/store/glossary'
    // components
    import AddGTCModal from '@/glossary/modal/addGtcModal.vue'

    export default defineComponent({
        components: {
            AddGTCModal,
        },
        props: {
            selectedGlossaryQf: {
                type: String,
                required: true,
            },
        },
        emits: ['add'],
        setup(props, { emit }) {
            const glossaryStore = useGlossaryStore()
            const isVisible = ref(false)
            const closeMenu = () => {
                isVisible.value = false
            }

            const selectedGlossary = computed(() =>
                glossaryStore.getGlossaryByQualifiedName(
                    props.selectedGlossaryQf
                )
            )
            const selectedGlosaryName = computed(
                () => selectedGlossary?.value?.attributes?.name
            )

            const defaultEntityType = computed(() => {
                if (props.selectedGlossaryQf) {
                    return 'AtlasGlossaryTerm'
                }
                return 'AtlasGlossary'
            })
            const handleAdd = (asset, entity) => {
                emit('add', asset, entity)
            }
            return {
                defaultEntityType,
                selectedGlosaryName,
                handleAdd,
                closeMenu,
                isVisible,
            }
        },
    })
</script>
<style lang=""></style>