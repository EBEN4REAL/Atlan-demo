<template>
    <div>
        <div
            v-if="listSameAssets.count"
            class="flex items-center px-3 py-3 bg-primary-light"
        >
            <div class="px-1 rounded-full wrapper-icon-warning">
                <AtlanIcon
                    icon="WarningIcon"
                    class="icon-warning-same-assets"
                />
            </div>
            <div class="flex-1 ml-2 text-sm text-gray-700">
                There are {{ listSameAssets.count }} other policies for same
                assets
            </div>

            <a-popover
                trigger="click"
                placement="bottom"
                :align="{ offset: [115, 0] }"
                overlay-class-name="popover-same-assets"
            >
                <template #content>
                    <div
                        class="py-1 content-popover"
                        @mouseleave="handleMouseLeave"
                    >
                        <div
                            v-for="(persona, idx) in listSameAssets.result"
                            :key="persona.id"
                            class="flex items-center px-4 py-3 border-gray-200 cursor-pointer w-80 hover:bg-gray-100"
                            :class="`${
                                persona.id === personaSelected.id &&
                                'bg-gray-100'
                            } ${
                                idx !== listSameAssets.result.length - 1 &&
                                'border-b'
                            }`"
                            @click="handleClickPersona(persona)"
                            @mouseenter="handleClickPersona(persona)"
                        >
                            <div class="flex-1 mr-2">
                                <div
                                    class="text-base font-bold truncate text-primary"
                                >
                                    {{ persona.name }}
                                </div>
                                <div class="flex items-center mt-2">
                                    <div class="flex items-center">
                                        <AtlanIcon icon="User" class="mr-1" />
                                        <div class="mt-1 text-sm text-gray-500">
                                            {{ persona.users?.length || '-' }}
                                        </div>
                                    </div>
                                    <div class="flex items-center ml-4">
                                        <AtlanIcon
                                            icon="Group"
                                            class="mr-1 icon-group-same-asset"
                                        />
                                        <div class="mt-1 text-sm text-gray-500">
                                            {{ persona.groups?.length || '-' }}
                                        </div>
                                    </div>
                                    <div
                                        v-if="persona.dataPolicies?.length"
                                        class="flex items-center ml-4"
                                    >
                                        <AtlanIcon
                                            icon="QueryGrey"
                                            class="mr-1"
                                        />
                                        <div
                                            class="mt-1 text-sm text-gray-500"
                                        ></div>
                                        {{ persona.dataPolicies.length }}
                                    </div>
                                    <div
                                        v-if="persona.metadataPolicies?.length"
                                        class="flex items-center ml-4"
                                    >
                                        <AtlanIcon
                                            icon="Policies"
                                            class="mr-1 icon-gray"
                                        />
                                        <div class="mt-1 text-sm text-gray-500">
                                            {{
                                                persona.metadataPolicies.length
                                            }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <AtlanIcon icon="ChevronRight" />
                        </div>
                    </div>
                </template>
                <div class="ml-2 text-sm font-bold cursor-pointer text-primary">
                    View policies
                </div>
            </a-popover>
            <a-popover
                v-model:visible="visible"
                overlay-class-name="popover-same-assets"
                :align="{ offset: [-323, 138] }"
                trigger="click"
                placement="left"
            >
                <template #content>
                    <div
                        class="w-80"
                        @mouseleave="handleMouseLeave"
                        @mouseenter="handleEnterMouse"
                    >
                        <div class="p-4">
                            <div
                                class="text-base font-bold text-gray-700 truncate"
                            >
                                {{ personaSelected.name }}
                            </div>
                            <div class="flex mt-2 text-sm text-gray-500">
                                <AtlanIcon icon="DateTime" class="mr-1" />
                                Created by
                                <Avatar
                                    :image-url="
                                        imageUrl(personaSelected.createdBy)
                                    "
                                    :allow-upload="false"
                                    :avatar-name="personaSelected.createdBy"
                                    :avatar-size="16"
                                    :avatar-shape="'circle'"
                                    class="w-4 mx-1"
                                />
                                {{ personaSelected.createdBy }}
                                {{
                                    useTimeAgo(personaSelected.createdAt).value
                                }}
                            </div>
                        </div>
                        <div class="p-3 bg-gray-100 content-popover-policy">
                            <div
                                class="bg-white border border-gray-300 rounded"
                            >
                                <div
                                    v-for="meta in personaSelected.metadataPolicies"
                                    :key="meta.id"
                                    class="py-3.5 px-3 flex items-center"
                                >
                                    <div
                                        class="flex items-center justify-center w-8 h-8 rounded-full bg-primary-light"
                                    >
                                        <AtlanIcon icon="Policies" />
                                    </div>
                                    <div class="flex-1 ml-3">
                                        <div
                                            class="text-sm font-bold text-gray-700"
                                        >
                                            {{ meta.name }}
                                        </div>
                                        <div class="flex items-center mt-1">
                                            <a-tooltip placement="top">
                                                <template #title>
                                                    <div
                                                        v-if="
                                                            meta.assets
                                                                .length === 1 &&
                                                            isAllAssets(
                                                                meta.assets[0]
                                                            )
                                                        "
                                                    >
                                                        All Assets
                                                    </div>
                                                    <div v-else>
                                                        {{ meta.assets.length }}
                                                        {{
                                                            meta.assets.length >
                                                            1
                                                                ? 'assets'
                                                                : 'asset'
                                                        }}
                                                    </div>
                                                </template>
                                                <div class="flex items-center">
                                                    <AtlanIcon
                                                        icon="AssetsInactiveLight"
                                                        class="mr-1 icon-gray-stroke"
                                                    />
                                                    <div
                                                        class="mt-0.5 text-xs text-gray-500"
                                                    >
                                                        {{
                                                            isAllAssets(
                                                                meta.assets[0]
                                                            )
                                                                ? 'All'
                                                                : meta.assets
                                                                      .length
                                                        }}
                                                    </div>
                                                </div>
                                            </a-tooltip>
                                            <a-tooltip
                                                v-if="meta.actions"
                                                placement="top"
                                            >
                                                <template #title>
                                                    <div
                                                        v-if="
                                                            meta.actions
                                                                .length < 9
                                                        "
                                                    >
                                                        {{
                                                            meta.actions.length
                                                        }}
                                                        {{
                                                            meta.actions
                                                                .length > 1
                                                                ? 'permissions'
                                                                : 'permission'
                                                        }}
                                                    </div>
                                                    <div v-else>
                                                        All permissions
                                                    </div>
                                                </template>
                                                <div
                                                    v-if="meta.actions"
                                                    class="flex items-center ml-2 text-xs text-gray-500"
                                                >
                                                    <div
                                                        class="mr-1 text-gray-300"
                                                    >
                                                        •
                                                    </div>
                                                    <div
                                                        class="flex items-center"
                                                    >
                                                        <AtlanIcon
                                                            icon="ShieldBlank"
                                                            class="mr-1 icon-gray"
                                                        />
                                                        <div
                                                            class="text-xs text-gray-500 mt-0.5"
                                                        >
                                                            {{
                                                                meta.actions
                                                                    .length > 9
                                                                    ? 'All'
                                                                    : meta
                                                                          .actions
                                                                          .length
                                                            }}
                                                        </div>
                                                    </div>
                                                </div>
                                            </a-tooltip>

                                            <div
                                                v-if="!meta.allow"
                                                class="flex items-center ml-2 text-xs text-red-500"
                                            >
                                                <div class="mr-1 text-gray-300">
                                                    •
                                                </div>
                                                Denied Permission
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    v-for="data in personaSelected.dataPolicies"
                                    :key="data.id"
                                    class="py-3.5 px-3 flex items-center"
                                >
                                    <div
                                        class="flex items-center justify-center w-8 h-8 rounded-full bg-primary-light"
                                    >
                                        <AtlanIcon icon="QueryGrey" />
                                    </div>
                                    <div class="flex-1 ml-3">
                                        <div
                                            class="text-sm font-bold text-gray-700"
                                        >
                                            {{ data.name }}
                                        </div>
                                        <div class="flex items-center mt-1">
                                            <a-tooltip placement="top">
                                                <template #title>
                                                    <div
                                                        v-if="
                                                            data.assets
                                                                .length === 1 &&
                                                            isAllAssets(
                                                                data.assets[0]
                                                            )
                                                        "
                                                    >
                                                        All Assets
                                                    </div>
                                                    <div v-else>
                                                        {{ data.assets.length }}
                                                        {{
                                                            data.assets.length >
                                                            1
                                                                ? 'assets'
                                                                : 'asset'
                                                        }}
                                                    </div>
                                                </template>
                                                <div class="flex items-center">
                                                    <AtlanIcon
                                                        icon="AssetsInactiveLight"
                                                        class="mr-1"
                                                    />
                                                    <div
                                                        class="text-xs text-gray-500 mt-0.5"
                                                    >
                                                        {{
                                                            isAllAssets(
                                                                data.assets[0]
                                                            )
                                                                ? 'All'
                                                                : data.assets
                                                                      .length
                                                        }}
                                                    </div>
                                                </div>
                                            </a-tooltip>

                                            <div
                                                class="flex items-center ml-2 text-xs text-gray-500"
                                            >
                                                <div class="mr-1 text-gray-300">
                                                    •
                                                </div>
                                                <a-tooltip placement="top">
                                                    <template #title>
                                                        {{
                                                            maskLabel(data.type)
                                                        }}
                                                    </template>
                                                    <div
                                                        class="flex items-center"
                                                    >
                                                        <AtlanIcon
                                                            icon="Number"
                                                            class="mr-1"
                                                        />
                                                        <div
                                                            class="mt-0.5 text-xs text-gray-500"
                                                        >
                                                            {{
                                                                maskLabel(
                                                                    data.type
                                                                )
                                                            }}
                                                        </div>
                                                    </div>
                                                </a-tooltip>
                                            </div>
                                            <div
                                                v-if="!data.allow"
                                                class="flex items-center ml-2 text-xs text-red-500"
                                            >
                                                <div class="mr-1 text-gray-300">
                                                    •
                                                </div>
                                                Denied Query
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </a-popover>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, toRefs, computed, ref, watch } from 'vue'
    import { useTimeAgo } from '@vueuse/core'
    import { usePersonaStore } from '~/store/persona'
    import Avatar from '~/components/common/avatar/index.vue'
    import { maskPersona } from '~/constant/policy'

    export default defineComponent({
        name: 'SameAssetPolicy',
        components: { Avatar },
        props: {
            assets: {
                type: Array,
                default: () => [],
            },
            id: {
                type: String,
                default: () => '',
            },
            type: {
                type: String,
                default: () => '',
            },
        },
        emits: ['updateStatus'],
        setup(props) {
            const { assets, id, type } = toRefs(props)
            const refPopover = ref<any>(null)
            const visible = ref(false)
            const personaStore = usePersonaStore()
            const personaSelected = ref({})
            const checkAsset = (policyAsset: any) => {
                let result = false
                assets.value.forEach((assetValue: any) => {
                    policyAsset.forEach((policy) => {
                        const splittedPolicy = policy.split('/')
                        const formattedpolicy = assetValue
                            .split('/')
                            .slice(0, splittedPolicy.length)
                            .join('/')
                        if (policy === formattedpolicy) {
                            result = true
                        }
                    })
                })
                return result
            }
            const listSameAssets = computed(() => {
                const result: any = []
                let count = 0
                personaStore.list.forEach((el) => {
                    const policy = {
                        ...el,
                        metadataPolicies: [],
                        dataPolicies: [],
                    }

                    if (el.dataPolicies && type.value === 'data') {
                        el.dataPolicies.forEach((elc) => {
                            if (checkAsset(elc.assets) && elc.id !== id.value) {
                                policy.dataPolicies.push(elc)
                                count += 1
                            }
                        })
                    }
                    if (el.metadataPolicies && type.value === 'meta') {
                        el.metadataPolicies.forEach((elc) => {
                            if (checkAsset(elc.assets) && elc.id !== id.value) {
                                policy.metadataPolicies.push(elc)
                                count += 1
                            }
                        })
                    }

                    if (
                        policy.metadataPolicies.length ||
                        policy.dataPolicies.length
                    ) {
                        result.push(policy)
                    }
                })
                return { result, count }
            })
            watch(visible, () => {
                if (!visible.value) {
                    personaSelected.value = {}
                }
            })
            const handleClickPersona = (prop) => {
                clearTimeout(refPopover.value)
                personaSelected.value = prop
                visible.value = true
            }
            const imageUrl = (username: any) =>
                `${window.location.origin}/api/service/avatars/${username}`
            const isAllAssets = (name) => {
                const splited = name.split('/')
                if (splited && splited.length === 3) {
                    return true
                }
                return false
            }
            const maskLabel = (type) =>
                maskPersona.find((el) => el.value === type)?.label
            const handleMouseLeave = () => {
                refPopover.value = setTimeout(() => {
                    visible.value = false
                }, 300)
            }
            const handleEnterMouse = () => {
                clearTimeout(refPopover.value)
            }
            return {
                listSameAssets,
                visible,
                handleClickPersona,
                personaSelected,
                useTimeAgo,
                imageUrl,
                isAllAssets,
                maskLabel,
                handleMouseLeave,
                handleEnterMouse,
            }
        },
    })
</script>
<style lang="less">
    .icon-group-same-asset {
        transform: scale(1.1);
    }
    .icon-warning-same-assets {
        path {
            fill: white;
            stroke: #5277d7;
        }
    }
    .popover-same-assets {
        .content-popover-policy {
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px !important;
        }
        .ant-popover-inner {
            border-radius: 8px;
        }
    }
    .icon-gray {
        path {
            fill: #6f7590 !important;
        }
    }
    .icon-gray-stroke {
        path {
            stroke: #6f7590 !important;
        }
    }
</style>
<style lang="less" scoped>
    .content-popover-policy {
        height: 152px;
        overflow-y: scroll;
    }
    .content-popover {
        max-height: 240px;
        overflow-y: scroll;
    }
</style>
