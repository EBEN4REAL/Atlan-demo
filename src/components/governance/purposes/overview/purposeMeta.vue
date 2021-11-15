<template>
    <div>
        <div class="pt-6 details-section">
            <span class="text-sm text-gray-500">Created by</span>
            <div class="flex items-center text-sm">
                <Avatar
                    :username="persona.createdBy"
                    styleClass="bg-white mr-1"
                />
                <span class="text-gray">
                    {{ persona.createdBy }}
                </span>
            </div>
            <span class="text-sm text-gray-500">on</span>
            <span class="text-sm text-gray">{{ persona.createdAt }}</span>

            <a-switch
                class="ml-auto"
                style="width: 44px"
                :class="enablePersonaCheck ? 'btn-checked' : 'btn-unchecked'"
                v-model:checked="enablePersonaCheck"
            />
            <span class="text-sm text-gray">Enable Persona</span>
        </div>
        <div class="py-4 text-gray-500 gap-x-2">
            <p class="mb-3 text-sm font-bold text-gray-700">Classifications</p>
            <Classification
                v-model:modelValue="selectedClassifications"
                :disabled="addClassificationsDisabled"
                @change="handleClassificationChange"
            />
        </div>
        <div class="flex items-center py-4 mt-0">
            <div
                class="relative flex items-center flex-1 p-4 border border-gray-300 rounded cursor-pointer  group"
                @click="setActiveTab('policies')"
            >
                <div class="p-3 mr-3 rounded text-primary bg-primary-light">
                    <AtlanIcon icon="Policy" class="h-6" />
                </div>
                <div class="w-full">
                    <div class="mb-1 font-bold text-gray-700">Policy</div>
                    <div class="flex text-gray-500">
                        <div
                            v-if="
                                persona.dataPolicies?.length === 0 &&
                                persona.metadataPolicies?.length === 0
                            "
                        >
                            No policies added
                        </div>
                        <div v-else class="flex items-center">
                            <div class="mr-3">
                                <b>{{ persona.metadataPolicies?.length }}</b>
                                Metadata policies
                            </div>
                            <div>
                                <b>{{ persona.dataPolicies?.length }}</b>
                                Data policies
                            </div>
                        </div>
                        <div
                            class="absolute right-0 opacity-0  vertical-center group-hover:opacity-100"
                        >
                            <AtlanIcon
                                icon="ArrowRight"
                                class="h-6 ml-auto group-hover:text-primary"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, watch, computed } from 'vue'

    import { IPersona } from '~/types/accessPolicies/personas'
    import { enablePersona } from '../composables/useEditPurpose'
    import { setActiveTab } from '../composables/usePurposeTabs'
    import Avatar from '@common/avatar/user.vue'
    import Classification from '@common/input/classification/index.vue'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import { selectedPersonaDirty } from '../composables/useEditPurpose'

    export default defineComponent({
        name: 'PurposeMeta',
        components: { Avatar, Classification },
        props: {
            persona: {
                type: Object as PropType<IPersona>,
                required: true,
            },
        },
        emits: ['update:persona', 'update:isEditMode'],
        setup() {
            const { classificationList } = useTypedefData()
            const enablePersonaCheck = ref(true)

            /* FIXME: FIND IF WE CAN DO IT IN OTHER WAY! */
            const mapClassificationsFromNames = (names: string[]) => {
                let arr: any[] = []
                classificationList.value.forEach((cl) => {
                    names?.forEach((name) => {
                        if (name === cl.name) {
                            arr.push({
                                typeName: cl.name,
                                entityGuid: cl.guid,
                                entityStatus: 'ACTIVE',
                                propagate: false,
                                validityPeriods: [],
                                removePropagationsOnEntityDelete: false,
                            })
                        }
                    })
                })
                return arr
            }

            /* Mimic the classification Names */
            const classificationNames = computed(() => [
                selectedPersonaDirty.value.tag,
            ])

            const selectedClassifications = ref(
                mapClassificationsFromNames(classificationNames.value)
            )
            const addClassificationsDisabled = computed(() =>
                selectedClassifications.value.length > 0 ? true : false
            )

            const handleClassificationChange = () => {
                if (classificationNames.value.length > 0)
                    selectedPersonaDirty.value.tag =
                        classificationNames.value[0]
                else selectedPersonaDirty.value.tag = ''
                /* Call save purpose */
            }
            watch(classificationNames, () => {
                selectedClassifications.value = mapClassificationsFromNames(
                    classificationNames.value
                )
            })

            return {
                handleClassificationChange,
                addClassificationsDisabled,
                selectedClassifications,
                enablePersonaCheck,
                enablePersona,
                setActiveTab,
            }
        },
    })
</script>
<style lang="less" scoped>
    .details-section {
        @apply flex items-center gap-x-2 py-4;
        @apply text-gray-500;
        @apply cursor-pointer;
    }
    .user-group-pill {
        @apply rounded-full bg-primary-light text-primary text-sm px-2 py-1;
    }
    .data-policy-pill {
        @apply rounded-full text-sm px-2 py-1;
        background-color: #eeffef;
        color: #00a680;
    }
    .metadata-policy-pill {
        @apply rounded-full text-sm px-2 py-1;
        background-color: #fcf3fc;
        color: #d452d7;
    }
    .btn-checked {
        background: #00a680;
    }
    .vertical-center {
        top: 50%;
        transform: translate(-50%, -50%);
    }
</style>
