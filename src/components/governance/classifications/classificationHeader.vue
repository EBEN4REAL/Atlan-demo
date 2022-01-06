<template>
    <div class="flex flex-col px-5 py-5 bg-white">
        <div class="flex justify-between gap-x-2">
            <div class="flex flex-col gap-y-3">
                <div class="flex items-start">
                    <ClassificationIcon
                        :color="selectedClassification?.options?.color"
                        class="h-6 mr-2"
                    />
                    <div class="flex flex-col" style="margin-top: -3px">
                        <span class="text-xl truncate text-gray">
                            {{ selectedClassification?.displayName }}
                        </span>
                        <div
                            v-if="selectedClassification.updatedBy"
                            class="flex text-gray-500"
                        >
                            last updated by
                            {{ selectedClassification.updatedBy }},
                            {{ lastUpdatedAt }}
                        </div>
                    </div>
                </div>
                <!-- can extract below lines into a show more show less component -->
                <!-- <div
                    v-if="
                        selectedClassification?.description &&
                        selectedClassification?.description?.length > 80
                    "
                    class="relative w-3/4 overflow-hidden text-gray-500"
                    :class="descTrim ? 'h-5 flex' : ''"
                >
                    {{ selectedClassification?.description }}
                    <span
                        class="right-0 pl-2 bg-white rounded cursor-pointer text-primary hover:underline"
                        :class="descTrim ? 'absolute' : ''"
                        @click="descTrim = !descTrim"
                    >
                        {{ descTrim ? 'show more' : 'show less' }}
                    </span>
                </div>
                <div v-else class="text-gray-500">
                    {{ selectedClassification?.description }}
                </div> -->
                <!-- <div class="flex items-center gap-2 text-gray-500">
                    <div class="flex items-center gap-2">
                        Last Updated
                        <span class="text-gray-700"> {{ lastUpdatedAt }}</span>
                        by
                        <UserPill
                            :username="selectedClassification.updatedBy"
                            :allow-delete="false"
                            :enable-hover="false"
                            class=""
                            :border="false"
                        />
                    </div>
                    <span class="text-gray-200">&bull;</span>
                    <div class="flex items-center gap-2">
                        Created by
                        <UserPill
                            :username="selectedClassification.createdBy"
                            :allow-delete="false"
                            :enable-hover="false"
                            class=""
                            :border="false"
                        />
                        on
                        <span class="text-gray-700">{{ createdOn }}</span>
                    </div>
                </div> -->
            </div>
            <div v-auth="map.UPDATE_CLASSIFICATION" class="">
                <a-button-group class="">
                    <a-popover trigger="hover" placement="bottomLeft">
                        <a-button class="px-2.5">
                            <ClassificationIcon
                                class=""
                                :color="classificationColor"
                            />
                        </a-button>
                        <template #content>
                            <ClassificationColorSelector
                                class="py-1"
                                v-model:selectedColor="classificationColor"
                                menu-mode
                            />
                        </template>
                    </a-popover>

                    <a-button
                        v-auth="map.UPDATE_CLASSIFICATION"
                        class="px-2.5"
                        @click="editClassification"
                    >
                        <div>
                            <AtlanIcon icon="Pencil" />
                        </div>
                    </a-button>
                    <a-button
                        v-auth="map.DELETE_CLASSIFICATION"
                        class="px-2.5"
                        @click="deleteClassification"
                    >
                        <div class="flex items-center text-red-700">
                            <AtlanIcon icon="Delete" />
                        </div>
                    </a-button>
                </a-button-group>
            </div>
        </div>
        <AddClassificationModal
            v-model:modalVisible="isEditClassificationModalOpen"
            :classification="classification"
            mode="edit"
        />
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        computed,
        ref,
        PropType,
        toRefs,
        watch,
        h,
    } from 'vue'
    import { Modal } from 'ant-design-vue'
    import { whenever, useTimeAgo } from '@vueuse/core'
    import { useRouter } from 'vue-router'
    import dayjs from 'dayjs'
    import UserPill from '@/common/pills/user.vue'

    // import { useUserPreview } from '~/composables/user/showUserPreview'
    import Dropdown from '@/UI/dropdown.vue'
    import AddClassificationModal from '@/governance/classifications/addClassificationModal.vue'
    import AtlanBtn from '~/components/UI/button.vue'
    import ClassificationColorSelector from '@/governance/classifications/classificationColorSelector.vue'
    import ClassificationIcon from '@/governance/classifications/classificationIcon.vue'

    import useDeleteTypedefs from '~/composables/typedefs/useDeleteTypedefs'
    import { ClassificationInterface } from '~/types/classifications/classification.interface'

    import useEditTypedefs from '~/composables/typedefs/useEditTypedefs'
    import { useTypedefStore } from '~/store/typedef'
    import map from '~/constant/accessControl/map'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    export default defineComponent({
        name: 'ClassificationHeader',
        components: {
            Dropdown,
            UserPill,
            AddClassificationModal,
            AtlanBtn,
            ClassificationColorSelector,
            ClassificationIcon,
        },
        props: {
            classification: {
                type: Object as PropType<ClassificationInterface>,
                required: true,
            },
        },
        setup(props) {
            const isDeleteClassificationModalOpen = ref(false)
            const isEditClassificationModalOpen = ref(false)
            const typedefStore = useTypedefStore()

            const { classification: selectedClassification } = toRefs(props)

            const classificationColor = ref(
                selectedClassification?.value?.options?.color ?? 'Blue'
            )

            const router = useRouter()

            const body = ref({})
            const { mutate: mutateEdit } = useEditTypedefs(body)

            const displayName = computed(
                () => selectedClassification.value.displayName
            )

            const deleteClassification = () => {
                Modal.confirm({
                    title: 'Delete Classification',
                    class: 'delete-classification-modal',
                    content: () =>
                        h('div', [
                            'Are you sure you want to delete classification',
                            h('span', [' ']),
                            h(
                                'span',
                                {
                                    class: ['font-bold'],
                                },
                                [`${displayName.value}`]
                            ),
                            h('span', '?'),
                        ]),
                    okType: 'danger',
                    autoFocusButton: null,
                    okButtonProps: {
                        type: 'primary',
                    },
                    okText: 'Delete',
                    cancelText: 'Cancel',
                    async onOk() {
                        const {
                            error: deleteError,
                            mutate: mutateDelete,
                            isReady: isDeleteReady,
                        } = useDeleteTypedefs(selectedClassification.value.name)

                        mutateDelete()
                        whenever(isDeleteReady, () => {
                            if (typedefStore.classificationList.length) {
                                const { name } =
                                    typedefStore.classificationList[0]
                                router.push(
                                    `/governance/classifications/${name}`
                                )
                            } else {
                                router.push('/governance/classifications')
                            }
                            useAddEvent(
                                'governance',
                                'classification',
                                'deleted'
                            )
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
                                color: newClassificationColor,
                            },
                        },
                    ],
                }
                mutateEdit()
            })

            // user preview drawer
            // const { showUserPreview, setUserUniqueAttribute } = useUserPreview()
            // const handleClickUser = (username: string) => {
            //     setUserUniqueAttribute(username, 'username')
            //     showUserPreview({ allowed: ['about'] })
            // }

            const descTrim = ref(true)
            const timeAgo = ref(selectedClassification.value.updateTime)
            const lastUpdatedAt = useTimeAgo(timeAgo)
            const createdOn = computed(() =>
                dayjs(new Date(selectedClassification.value.createTime)).format(
                    'Do MMMM YYYY'
                )
            )

            return {
                createdOn,
                lastUpdatedAt,
                descTrim,
                isDeleteClassificationModalOpen,
                closeDeleteClassificationModal,
                closeEditClassificationModal,
                isEditClassificationModalOpen,
                deleteClassification,
                selectedClassification,
                displayName,
                editClassification,
                classificationColor,
                map,
            }
        },
    })
</script>
<style lang="less"></style>
