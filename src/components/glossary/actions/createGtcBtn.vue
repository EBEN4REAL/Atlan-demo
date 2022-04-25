<template>
    <a-dropdown
        v-model:visible="isVisible"
        trigger="click"
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
                        entity-type="AtlasGlossaryTerm"
                        :glossary-qualified-name="selectedGlossaryQf"
                        :glossary-name="selectedGlosaryName"
                        :show-glossary-select="
                            selectedGlossaryQf?.length ? false : true
                        "
                        @add="handleAdd"
                    >
                        <template #trigger>
                            <template v-if="!termAddPermission">
                                <a-tooltip
                                    title="You don't have permission to perform this action"
                                >
                                    <div
                                        :class="'cursor-not-allowed text-gray-400'"
                                        class="flex items-center"
                                        @click="(e) => e.stopPropagation()"
                                    >
                                        <AtlanIcon
                                            icon="Term"
                                            class="m-0 mr-2"
                                        />
                                        <p class="p-0 m-0">Add Term</p>
                                    </div>
                                </a-tooltip>
                            </template>
                            <div v-else class="flex items-center">
                                <AtlanIcon icon="Term" class="m-0 mr-2" />
                                <p class="p-0 m-0">Add Term</p>
                            </div>
                        </template>
                    </AddGTCModal>
                </a-menu-item>
                <a-menu-item @click="closeMenu">
                    <AddGTCModal
                        :key="selectedGlossaryQf"
                        entity-type="AtlasGlossaryCategory"
                        :glossary-qualified-name="selectedGlossaryQf"
                        :glossary-name="selectedGlosaryName"
                        :show-glossary-select="
                            selectedGlossaryQf?.length ? false : true
                        "
                        @add="handleAdd"
                    >
                        <template #trigger>
                            <template v-if="!categoryAddPermission">
                                <a-tooltip
                                    title="You don't have permission to perform this action"
                                >
                                    <div
                                        :class="'cursor-not-allowed text-gray-400'"
                                        class="flex items-center"
                                        @click="(e) => e.stopPropagation()"
                                    >
                                        <AtlanIcon
                                            icon="Term"
                                            class="m-0 mr-2"
                                        />
                                        <p class="p-0 m-0">Add Category</p>
                                    </div>
                                </a-tooltip>
                            </template>
                            <template v-else>
                                <div class="flex items-center">
                                    <AtlanIcon
                                        icon="Category"
                                        class="m-0 mr-2"
                                    />
                                    <p class="p-0 m-0">Add Category</p>
                                </div>
                            </template>
                        </template>
                    </AddGTCModal>
                </a-menu-item>
                <a-menu-item
                    v-if="role?.toLowerCase()==='admin'"
                    @click="closeMenu"
                >
                    <AddGTCModal
                        :key="selectedGlossaryQf"
                        entity-type="AtlasGlossary"
                        :glossary-qualified-name="selectedGlossaryQf"
                        :glossary-name="selectedGlosaryName"
                        @add="handleAdd"
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
    import whoami from '~/composables/user/whoami'

    export default defineComponent({
        components: {
            AddGTCModal,
        },
        props: {
            selectedGlossaryQf: {
                type: String,
                required: true,
            },
            termAddPermission: {
                type: Boolean,
                required: true,
            },
            categoryAddPermission: {
                type: Boolean,
                required: true,
            },
        },
        emits: ['add'],
        setup(props, { emit }) {
            const { role } = whoami()
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
                role,
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
