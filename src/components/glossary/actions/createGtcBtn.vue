<template>
    <AddGTCModal
        :key="selectedGlossaryQf"
        :entityType="defaultEntityType"
        @add="handleAdd"
        :glossaryQualifiedName="selectedGlossaryQf"
        :glossaryName="selectedGlosaryName"
    >
        <template #trigger>
            <a-tooltip>
                <template #title
                    >Add new
                    {{
                        `${
                            defaultEntityType === 'AtlasGlossary'
                                ? 'Glossary'
                                : 'Term/Category'
                        }`
                    }}</template
                >

                <a-button class="ml-3" size="small">
                    <atlan-icon
                        icon="Add"
                        class="transition duration-300 text-primary"
                    />
                </a-button>
            </a-tooltip>
        </template>
    </AddGTCModal>
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
            const handleAdd = (asset) => {
                emit('add', asset)
            }
            return {
                defaultEntityType,
                selectedGlosaryName,
                handleAdd,
            }
        },
    })
</script>
<style lang=""></style>
