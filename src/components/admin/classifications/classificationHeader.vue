<template>
    <div class="grid grid-cols-11 pb-6 bg-white border-b classification-header">
        <div class="col-start-1 col-end-9 px-4 border-right">
            <div class="flex">
                <div class="mr-4">
                    <span
                        class="flex items-center justify-center p-1 text-xl border rounded"
                    >
                        <fa icon="fal shield text-gray-500  " class="" />
                    </span>
                </div>
                <div>
                    <p class="flex items-center mb-2 text-xl font-black ">
                        {{ displayName }}
                    </p>
                    <div class="mb-1 text-sm text-gray-300">
                        <span v-if="createdAt">
                            Created {{ createdAt }} by
                            <span
                                class="underline cursor-pointer text-primary"
                                @click="() => handleClickUser(createdBy)"
                                >{{ createdBy }}</span
                            >
                        </span>
                        <span v-if="updatedAt">
                            <span class="px-1">·</span>
                            Updated {{ updatedAt }} by
                            <span
                                class="underline cursor-pointer text-primary"
                                @click="() => handleClickUser(updatedBy)"
                            >
                                {{ updatedBy }}</span
                            >
                        </span>
                    </div>
                    <div class="mt-3">
                        <p class="mb-1 text-sm text-gray-300">
                            Description
                        </p>
                        <p class="mb-0 text-sm text-gray-400">
                            <span v-if="!selectedClassification.description"
                                >Click to add description</span
                            >
                            <span
                                v-else-if="selectedClassification.description"
                                >{{ selectedClassification.description }}</span
                            >
                            <span v-else>No description added</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex justify-end col-start-9 col-end-12">
            <div class="flex items-start border rounded three-dots">
                <Dropdown
                    :options="classificationDropdownOption"
                    :isArrow="false"
                    :variant="'link btn-no-focus text-gray p-0 border-0'"
                    :no-caret="true"
                    right
                ></Dropdown>
            </div>
        </div>
        <UpdateClassificationModal
            :classification="{ ...selectedClassification }"
            @close="closeEditClassificationModal"
            :open="isEditClassificationModalOpen"
        />

        <DeleteClassificationModal
            :classification="{ ...selectedClassification }"
            @close="closeDeleteClassificationModal"
            :open="isDeleteClassificationModalOpen"
        />
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed, ref } from 'vue';
    import Dropdown from '~/components/admin/classifications/dropdown.vue';
    import UpdateClassificationModal from './updateClassificationModal.vue';
    import DeleteClassificationModal from './deleteClassificationModal.vue';
    import { useUserPreview } from '~/composables/user/showUserPreview';
    import { useTimeAgo } from '@vueuse/core';
    // import moment from "moment";
    export default defineComponent({
        name: 'ClassificationHeader',
        components: {
            Dropdown,
            UpdateClassificationModal,
            DeleteClassificationModal,
        },
        props: {
            classification: Object,
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
        setup(props, context) {
            const isDeleteClassificationModalOpen = ref(false);
            const isEditClassificationModalOpen = ref(false);
            const selectedClassification = computed(() => {
                return props.classification;
            });
            const displayName = computed(() => {
                return selectedClassification.value.displayName;
            });
            const truncate = computed((string, length) => {
                return string.substring(0, length);
            });
            const createdAt = computed(() => {
                const timestamp = selectedClassification.value.createTime;
                return useTimeAgo(timestamp).value || '';
                // return moment(timestamp).fromNow();
            });
            const createdBy = computed(
                () => selectedClassification.value.createdBy
            );
            const updatedAt = computed(() => {
                const timestamp = selectedClassification.value.updateTime;
                return useTimeAgo(timestamp).value || '';
                // return moment(timestamp).fromNow();
            });
            const updatedBy = computed(
                () => selectedClassification.value.updatedBy
            );
            const classificationDropdownOption = computed(() => {
                const dpOpArray = [];
                dpOpArray.push({
                    title: `Edit classification`,
                    icon: 'pencil',
                    iconType: 'fal',
                    handleClick: editClassification,
                });
                dpOpArray.push({
                    title: `Delete classification`,
                    icon: 'trash-alt',
                    iconType: 'fal',
                    class: ['text-danger'],
                    handleClick: deleteClassification,
                });
                return dpOpArray;
            });
            const deleteClassification = () => {
                isDeleteClassificationModalOpen.value = true;
            };
            const editClassification = () => {
                isEditClassificationModalOpen.value = true;
            };
            const closeEditClassificationModal = () => {
                isEditClassificationModalOpen.value = false;
            };
            const closeDeleteClassificationModal = () => {
                isDeleteClassificationModalOpen.value = false;
            };
            // user preview drawer
            const {
                showUserPreview,
                setUserUniqueAttribute,
            } = useUserPreview();
            const handleClickUser = (username: string) => {
                setUserUniqueAttribute(username, 'username');
                showUserPreview({ allowed: ['about'] });
            };
            return {
                isDeleteClassificationModalOpen,
                closeDeleteClassificationModal,
                closeEditClassificationModal,
                classificationDropdownOption,
                isEditClassificationModalOpen,
                deleteClassification,
                selectedClassification,
                displayName,
                truncate,
                createdAt,
                updatedAt,
                updatedBy,
                createdBy,
                handleClickUser,
            };
        },
    });
</script>
<style lang="less" scoped>
    .three-dots {
        height: fit-content;
        cursor: pointer;
    }
</style>
