<template>
    <div
        class="relative bg-white border-b hover:bg-gray-100 container-policy-card"
    >
        <div
            class="flex items-center px-3 py-3 cursor-pointer card-policy"
            :class="selectedPolicy.id === policy.id ? '' : ''"
            @click="handleClickPlicyCard"
        >
            <div class="flex items-center flex-1">
                <div
                    v-if="type === 'meta'"
                    class="flex items-center justify-center mr-2 bg-gray-100 border border-gray-200 rounded-full w-9 h-9"
                >
                    <AtlanIcon v-if="type === 'meta'" icon="Policies" />
                </div>
                <div
                    v-if="type === 'data'"
                    class="flex items-center justify-center mr-2 bg-gray-100 border border-gray-200 rounded-full w-9 h-9"
                >
                    <AtlanIcon icon="QueryGrey" />
                </div>
                <div
                    v-if="type === 'glossaryPolicy'"
                    class="flex items-center justify-center mr-2 bg-gray-100 border border-gray-200 rounded-full w-9 h-9"
                >
                    <AtlanIcon icon="GlossaryGray" />
                </div>
                <div class="flex flex-col">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <div class="flex items-center">
                                <img
                                    v-if="type !== 'glossaryPolicy'"
                                    :src="`${getImage(
                                        connectionQfName?.split('/')[1]
                                    )}`"
                                    class="w-auto h-4 pr-1 rounded-tl rounded-bl"
                                />

                                <span v-if="type !== 'glossaryPolicy'"
                                    >{{ connectorName }}/{{
                                        connectionName
                                    }}</span
                                >
                                <span v-else>
                                    {{ policy?.name }}
                                </span>
                            </div>
                            <!-- <div v-if="policy.assets.length > 0">
                            <span class="text-gray-300 mx-1.5">•</span>
                            <span v-if="!isAddAll" class="flex-none text-sm">
                                {{ policy.assets.length }}
                                {{
                                    policy.assets.length > 1
                                        ? 'assets'
                                        : 'asset'
                                }}
                            </span>
                            <span v-if="isAddAll" class="flex-none text-sm">
                                All assets
                            </span>
                        </div> -->
                            <!-- <div v-if="permissions.length > 0 && type === 'meta'">
                            <span class="text-gray-300 mx-1.5">•</span>
                            <span class="flex-none text-sm">
                                {{ permissions.length }}
                                {{
                                    permissions.length > 1
                                        ? 'permissions'
                                        : 'permission'
                                }}
                            </span>
                        </div>
                        <div v-if="type === 'data'">
                            <span class="text-gray-300 mx-1.5">•</span>
                            <span class="flex-none text-sm">Query Access </span>
                        </div>
                        <div
                            v-if="
                                type === 'data' &&
                                policy?.type &&
                                policy?.type != 'null'
                            "
                        >
                            <span class="text-gray-300 mx-1.5">•</span>
                            <AtlanIcon
                                icon="Lock"
                                class="text-gray-300"
                            ></AtlanIcon>
                            <span v-if="maskComputed" class="flex-none text-sm">
                                {{ maskComputed }}
                            </span>
                        </div> -->
                        </div>
                        <!-- <span v-if="!policy.allow" class="mr-6 denied-policy-pill">
                        {{
                            type === 'meta'
                                ? 'Denied Permissions'
                                : 'Denied Query'
                        }}
                    </span> -->
                    </div>
                    <div class="flex items-center">
                        <span
                            v-if="type !== 'glossaryPolicy'"
                            class="text-gray-500"
                            >{{ policy?.name }}</span
                        >
                        <span
                            v-if="type !== 'glossaryPolicy'"
                            class="text-gray-300 mx-1.5"
                            >•</span
                        >
                        <span
                            class="ml-1 text-gray-500"
                            data-test-id="policy-type"
                            >{{
                                type === 'glossaryPolicy'
                                    ? 'Glossary Policy'
                                    : type === 'meta'
                                    ? 'Metadata Policy'
                                    : 'Data Policy'
                            }}</span
                        >
                    </div>
                </div>
            </div>
            <div class="flex items-center flex-1 pl-5">
                <div class="flex flex-1">
                    <a-tooltip v-if="type === 'glossaryPolicy'" placement="top">
                        <template #title>
                            <div>
                                {{ policy?.glossaryQualifiedNames.length }}
                                {{
                                    policy.glossaryQualifiedNames.length > 1
                                        ? 'glossaries'
                                        : 'glossary'
                                }}
                            </div>
                        </template>
                        <div class="flex items-center w-10">
                            <AtlanIcon icon="GlossaryGray" class="-mt-1" />
                            <div class="ml-1 font-semibold text-gray-500">
                                {{ policy?.glossaryQualifiedNames.length }}
                            </div>
                        </div>
                    </a-tooltip>
                    <a-tooltip v-if="type !== 'glossaryPolicy'" placement="top">
                        <template #title>
                            <div
                                v-if="
                                    policy.assets.length === 1 &&
                                    isAllAssets(policy.assets[0])
                                "
                            >
                                All Assets
                            </div>
                            <div v-else>
                                {{ policy.assets.length }}
                                {{
                                    policy.assets.length > 1
                                        ? 'assets'
                                        : 'asset'
                                }}
                            </div>
                        </template>
                        <div class="flex items-center w-10">
                            <AtlanIcon
                                icon="AssetsInactiveLight"
                                class="-mt-1"
                            />
                            <div
                                v-if="
                                    type !== 'glossaryPolicy' &&
                                    !isAllAssets(policy.assets[0])
                                "
                                class="ml-1 font-semibold text-gray-500"
                            >
                                {{ policy.assets.length }}
                            </div>
                            <div
                                v-else
                                class="ml-1 font-semibold text-gray-500"
                            >
                                All
                            </div>
                        </div>
                    </a-tooltip>
                    <span
                        v-if="permissions.length || maskComputed"
                        class="text-gray-300 mx-1.5"
                        >•</span
                    >
                    <a-tooltip v-if="permissions.length" placement="top">
                        <template #title>
                            <div v-if="permissions.length < 8">
                                {{ permissions.length }}
                                {{
                                    permissions.length > 1
                                        ? 'permissions'
                                        : 'permission'
                                }}
                            </div>
                            <div v-else>All permissions</div>
                        </template>
                        <div class="font-semibold text-gray-500">
                            <AtlanIcon
                                icon="ShieldBlank"
                                class="-mt-1 icon-gray"
                            />
                            {{
                                permissions.length >= 8
                                    ? 'All'
                                    : permissions.length
                            }}
                        </div>
                    </a-tooltip>
                    <a-tooltip v-if="maskComputed" placement="top">
                        <template #title>
                            {{ maskComputed }}
                        </template>
                        <div
                            class="font-semibold text-gray-500 truncate max-w-5"
                        >
                            <AtlanIcon icon="Number" class="-mt-1 icon-gray" />
                            {{ maskComputed }}
                        </div>
                    </a-tooltip>
                </div>
                <div class="relative flex flex-1">
                    <!-- canDelete -->
                    <!-- v-if="policy.allow" -->
                    <div class="flex-1">
                        <!-- <span v-if="policy.allow" class="text-gray-500">
                            <AtlanIcon class="text-gray-500" icon="Check" />
                            {{
                                type === 'meta'
                                    ? 'Permission Allowed'
                                    : 'Query Allowed'
                            }}
                        </span> -->
                        <span
                            v-if="!policy.allow"
                            class="text-sm text-red-500"
                            >{{
                                type === 'data'
                                    ? 'Denied Query'
                                    : 'Denied Permission'
                            }}</span
                        >
                    </div>
                    <div
                        class="items-center justify-end flex-1 gap-1 pr-3 default-s4"
                    >
                        <a-tooltip placement="top">
                            <template #title>
                                <div class="text-gray-300">Created by</div>
                                <div>
                                    {{ policy.createdBy }}
                                    {{ createdAtFormated }}
                                </div>
                            </template>
                            <AtlanBtn
                                class="px-2 bg-transparent border-none hover:bg-gray-200"
                                size="sm"
                                color="secondary"
                                data-test-id="policy-delete"
                                padding="compact"
                            >
                                <AtlanIcon icon="WarningIcon" />
                            </AtlanBtn>
                        </a-tooltip>
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
                                            @click="
                                                () => (visibleDelete = false)
                                            "
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
                                class="px-2 bg-transparent border-none hover:text-red-500 hover:bg-gray-200"
                                size="sm"
                                color="secondary"
                                data-test-id="policy-delete"
                                padding="compact"
                                @click.stop="() => (visibleDelete = true)"
                            >
                                <AtlanIcon icon="Delete" />
                            </AtlanBtn>
                        </a-popover>
                        <AtlanBtn
                            class="px-2 bg-transparent border-none"
                            size="sm"
                            color="secondary"
                            data-test-id="policy-delete"
                            padding="compact"
                        >
                            <AtlanIcon class="text-primary" icon="ArrowRight" />
                        </AtlanBtn>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, toRefs, ref } from 'vue'
    import { useTimeAgo } from '@vueuse/core'
    import PillGroup from '@/UI/pill/pillGroup.vue'
    import AtlanBtn from '@/UI/button.vue'
    import {
        DataPolicies,
        MetadataPolicies,
        glossaryQualifiedNames,
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
                type: Object as PropType<
                    DataPolicies & MetadataPolicies & glossaryQualifiedNames
                >,
                required: true,
            },
            type: {
                type: String as PropType<'meta' | 'data' | 'glossaryPolicy'>,
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
                () => findActions(policy.value.actions, 'persona'),
                type.value
            )
            const permissions = computed(() => {
                if (actions?.value?.length) {
                    const allPermissions = []
                    actions.value.forEach((action) => {
                        if (action?.action?.length)
                            action.action.forEach((a) => allPermissions.push(a))
                    })
                    return allPermissions
                }
                return []
            })
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
                if (policy.value?.assets?.length === 1) {
                    if (policy.value?.assets[0] === connectionQfName.value) {
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
            const canDelete = computed(() => {
                if (type.value === 'glossaryPolicy') return true
                return props.whitelistedConnectionIds.includes(
                    policy?.value?.connectionId
                )
            })
            const maskComputed = computed(
                () =>
                    maskPersona.find((el) => el.value === policy.value.type)
                        ?.label
            )
            const createdAtFormated = useTimeAgo(policy.value.createdAt)
            const isAllAssets = (name) => {
                const splited = name.split('/')
                if (splited && splited.length === 3) {
                    return true
                }
                return false
            }
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
                permissions,
                createdAtFormated,
                isAllAssets,
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
    .icon-gray {
        path {
            fill: #6f7590 !important;
        }
    }
</style>
<style lang="less" scoped>
    .wrapper-asset-permission {
        margin-right: 300px;
    }
    .icon-wrap {
        height: fit-content !important;
    }
    .container-policy-card {
        &:last-child {
            border-bottom-right-radius: 0.5rem;
            border-bottom-left-radius: 0.5rem;
        }
        .button-hide {
            opacity: 0;
            transition: all ease 0.3s;
        }
        .default-s3 {
            display: flex !important;
        }
        .default-s4 {
            display: none !important;
        }
        &:hover {
            .default-s3 {
                display: none !important;
            }
            .default-s4 {
                display: flex !important;
                position: absolute;
                right: 0;
                background: rgb(250, 250, 250);
                background: linear-gradient(
                    90deg,
                    rgba(250, 250, 250, 0.779171043417367) 9%,
                    rgba(250, 250, 250, 1) 18%
                );
                padding: 10px 0;
                width: 100%;
                top: 50%;
                transform: translateY(-50%);
            }
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
