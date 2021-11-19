<template>
    <div class="py-6 mb-2 border rounded border-primary">
        <AssetSelectorDrawer
            v-if="connectorData.attributeValue"
            v-model:visible="assetSelectorVisible"
            v-model:assets="policy.assets"
            :connection-qf-name="connectorData.attributeValue"
        />
        <div class="flex justify-between mb-6">
            <div class="relative">
                <div class="relative mb-2 text-sm text-gray-500 required">
                    Policy name
                </div>
                <div class="max-w-xs">
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
            <AtlanBtn
                size="sm"
                color="secondary"
                padding="compact"
                class="plus-btn"
                @click="removePolicy"
                ><AtlanIcon icon="Delete" class="-mx-1 text-red-400"></AtlanIcon
            ></AtlanBtn>
        </div>

        <div class="relative">
            <div class="mb-2 text-sm text-gray-500 required">Connection</div>
            <Connector
                v-model:data="connectorData"
                class="max-w-xs mb-6"
                :disabled="!policy?.isNew"
                @change="handleConnectorChange"
                @blur="
                    () => {
                        if (!connectorData.attributeValue)
                            rules.connection.show = true
                        else rules.connection.show = false
                    }
                "
                :ref="
                    (el) => {
                        connectorComponentRef = el
                    }
                "
            />
            <div
                class="absolute text-xs text-red-500 -bottom-5"
                v-if="rules.connection.show"
            >
                {{ rules.connection.text }}
            </div>
        </div>

        <div class="relative">
            <div class="flex items-center mb-2 gap-x-1">
                <AtlanIcon class="text-gray-500" icon="AssetsInactive" />
                <span class="text-sm text-gray-500 required">Assets</span>
            </div>
            <div
                class="
                    flex flex-wrap
                    items-center
                    flex-grow
                    gap-x-1 gap-y-1.5
                    mb-6
                "
            >
                <PillGroup
                    v-model:data="assets"
                    label-key="label"
                    @add="openAssetSelector"
                >
                    <template #addBtn="d">
                        <div>
                            <div
                                v-if="assets.length > 0 && !isreadOnlyPillGroup"
                            >
                                <Pill
                                    class="group"
                                    @click="d?.item?.handleAdd"
                                    @blur="d?.item?.handleBlur"
                                >
                                    <template #prefix>
                                        <AtlanIcon
                                            icon="Add"
                                            class="
                                                h-4
                                                -mx-1.5
                                                text-gray
                                                group-hover:text-white
                                            "
                                        />
                                    </template>
                                </Pill>
                            </div>
                            <div
                                v-else-if="assets.length === 0"
                                class="flex items-center"
                            >
                                <Pill
                                    class="group"
                                    @click="addConnectionAsset"
                                    @blur="d?.item?.handleBlur"
                                >
                                    <template #prefix>
                                        <div class="flex items-center">
                                            <AtlanIcon
                                                icon="Add"
                                                class="h-4 mr-1  text-gray group-hover:text-white"
                                            />
                                            <span class="text-xs">Add All</span>
                                        </div>
                                    </template>
                                </Pill>
                                <span class="mx-2 text-xs">OR</span>
                                <Pill
                                    class="group"
                                    @click="d?.item?.handleAdd"
                                    @blur="d?.item?.handleBlur"
                                >
                                    <template #prefix>
                                        <div class="flex items-center">
                                            <AtlanIcon
                                                icon="Add"
                                                class="h-4 mr-1  text-gray group-hover:text-white"
                                            />
                                            <span class="text-xs"
                                                >Custom select</span
                                            >
                                        </div>
                                    </template>
                                </Pill>
                            </div>
                        </div>
                    </template>
                </PillGroup>
            </div>
            <div
                class="absolute text-xs text-red-500 -bottom-5"
                v-if="rules.assets.show && connectorData.attributeValue"
            >
                {{ rules.assets.text }}
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
                style="width: 44px"
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
    import { computed, defineComponent, PropType, ref, toRefs } from 'vue'
    import AtlanBtn from '@/UI/button.vue'
    import PillGroup from '@/UI/pill/pillGroup.vue'
    import Pill from '@/UI/pill/pill.vue'
    import Connector from './connector.vue'
    import MetadataScopes from './metadataScopes.vue'
    import AssetSelectorDrawer from '../assets/assetSelectorDrawer.vue'
    import { useConnectionStore } from '~/store/connection'

    import { MetadataPolicies } from '~/types/accessPolicies/purposes'
    import { selectedPersonaDirty } from '../composables/useEditPersona'

    export default defineComponent({
        name: 'MetadataPolicy',
        components: {
            Pill,
            AtlanBtn,
            Connector,
            MetadataScopes,
            PillGroup,
            AssetSelectorDrawer,
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
            const connectionStore = useConnectionStore()

            const rules = ref({
                policyName: {
                    text: 'Enter a policy name!',
                    show: false,
                },
                connection: {
                    text: 'Connection is required!',
                    show: false,
                },
                assets: { text: 'Select atleast 1 asset!', show: false },
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

            function openAssetSelector() {
                if (!connectorData.value.attributeValue) {
                    connectorComponentRef.value?.treeSelectRef?.focus()
                } else {
                    assetSelectorVisible.value = true
                }
            }

            const assets = computed({
                get: () => {
                    if (policy.value.assets.length > 0)
                        rules.value.assets.show = false
                    else rules.value.assets.show = true
                    return policy.value.assets.map((name) => ({
                        label: name,
                    }))
                },
                set: (val) => {
                    policy.value.assets = val.map((ast) => ast.label)
                    if (val.length > 0) rules.value.assets.show = false
                    else rules.value.assets.show = true
                },
            })
            const handleConnectorChange = () => {
                policy.value.assets = []
            }
            const handleSave = () => {
                /* Validation for name */
                if (!policy.value.name) {
                    policyNameRef.value?.focus()
                    rules.value.policyName.show = true
                    return
                } /* Validation for connection */ else if (
                    !connectorData.value.attributeValue
                ) {
                    connectorComponentRef.value?.treeSelectRef?.focus()
                    rules.value.connection.show = true
                } else if (policy.value.assets.length < 1) {
                    rules.value.assets.show = true
                } else {
                    emit('save')
                }
            }
            const addConnectionAsset = () => {
                if (connectorData.value.attributeValue) {
                    assets.value = [
                        { label: connectorData.value.attributeValue },
                    ]
                    policy.value.assets = [connectorData.value.attributeValue]
                } else {
                    connectorComponentRef.value?.treeSelectRef?.focus()
                    rules.value.connection.show = true
                }
            }

            const connectorData = computed({
                get: () => {
                    const found = connectionStore.getList.find(
                        (conn) => conn.guid === policy.value.connectionId
                    )
                    return {
                        attributeName: found ? 'connectionQualifiedName' : '',
                        attributeValue: found?.attributes?.qualifiedName,
                    }
                },
                set: (val) => {
                    const found = connectionStore.getList.find(
                        (conn) =>
                            conn.attributes?.qualifiedName ===
                            val.attributeValue
                    )
                    policy.value.connectionId = found?.guid
                },
            })

            const isreadOnlyPillGroup = computed(() => {
                return Boolean(
                    assets.value.find(
                        (e) => e.label === connectorData.value.attributeValue
                    )
                )
            })
            return {
                isreadOnlyPillGroup,
                rules,
                handleSave,
                policyNameRef,
                handleConnectorChange,
                connectorComponentRef,
                connectorData,
                assetSelectorVisible,
                removePolicy,
                openAssetSelector,
                assets,
                addConnectionAsset,
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
