<template>
    <CreationModal
        v-model:visible="modalVisible"
        :title="title"
        @cancel="() => (modalVisible = false)"
        @ok="handleCreation"
    >
        <div class="flex flex-col items-stretch pb-4 gap-y-1">
            <input
                ref="titleBar"
                v-model="title"
                placeholder="Untitled purpose"
                type="text"
                data-test-id="input-text"
                class="text-lg font-bold text-gray-700 clean-input"
                @keyup.esc="$event?.target?.blur()"
            />

            <textarea
                v-model="description"
                class="text-sm text-gray-500 clean-input"
                maxlength="140"
                rows="2"
                placeholder="Add description..."
                @keyup.esc="$event?.target?.blur()"
                data-test-id="input-description"
            />
        </div>
        <template #extraFooterContent>
            <div class="flex items-center">
                <Classification
                    v-model:modelValue="selectedClassifications"
                    @change="handleClassificationChange"
                    :editPermission="true"
                />
                <span
                    class="ml-2 text-red-500"
                    v-if="rules.classification.show"
                    data-test-id="validation-classification"
                >
                    {{ rules.classification.text }}
                </span>
            </div>
        </template>
    </CreationModal>
</template>

<script lang="ts">
    import { message } from 'ant-design-vue'
    import {
        computed,
        defineComponent,
        Ref,
        ref,
        toRefs,
        PropType,
        watch,
    } from 'vue'
    import { whenever } from '@vueuse/core'
    import CreationModal from '@/admin/common/addModal.vue'
    import {
        selectedPersonaId,
        reFetchList,
    } from './composables/usePurposeList'
    import { IPurpose } from '~/types/accessPolicies/purposes'
    import { generateUUID } from '~/utils/helper/generator'
    import Classification from '@common/input/classification/index.vue'
    import usePurposeService from './composables/usePurposeService'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    export default defineComponent({
        name: 'AddPurpose',
        components: {
            CreationModal,
            Classification,
        },
        props: {
            visible: {
                type: Boolean,
                default: false,
            },
            personaList: {
                type: Object as PropType<IPurpose[]>,
                required: true,
            },
        },
        emits: ['update:visible'],
        setup(props, { emit }) {
            const { createPersona } = usePurposeService()
            const titleBar: Ref<null | HTMLInputElement> = ref(null)
            const rules = ref({
                selectedClassifications: {
                    text: 'This classifications combination is already used in another purpose!',
                    show: false,
                },
                classification: {
                    show: false,
                    text: 'Select a classification first!',
                },
            })
            const title = ref('')
            const description = ref('')
            const selectedClassifications = ref([])

            const { visible } = toRefs(props)
            const modalVisible = computed({
                get: () => visible.value,
                set: (val) => emit('update:visible', val),
            })

            function toggleModal() {
                modalVisible.value = !modalVisible.value
            }

            async function handleCreation() {
                if (selectedClassifications.value.length == 0) {
                    rules.value.classification.show = true
                    return
                }

                const messageKey = Date.now()
                message.loading({
                    content: 'Adding new purpose',
                    duration: 0,
                    key: messageKey,
                })
                try {
                    /* FIX ME: Right now we are recivieing these property as snake_case and sending them as camel case */
                    // display_name
                    // metadata_policies
                    //data_policies
                    const newPurpose: IPurpose = (await createPersona({
                        id: generateUUID(),
                        description: description.value,
                        name: title.value,
                        displayName: title.value,
                        tags: selectedClassifications.value.map(
                            (e) => e.typeName
                        ),
                        /* Hardcode here */
                        metadataPolicies: [],
                        dataPolicies: [],
                    })) as IPurpose

                    message.success({
                        content: `${title.value} purpose Created`,
                        duration: 1.5,
                        key: messageKey,
                    })
                    description.value = ''
                    title.value = ''

                    reFetchList().then(() => {
                        selectedPersonaId.value = newPurpose.id!
                        modalVisible.value = false
                    })
                    useAddEvent('governance', 'purpose', 'created')
                } catch (error) {
                    message.error({
                        content:
                            error?.response?.data?.message ??
                            'Failed to delete policy',
                        duration: 1.5,
                        key: messageKey,
                    })
                }
            }
            const addClassificationsDisabled = computed(() =>
                selectedClassifications.value.length > 0 ? true : false
            )
            const handleClassificationChange = () => {
                if (selectedClassifications.value.length > 0) {
                    rules.value.classification.show = false
                } else {
                    rules.value.classification.show = true
                }
            }
            watch(modalVisible, () => {
                if (modalVisible.value) selectedClassifications.value = []
            })

            whenever(titleBar, () => {
                titleBar.value?.focus()
            })

            return {
                rules,
                handleClassificationChange,
                addClassificationsDisabled,
                selectedClassifications,
                toggleModal,
                modalVisible,
                handleCreation,
                title,
                description,
                titleBar,
            }
        },
    })
</script>

<style lang="less" scoped>
    .clean-input {
        @apply block bg-transparent border-0 shadow-none outline-none;

        &:focus {
            @apply outline-none;
        }
    }
</style>
