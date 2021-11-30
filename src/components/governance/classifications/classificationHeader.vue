<template>
    <div class="flex flex-col px-5">
        <div class="flex items-center mb-2 gap-x-2 justify-between">
            <div>
                <AtlanIcon icon="Shield" :style="`color: ${getClassificationColorHex(selectedClassification?.options?.color)}`"/>
                <span class="text-sm tracking-wide text-gray-500 uppercase"
                    >Classification</span
                >
            </div>
            <a-dropdown>
                <AtlanBtn
                    class="flex-none"
                    size="sm"
                    color="secondary"
                    padding="compact"
                    @click.prevent
                >
                    <AtlanIcon icon="KebabMenu" class="-mx-1 text-gray" />
                </AtlanBtn>

                <template #overlay>
                    <a-menu>
                        <a-menu-item
                            v-auth="map.UPDATE_CLASSIFICATION"
                            @click="editClassification"
                        >
                            <div class="flex items-center">
                                <AtlanIcon icon="Edit" />
                                <span class="pl-2 text-sm">Edit</span>
                            </div>
                        </a-menu-item>
                        <a-menu-item
                            v-auth="map.DELETE_CLASSIFICATION"
                            @click="deleteClassification"
                        >
                            <div class="flex items-center text-red-700">
                                <AtlanIcon icon="Trash" />
                                <span class="pl-2 text-sm">Delete</span>
                            </div>
                        </a-menu-item>
                        <a-sub-menu
                            v-auth="map.UPDATE_CLASSIFICATION"
                        >
                            <template #title>
                                <span class="flex items-center">
                                    <AtlanIcon icon="Shield" class="self-center mr-1" :style="`color: ${getClassificationColorHex(classificationColor)}`"/>
                                    <span>Color</span>
                                </span>
                            </template>
                            <a-menu-item class="m-0 bg-white p-0 w-28">
                                <ClassificationColorSelector v-model:selectedColor="classificationColor" menuMode/>
                            </a-menu-item>
                        </a-sub-menu>
                    </a-menu>
                </template>
            </a-dropdown>

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
        <AddClassificationModal
            v-model:modalVisible="isEditClassificationModalOpen"
            :classification="classification"
            mode="edit"
        />
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed, ref, PropType, toRefs, watch } from 'vue'
    import { Modal } from 'ant-design-vue'
    import { whenever } from '@vueuse/core'
    import { useRouter } from 'vue-router'

    // import { useUserPreview } from '~/composables/user/showUserPreview'
    import Dropdown from '@/UI/dropdown.vue'
    import AddClassificationModal from '@/governance/classifications/addClassificationModal.vue'
    import AtlanBtn from '~/components/UI/button.vue'
    import ClassificationColorSelector from '@/governance/classifications/classificationColorSelector.vue';

    import useDeleteTypedefs from '~/composables/typedefs/useDeleteTypedefs'
    import { ClassificationInterface } from '~/types/classifications/classification.interface'
    import getClassificationColorHex from '@/governance/classifications/utils/getClassificationColor';

    import useEditTypedefs from '~/composables/typedefs/useEditTypedefs'
    import { useTypedefStore } from '~/store/typedef'
    import map from '~/constant/accessControl/map'

    export default defineComponent({
        name: 'ClassificationHeader',
        components: {
            Dropdown,
            AddClassificationModal,
            AtlanBtn,
            ClassificationColorSelector
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
            const typedefStore = useTypedefStore()

            const { classification: selectedClassification} = toRefs(props)

            const classificationColor = ref(selectedClassification?.value?.options?.color ?? 'Blue');

            const router = useRouter()
            
            const body = ref({})
            const { mutate:mutateEdit }  = useEditTypedefs(body)

            const displayName = computed(
                () => selectedClassification.value.displayName
            )


            const deleteClassification = () => {
                Modal.confirm({
                    title: 'Delete Classification',
                    content: 'Are you sure to delete this Classification?',
                    okType: 'danger',
                    okText: 'Yes',
                    cancelText: 'No',
                    async onOk() {
                        const { error:deleteError, mutate: mutateDelete, isReady:isDeleteReady }  = useDeleteTypedefs(selectedClassification.value.name)

                        mutateDelete()
                        whenever(isDeleteReady, () => {
                            if(typedefStore.classificationList.length) {
                                const name = typedefStore.classificationList[0].name;
                                router.push(`/governance/classifications/${name}`)
                            } else {
                                router.push('/governance/classifications')
                            }
                        })
                    },
                })
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

            watch(classificationColor, (newClassificationColor) => {
                body.value = {
                    classificationDefs: [
                        {
                            ...selectedClassification.value,
                            options: {
                                ...selectedClassification.value?.options,
                                color: newClassificationColor
                            }
                        }
                    ]
                }
                mutateEdit()
            })


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
                isEditClassificationModalOpen,
                deleteClassification,
                selectedClassification,
                displayName,
                getClassificationColorHex,
                editClassification,
                classificationColor,
                map
            }
        },
    })
</script>
