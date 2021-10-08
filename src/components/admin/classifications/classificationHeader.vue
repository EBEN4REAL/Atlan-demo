<template>
    <div class="flex flex-col px-5">
        <div class="flex items-center mb-2 gap-x-2">
            <AtlanIcon icon="Shield" class="text-pink-400" />
            <span class="text-sm tracking-wide text-gray-500 uppercase"
                >Classification</span
            >
            <Dropdown
                class="ml-auto"
                :options="classificationDropdownOption"
            ></Dropdown>
        </div>
        <span class="mb-1 text-xl truncate text-gray">{{ displayName }}</span>
        <!-- 
        <span v-if="createdAt">
            Created {{ createdAt }} by
            <span
                class="border-b border-dotted cursor-pointer text-gray"
                @click="() => handleClickUser(createdBy)"
                >{{ createdBy }}</span
            >
        </span>
        <span v-if="updatedAt">
            <span class="px-1">·</span>
            Updated {{ updatedAt }} by
            <span
                class="border-b border-dotted cursor-pointer text-gray"
                @click="() => handleClickUser(updatedBy)"
            >
                {{ updatedBy }}</span
            >
        </span> -->

        <div class="flex mb-0 text-sm text-gray-500">
            <span v-if="!selectedClassification.description"
                >Click to add description</span
            >
            <span v-else class="break-words">{{
                selectedClassification.description
            }}</span>
        </div>

        <UpdateClassificationModal
            :classification="{ ...selectedClassification }"
            :open="isEditClassificationModalOpen"
            @close="closeEditClassificationModal"
        />

        <DeleteClassificationModal
            :classification="{ ...selectedClassification }"
            :open="isDeleteClassificationModalOpen"
            @close="closeDeleteClassificationModal"
        />
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed, ref, PropType } from 'vue'
    import { useTimeAgo } from '@vueuse/core'
    import UpdateClassificationModal from './updateClassificationModal.vue'
    import DeleteClassificationModal from './deleteClassificationModal.vue'
    import { useUserPreview } from '~/composables/user/showUserPreview'
    import { classificationInterface } from '~/types/classifications/classification.interface'

    export default defineComponent({
        name: 'ClassificationHeader',
        components: {
            Dropdown,
            UpdateClassificationModal,
            DeleteClassificationModal,
        },
        props: {
            classification: {
                type: Object as PropType<classificationInterface>,
                required: true,
            },
            createdAt: {
                type: [Number, String],
                default: 0,
            },
            createdBy: {
                type: String,
                default: '',
            },
            updatedAt: {
                type: [Number, String],
                default: 0,
            },
            updatedBy: {
                type: String,
                default: '',
            },
            entityType: {
                type: String,
                default: '',
            },
        },
        setup(props) {
            const isDeleteClassificationModalOpen = ref(false)
            const isEditClassificationModalOpen = ref(false)
            const selectedClassification = computed(
                (): classificationInterface => props.classification
            )
            const displayName = computed(
                () => selectedClassification.value.displayName
            )
            const createdAt = computed(() => {
                const timestamp = selectedClassification.value.createTime
                return useTimeAgo(timestamp).value || ''
            })
            const createdBy = computed(
                () => selectedClassification.value.createdBy
            )
            const updatedAt = computed(() => {
                const timestamp = selectedClassification.value.updateTime
                return useTimeAgo(timestamp).value || ''
            })
            const updatedBy = computed(
                () => selectedClassification.value.updatedBy
            )
            const classificationDropdownOption = computed(() => [
                {
                    title: 'Edit',
                    icon: 'Edit',
                    handleClick: editClassification,
                },
                {
                    title: 'Delete',
                    icon: 'Trash',
                    class: 'text-red-700',
                    handleClick: deleteClassification,
                },
            ])
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
            const { showUserPreview, setUserUniqueAttribute } = useUserPreview()
            const handleClickUser = (username: string) => {
                setUserUniqueAttribute(username, 'username')
                showUserPreview({ allowed: ['about'] })
            }
            return {
                isDeleteClassificationModalOpen,
                closeDeleteClassificationModal,
                closeEditClassificationModal,
                classificationDropdownOption,
                isEditClassificationModalOpen,
                deleteClassification,
                selectedClassification,
                displayName,
                createdAt,
                updatedAt,
                updatedBy,
                createdBy,
                handleClickUser,
            }
        },
    })
</script>
<style lang="less" scoped>
    .three-dots {
        height: fit-content;
        cursor: pointer;
    }
    .max-text-width {
        max-width: calc(100vw - 48rem);
    }
</style>
