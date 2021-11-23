<template>
    <div class="py-6 mb-2 border rounded border-primary">
        <div class="flex justify-between mb-6">
            <div class="relative">
                <div class="relative mb-2 text-sm text-gray-500 required">
                    Policy name
                </div>
                <div style="width: 320px">
                    <a-input
                        @blur="
                            () => {
                                if (!policy.name) rules.policyName.show = true
                                else rules.policyName.show = false
                            }
                        "
                        :ref="
                            (el) => {
                                policyNameRef = el
                            }
                        "
                        v-model:value="policy.name"
                        placeholder="Policy Name"
                    />
                </div>
                <div
                    class="absolute text-xs text-red-500 -bottom-5"
                    v-if="rules.policyName.show"
                >
                    {{ rules.policyName.text }}
                </div>
            </div>
            <a-popconfirm
                placement="leftTop"
                :title="getPopoverContent(policy)"
                ok-text="Yes"
                :ok-type="'default'"
                overlayClassName="popoverConfirm"
                cancel-text="Cancel"
                @confirm="removePolicy"
            >
                <AtlanBtn
                    size="sm"
                    color="secondary"
                    padding="compact"
                    class="plus-btn"
                    ><AtlanIcon
                        icon="Delete"
                        class="-mx-1 text-red-400"
                    ></AtlanIcon
                ></AtlanBtn>
            </a-popconfirm>
        </div>

        <div class="relative">
            <div class="mb-2 text-sm text-gray-500 required">
                Users / Groups
            </div>
            <Owners
                class="mb-6"
                v-model:modelValue="selectedOwnersData"
                :read-only="false"
                @change="handleOwnersChange"
                :destroyTooltipOnHide="true"
            />

            <div
                class="absolute text-xs text-red-500 -bottom-5"
                v-if="rules.users.show"
            >
                {{ rules.users.text }}
            </div>
        </div>

        <div class="flex items-center mb-2 gap-x-1">
            <AtlanIcon class="text-gray-500" icon="Lock" />
            <span class="text-sm text-gray-500">Metadata permissions</span>
        </div>
        <MetadataScopes v-model:actions="policy.actions" class="mb-6" />
        <div class="flex items-center gap-x-2">
            <a-switch
                :class="policy.allow ? '' : 'checked'"
                :checked="!policy.allow"
                style="width: 40px !important"
                @update:checked="policy.allow = !$event"
            />
            <span>Deny Permissions</span>
            <a-tooltip placement="right" color="white">
                <AtlanIcon
                    icon="Overview"
                    class="opacity-50 hover:opacity-100"
                />
                <template #title>
                    <p class="m-3 text-gray">
                        This will deny the permissions you have selected above,
                        for all the users in the persona, even if they had
                        access to those permissions via some other persona or
                        purpose.
                    </p>
                </template>
            </a-tooltip>

            <AtlanBtn
                class="ml-auto"
                size="sm"
                color="secondary"
                padding="compact"
                @click="$emit('cancel')"
                >Cancel</AtlanBtn
            >
            <AtlanBtn
                size="sm"
                color="primary"
                padding="compact"
                @click="handleSave"
                >Save</AtlanBtn
            >
        </div>
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        PropType,
        ref,
        toRefs,
        watch,
    } from 'vue'
    import AtlanBtn from '@/UI/button.vue'
    import PillGroup from '@/UI/pill/pillGroup.vue'
    import Pill from '@/UI/pill/pill.vue'
    import Connector from './connector.vue'
    import MetadataScopes from './metadataScopes.vue'
    import Owners from '~/components/common/input/owner/index.vue'
    import { MetadataPolicies } from '~/types/accessPolicies/purposes'
    import { selectedPersonaDirty } from '../composables/useEditPurpose'

    export default defineComponent({
        name: 'MetadataPolicy',
        components: {
            Pill,
            AtlanBtn,
            Connector,
            MetadataScopes,
            PillGroup,
            Owners,
        },
        props: {
            policy: {
                type: Object as PropType<MetadataPolicies>,
                required: true,
            },
        },
        emits: ['delete', 'save', 'cancel'],
        setup(props, { emit }) {
            const { policy } = toRefs(props)
            const assetSelectorVisible = ref(false)
            const connectorComponentRef = ref()
            const policyNameRef = ref()

            const rules = ref({
                policyName: {
                    text: 'Enter a policy name!',
                    show: false,
                },
                users: {
                    text: 'Atleast one user is required!',
                    show: false,
                },
                metadata: {
                    text: 'Select atleast 1 permissions!',
                    show: false,
                },
            })
            function removePolicy() {
                /* Delete when the policy is saved */
                if (!policy.value?.isNew) emit('delete')
                emit('cancel')
            }

            /* Mimic the classification Names */
            const selectedOwnersData = ref({
                ownerUsers: policy.value.users,
                ownerGroups: policy.value.groups,
            })

            const handleSave = () => {
                /* Validation for name */
                if (!policy.value.name) {
                    policyNameRef.value?.focus()
                    rules.value.policyName.show = true
                    return
                } else if (
                    selectedOwnersData.value?.ownerUsers?.length +
                        selectedOwnersData.value?.ownerGroups?.length <
                    1
                ) {
                    rules.value.users.show = true
                    return
                } else {
                    emit('save')
                }
            }

            const handleOwnersChange = () => {
                console.log(selectedOwnersData.value, 'owners')
                if (selectedOwnersData.value?.ownerUsers?.length > 0) {
                    policy.value.users = [
                        ...selectedOwnersData.value?.ownerUsers,
                    ]
                    console.log(policy.value.users, 'policYUsers')
                } else {
                    policy.value.users = []
                }
                if (selectedOwnersData.value?.ownerGroups?.length > 0) {
                    policy.value.groups = [
                        ...selectedOwnersData.value?.ownerGroups,
                    ]
                } else {
                    policy.value.groups = []
                }

                if (
                    selectedOwnersData.value?.ownerUsers?.length +
                        selectedOwnersData.value?.ownerGroups?.length <
                    1
                ) {
                    rules.value.users.show = true
                } else {
                    rules.value.users.show = false
                }
            }
            watch(selectedPersonaDirty, () => {
                selectedOwnersData.value = {
                    ownerUsers: policy.value.users,
                    ownerGroups: policy.value.groups,
                }
            })
            const getPopoverContent = (policy: any) => {
                return `Are you sure you want to delete ${policy?.name}?`
            }
            return {
                getPopoverContent,
                selectedOwnersData,
                handleOwnersChange,
                rules,
                handleSave,
                policyNameRef,
                connectorComponentRef,
                assetSelectorVisible,
                removePolicy,
            }
        },
    })
</script>
<style lang="less" scoped>
    .required:after {
        content: ' *';
        color: red;
    }
    .plus-btn:focus {
        border-color: #7b9ce3;
        border-right-width: 1 px !important;
        outline: 0;
        box-shadow: 0 0 0 2px rgb(82 119 215 / 20%);
    }
    .checked {
        background: #e04f1a;
    }
</style>
