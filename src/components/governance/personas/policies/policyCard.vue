<template>
    <div
        class="relative bg-white border border-gray-300 rounded container-policy-card"
    >
        <div
            class="flex flex-col px-3 py-3 rounded cursor-pointer group hover:bg-gray-100 card-policy"
            :class="selectedPolicy.id === policy.id ? 'outline-primary' : ''"
            @click="handleClickPlicyCard"
        >
            <div class="flex items-center mb-1">
                <AtlanIcon
                    v-if="type === 'meta'"
                    icon="Policies"
                    class="-mt-1"
                />
                <AtlanIcon
                    v-if="type === 'data'"
                    icon="QueryGrey"
                    class="-mt-1"
                />
                <span class="ml-1 text-gray-500" data-test-id="policy-type">{{
                    type === 'meta' ? 'Metadata Policy' : 'Data Policy'
                }}</span>
                <span class="mx-1 text-gray-500">/</span>
                <span class="text-gray-500">{{ policy?.name }}</span>
                <div class=""></div>
            </div>
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <div class="flex items-center">
                        <img
                            :src="getImage(connectionQfName?.split('/')[1])"
                            class="w-auto h-4 pr-1 rounded-tl rounded-bl"
                        />
                        <span>{{ connectorName }}/{{ connectionName }}</span>
                    </div>
                    <div v-if="policy.assets.length > 0">
                        <span class="text-gray-300 mx-1.5">•</span>
                        <span v-if="!isAddAll" class="flex-none text-sm">
                            {{ policy.assets.length }}
                            {{ policy.assets.length > 1 ? 'assets' : 'asset' }}
                        </span>
                        <span v-if="isAddAll" class="flex-none text-sm">
                            All assets
                        </span>
                    </div>
                    <div v-if="policy.actions.length > 0 && type === 'meta'">
                        <span class="text-gray-300 mx-1.5">•</span>
                        <span class="flex-none text-sm">
                            {{ policy.actions.length }}
                            {{
                                policy.actions.length > 1
                                    ? 'permissions'
                                    : 'permission'
                            }}
                        </span>
                    </div>
                    <div v-if="type === 'data'">
                        <span class="text-gray-300 mx-1.5">•</span>
                        <span class="flex-none text-sm"> Query Access </span>
                    </div>
                    <div
                        v-if="
                            type === 'data' &&
                            policy?.type &&
                            policy?.type != 'null'
                        "
                    >
                        <span class="text-gray-300 mx-1.5">•</span>
                        <!-- <AtlanIcon
                            icon="Lock"
                            class="text-gray-300"
                        ></AtlanIcon> -->
                        <span v-if="maskComputed" class="flex-none text-sm">
                            {{ maskComputed }}
                        </span>
                    </div>
                </div>
                <span v-if="!policy.allow" class="mr-6 denied-policy-pill">
                    {{
                        type === 'meta' ? 'Denied Permissions' : 'Denied Query'
                    }}
                </span>
            </div>
        </div>

        <a-popover
            v-if="canDelete"
            v-model:visible="visibleDelete"
            trigger="click"
            placement="topRight"
            @onMouseleave="() => (visibleDelete = false)"
        >
            <template #content>
                <div class="popover-delete">
                    <span>
                        Are you sure you want to delete
                        <strong>{{ policy?.name }}</strong> ?
                    </span>
                    <div class="btn-wrapper">
                        <AtlanBtn
                            padding="compact"
                            color="minimal"
                            data-test-id="cancel"
                            class="btn-asset"
                            size="sm"
                            @click="() => (visibleDelete = false)"
                        >
                            Cancel
                        </AtlanBtn>
                        <AtlanBtn
                            padding="compact"
                            data-test-id="save"
                            class="btn-asset"
                            size="sm"
                            color="danger"
                            @click="removePolicy"
                        >
                            Delete
                        </AtlanBtn>
                    </div>
                </div>
            </template>
            <AtlanBtn
                class="absolute flex-none px-2 border-r border-gray-300 border-none right-2 bottom-2 hover:text-red-500 button-hide"
                size="sm"
                color="secondary"
                data-test-id="policy-delete"
                padding="compact"
                @click="() => (visibleDelete = true)"
            >
                <AtlanIcon icon="Delete" class="" />
            </AtlanBtn>
        </a-popover>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, toRefs, ref } from 'vue'
    import PillGroup from '@/UI/pill/pillGroup.vue'
    import AtlanBtn from '@/UI/button.vue'
    import {
        DataPolicies,
        MetadataPolicies,
    } from '~/types/accessPolicies/personas'
    import { useConnectionStore } from '~/store/connection'
    import { useUtils } from '../assets/useUtils'
    import useScopeService from '../composables/useScopeService'
    import { splitArray } from '~/utils/string'
    import { maskPersona } from '~/constant/policy'

    export default defineComponent({
        name: 'DataPolicy',
        components: {
            AtlanBtn,
            PillGroup,
        },
        props: {
            policy: {
                type: Object as PropType<DataPolicies & MetadataPolicies>,
                required: true,
            },
            type: {
                type: String as PropType<'meta' | 'data'>,
                required: true,
            },
            selectedPolicy: {
                type: Object as PropType<DataPolicies & MetadataPolicies>,
                required: true,
            },
            whitelistedConnectionIds: {
                type: Array,
                default: () => [],
            },
        },
        emits: ['edit', 'cancel', 'delete', 'clickCard'],
        setup(props, { emit }) {
            const visibleDelete = ref(false)
            const { policy, type } = toRefs(props)
            const { findActions } = useScopeService()
            const { getAssetIcon } = useUtils()
            const showAll = ref(false)
            const assets = computed(() =>
                policy.value.assets.map((name) => ({
                    label:
                        name.split('/').length > 3
                            ? name.split('/').slice(3).join('/')
                            : name.split('/').slice(2).join('/'),
                }))
            )
            const splitAssets = computed(() => splitArray(3, assets.value))
            const assetsIcons = computed(() =>
                policy.value?.assets?.map((name) => getAssetIcon(name))
            )
            const actions = computed(
                () => findActions(policy.value.actions),
                type.value
            )

            const connStore = useConnectionStore()
            const getImage = (id: string) => connStore.getImage(id)
            const removePolicy = () => {
                /* Delete when the policy is saved */
                visibleDelete.value = false
                if (!policy.value?.isNew) emit('delete')
                emit('cancel')
            }
            const connectionQfName = computed(() => {
                const found = connStore.getList.find(
                    (conn) => conn.guid === policy.value.connectionId
                )
                return found?.attributes?.qualifiedName
            })

            const isAddAll = computed(() => {
                if (policy.value.assets.length === 1) {
                    if (policy.value.assets[0] === connectionQfName.value) {
                        return true
                    }
                }
                return false
            })

            const connectionName = computed(() => {
                const found = connStore.getList.find(
                    (conn) => conn.guid === policy.value.connectionId
                )
                return found?.attributes?.name || ''
            })

            const connectorName = computed(() => {
                const found = connStore.getList.find(
                    (conn) => conn.guid === policy.value.connectionId
                )

                return found?.attributes?.connectorName || ''
            })
            const getPopoverContent = (policy: any) =>
                `Are you sure you want to delete ${policy?.name}?`
            const handleClickPlicyCard = () => {
                emit('clickCard', { ...policy.value }, type.value)
            }
            const canDelete = computed(() =>
                props.whitelistedConnectionIds.includes(
                    policy?.value?.connectionId
                )
            )
            const maskComputed = computed(
                () =>
                    maskPersona.find((el) => el.value === policy.value.type)
                        ?.label
            )
            return {
                getPopoverContent,
                removePolicy,
                assets,
                getImage,
                actions,
                connectionQfName,
                connectionName,
                connectorName,
                assetsIcons,
                showAll,
                splitAssets,
                handleClickPlicyCard,
                canDelete,
                visibleDelete,
                isAddAll,
                maskComputed,
            }
        },
    })
</script>

<style lang="less">
    .allow-icon {
        path {
            fill: #00a680 !important;
        }
    }
</style>
<style lang="less" scoped>
    .container-policy-card {
        .button-hide {
            opacity: 0;
            transition: all ease 0.3s;
        }
        &:hover {
            .button-hide {
                opacity: 1;
                background-color: transparent !important;
            }
        }
    }
    .dot {
        height: 4px;
        width: 4px;
        background-color: #e6e6eb;
        border-radius: 50%;
    }
    .data-policy-pill {
        @apply rounded-full text-xs px-2 py-1;
        background-color: #eeffef;
        color: #00a680;
    }
    .metadata-policy-pill {
        @apply rounded-full text-xs px-2 py-1;
        background-color: #fcf3fc;
        color: #d452d7;
    }
    .denied-policy-pill {
        @apply rounded-full text-xs px-2 py-1;
        background-color: #fdf5f1;
        color: #e04f1a;
    }
    .card {
        box-shadow: 1px 2px 3px 3px rgba(0, 0, 0, 0.05);
    }
    .popover-delete {
        padding: 20px;
        max-width: 350px;
    }
    .btn-wrapper {
        display: flex;
        justify-content: flex-end;
        margin-top: 15px;
    }
</style>
