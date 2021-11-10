<template>
    <div class="flex flex-col px-5">
        <div class="flex items-center mb-2 gap-x-2">
            <AtlanIcon icon="Shield" class="text-pink-400" />
            <span class="text-sm tracking-wide text-gray-500 uppercase"
                >Classification</span
            >
            <Dropdown
                v-if="classificationDropdownOption.length"
                class="ml-auto"
                :options="classificationDropdownOption"
            ></Dropdown>
        </div>
        <span class="mb-1 text-xl truncate text-gray">{{ selectedClassification?.displayName }}</span>

        <div class="flex mb-0 text-sm text-gray-500">
            <span v-if="!selectedClassification?.description"
                >Click to add description</span
            >
            <span v-else class="break-words">{{
                selectedClassification?.description
            }}</span>
        </div>

        <!-- <UpdateClassificationModal
            :classification="{ ...selectedClassification }"
            :open="isEditClassificationModalOpen"
            @close="closeEditClassificationModal"
        />

        <DeleteClassificationModal
            :classification="{ ...selectedClassification }"
            :open="isDeleteClassificationModalOpen"
            @close="closeDeleteClassificationModal"
        /> -->
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed, ref, PropType } from 'vue'

    // import UpdateClassificationModal from './updateClassificationModal.vue'
    // import DeleteClassificationModal from './deleteClassificationModal.vue'
    // import { useUserPreview } from '~/composables/user/showUserPreview'
    import Dropdown from '@/UI/dropdown.vue'

    import { ClassificationInterface } from '~/types/classifications/classification.interface'

    export default defineComponent({
        name: 'ClassificationHeader',
        components: {
            Dropdown,
            // UpdateClassificationModal,
            // DeleteClassificationModal,
        },
        props: {
            classification: {
                type: Object as PropType<ClassificationInterface>,
                required: true,
            }
        },
        setup(props) {
            const isDeleteClassificationModalOpen = ref(false)
            const isEditClassificationModalOpen = ref(false)

            const selectedClassification = computed(
                (): ClassificationInterface => props.classification
            )
            const displayName = computed(
                () => selectedClassification.value.displayName
            )

            const classificationDropdownOption = computed(() => {
                const options: Record<string, any>[] = []
                    options.push( {
                        title: 'Edit',
                        icon: 'Edit',
                        handleClick: editClassification,
                    })
                    options.push({
                    title: 'Delete',
                    icon: 'Trash',
                    class: 'text-red-700',
                    handleClick: deleteClassification,
                })
                return options
            })
            const deleteClassification = () => {
                isDeleteClassificationModalOpen.value = true
            }
            const editClassification = () => {
                isEditClassificationModalOpen.value = true
            }
            const closeEditClassificationModal = () => {
                isEditClassificationModalOpen.value = false
            }
            const closeDeleteClassificationModal = () => {
                isDeleteClassificationModalOpen.value = false
            }
            // user preview drawer
            // const { showUserPreview, setUserUniqueAttribute } = useUserPreview()
            // const handleClickUser = (username: string) => {
            //     setUserUniqueAttribute(username, 'username')
            //     showUserPreview({ allowed: ['about'] })
            // }
            return {
                isDeleteClassificationModalOpen,
                closeDeleteClassificationModal,
                closeEditClassificationModal,
                classificationDropdownOption,
                isEditClassificationModalOpen,
                deleteClassification,
                selectedClassification,
                displayName,
 
                // handleClickUser,
            }
        },
    })
</script>
