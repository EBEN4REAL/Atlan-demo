<template>
    <div
        class="relative bg-white border border-gray-300 rounded container-policy-card"
    >
        <div
            class="flex flex-col px-3 py-2 rounded cursor-pointer group hover:bg-gray-100 card-policy"
            :class="selectedPolicy.id === policy.id ? 'outline-primary' : ''"
            @click="handleClickPlicyCard"
        >
            <div class="flex items-center justify-between mb-1">
                <div class="flex items-center gap-x-3">
                    <div class="flex items-center">
                        <img
                            :src="getImage(connectionQfName?.split('/')[1])"
                            class="w-auto h-6 p-1 rounded-tl rounded-bl"
                        />
                        <span>{{ connectorName }}/{{ connectionName }}</span>
                    </div>
                    <div v-if="policy.assets.length > 0">
                        <AtlanIcon icon="Compass" class="mr-1" />
                        <span class="flex-none text-sm">
                            {{ policy.assets.length }}
                            {{ policy.assets.length > 1 ? 'assets' : 'asset' }}
                        </span>
                    </div>
                </div>
                <span v-if="!policy.allow" class="denied-policy-pill">
                    {{
                        type === 'meta' ? 'Denied Permissions' : 'Denied Query'
                    }}
                </span>
            </div>
            <div class="flex gap-x-3">
                <div class="text-gray-500">
                    <AtlanIcon
                        icon="Settings"
                        v-if="type === 'meta'"
                        class="-mt-0.5"
                    />
                    <AtlanIcon
                        icon="QueryGrey"
                        v-if="type === 'data'"
                        class="-mt-0.5"
                    />
                    <span class="ml-1" data-test-id="policy-type">{{
                        type === 'meta' ? 'Metadata Policy' : 'Data Policy'
                    }}</span>
                    ({{ policy?.name }})
                </div>
                <div>
                    {{ policy.createdBy }}
                </div>
            </div>
        </div>

        <a-popover
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
        <!-- <a-popconfirm
            v-if="canDelete"
            placement="leftTop"
            :title="getPopoverContent(policy)"
            ok-text="Yes"
            :ok-type="'default'"
            overlay-class-name="popoverConfirm"
            cancel-text="Cancel"
            @confirm="removePolicy"
        >
            <AtlanBtn
                class="absolute flex-none px-2 border-r border-gray-300 border-none right-2 bottom-2 hover:text-red-500 button-hide"
                size="sm"
                color="secondary"
                data-test-id="policy-delete"
                padding="compact"
            >
                <AtlanIcon icon="Delete" class="" />
            </AtlanBtn>
        </a-popconfirm> -->
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
            const { policy, type, width } = toRefs(props)
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
                emit('clickCard', { ...policy.value, type: type.value })
            }
            const canDelete = computed(() =>
                props.whitelistedConnectionIds.includes(
                    policy?.value?.connectionId
                )
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
    .card-policy {
        min-height: 70px;
    }
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
