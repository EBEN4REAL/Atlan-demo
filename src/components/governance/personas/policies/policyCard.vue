<template>
    <div
        class="relative pt-1 pb-1 mb-2 border-b border-gray-300 container-policy-card last:border-0"
    >
        <div
            class="flex flex-col p-3 text-gray-500 rounded cursor-pointer group hover:bg-primary-light card-policy"
            :class="
                selectedPolicy.id === policy.id
                    ? 'outline-primary bg-primary-light'
                    : ''
            "
            @click="handleClickPlicyCard"
        >
            <div class="flex items-center gap-x-3">
                <span
                    class="text-base font-bold text-gray"
                    data-test-id="policy-name"
                    >{{ policy.name }}</span
                >
                <AtlanIcon
                    icon="ShieldBlank"
                    :class="policy.allow ? 'allow-icon' : ''"
                />
                <!-- <div class="flex items-center border rounded bg-gray-light">
                    <img
                        :src="getImage(connectionQfName?.split('/')[1])"
                        class="w-auto h-6 p-1 bg-white rounded-tl rounded-bl"
                    />
                    <span class="px-1 text-sm text-gray-700">
                        {{ connectionQfName?.split('/')?.slice(-1)[0] }}
                    </span>
                </div> -->
                <span v-if="!policy.allow" class="denied-policy-pill">
                    {{
                        type === 'meta' ? 'Denied Permissions' : 'Denied Query'
                    }}
                </span>
                <!-- <span
                    v-if="type === 'data'"
                    class="ml-auto data-policy-pill"
                    data-test-id="policy-type"
                    >Data Policy</span
                > -->
                <span
                    class="p-1 ml-auto text-xs bg-gray-200 rounded"
                    data-test-id="policy-type"
                    >{{
                        type === 'meta' ? 'Metadata Policy' : 'Data Policy'
                    }}</span
                >
            </div>
            <!-- <span class="flex-none text-sm" v-if="policy.assets.length > 0">
                    <b class="text-gray-700">{{ policy.assets.length }}</b> assets
                    selected
                </span> -->
            <!-- <span class="flex-none text-sm" v-else> No assets selected </span> -->
            <!-- <div
                    v-if="type === 'meta'"
                    class="flex items-center overflow-hidden gap-x-1"
                >
                    <AtlanIcon class="flex-none -mt-1 text-gray-500" icon="Lock" />
                    <div class="flex items-center">
                        <div
                            class="flex items-center"
                            v-if="actions[0].action.length > 0"
                        >
                            <span>{{ actions[0].label }}: &nbsp;</span>
                            <span>{{ actions[0].action.join(', ') }}</span>
                        </div>
                        <div
                            class="w-1 h-1 mx-1 bg-gray-300 rounded-full"
                            v-if="actions[1].action.length > 0"
                        ></div>
                        <div
                            class="flex items-center"
                            v-if="actions[1].action.length > 0"
                        >
                            <span>{{ actions[1].label }}: &nbsp;</span>
                            <span>{{ actions[1].action.join(', ') }}</span>
                        </div>
                        <div
                            class="w-1 h-1 mx-1 bg-gray-300 rounded-full"
                            v-if="actions[1].action.length > 0"
                        ></div>
                        <div
                            class="flex items-center mr-1.5"
                            v-if="actions[2].action.length > 0"
                        >
                            <span>{{ actions[2].label }}: &nbsp;</span>
                            <span>{{ actions[2].action.join(', ') }}</span>
                        </div>
                    </div>
                </div> -->
            <!-- <div
                    v-if="type === 'data' && policy.maskType !== 'null'"
                    class="flex items-center overflow-hidden gap-x-1"
                >
                    <AtlanIcon
                        class="flex-none -mt-1.5 text-gray-500"
                        icon="Hash"
                    />
                    <div class="flex items-center mt-0.5">
                        <span>{{ policy.maskType }}</span>
                    </div>
                </div> -->
            <div class="flex flex-wrap items-center gap-y-1.5">
                <div
                    class="flex items-center gap-y-1.5 gap-x-1 flex-1 flex-wrap"
                >
                    <div class="flex items-center">
                        <img
                            :src="getImage(connectionQfName?.split('/')[1])"
                            class="w-auto h-6 p-1 rounded-tl rounded-bl"
                        />
                        <span class="px-1 text-sm text-gray-700">
                            {{ connectionQfName?.split('/')?.slice(-1)[0] }}
                        </span>
                    </div>
                    <template v-if="policy.assets.length > 0">
                        <div v-if="connectionQfName" class="dot" />
                        <AtlanIcon icon="Compass" />
                        <span class="flex-none text-sm">
                            {{ policy.assets.length }}
                            {{ policy.assets.length > 1 ? 'assets' : 'asset' }}
                        </span>
                    </template>
                    <!-- <template v-for="item in splitAssets.a" :key="item.label">
                        <div
                            class="flex items-center justify-center px-3 text-sm text-gray-700"
                            style="padding-top: 4px; padding-bottom: 4px"
                        >
                            {{ item.label }}
                        </div>
                    </template>
                    <template v-for="item in splitAssets.b" :key="item.label">
                        <div
                            v-if="showAll"
                            class="flex items-center justify-center px-3 text-sm text-gray-700 border border-gray-300 rounded-full"
                            style="padding-top: 4px; padding-bottom: 4px"
                        >
                            {{ item.label }}
                        </div>
                    </template> -->
                    <!-- <div
                        class="font-bold text-gray-500 cursor-pointer"
                        @click="
                            () => {
                                showAll = !showAll
                            }
                        "
                    >
                        <span v-if="!showAll && splitAssets.b.length > 0"
                            >Show {{ splitAssets.b.length }} more</span
                        >
                        <span v-else-if="showAll">Show less</span>
                    </div> -->
                </div>
                <!-- <div
                    class="flex items-stretch border border-gray-300 rounded opacity-0 group-hover:opacity-100 text-gray hover:text-primary"
                >
                    <AtlanBtn
                        class="flex-none px-2 border-l border-gray-300 border-none hover:text-primary"
                        size="sm"
                        color="secondary"
                        padding="compact"
                        @click.prevent="$emit('edit')"
                        data-test-id="policy-edit"
                    >
                        <AtlanIcon icon="Pencil" class="" />
                    </AtlanBtn>
                    <div
                        class="h-full bg-gray-300"
                        style="width: 1px; height: 30px !important"
                    ></div>
    
                </div> -->
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
