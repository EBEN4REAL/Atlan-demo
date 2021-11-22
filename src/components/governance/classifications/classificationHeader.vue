<template>
    <div class="flex flex-col px-5">
        <div class="flex items-center mb-2 gap-x-2">
            <AtlanIcon icon="Shield" :style="`color: ${getClassificationColorHex(selectedClassification?.options?.color)}`"/>
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

    import useDeleteTypedefs from '~/composables/typedefs/useDeleteTypedefs'
    import { ClassificationInterface } from '~/types/classifications/classification.interface'
    import getClassificationColorHex from '@/governance/classifications/utils/getClassificationColor';

    import { useTypedefStore } from '~/store/typedef'

    export default defineComponent({
        name: 'ClassificationHeader',
        components: {
            Dropdown,
            AddClassificationModal,
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

            const router = useRouter()
            
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
                getClassificationColorHex
            }
        },
    })
</script>
