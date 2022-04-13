<template>
    <div>
        <div
            v-if="listSameAssets.count"
            class="flex items-center px-3 py-3 bg-primary-light"
        >
            <div class="px-1 rounded-full wrapper-icon-warning">
                <AtlanIcon icon="WarningIcon" />
            </div>
            <div class="flex-1 ml-2 text-sm text-gray-700">
                There are {{ listSameAssets.count }} other
                {{ listSameAssets.count > 1 ? 'policies' : 'policy' }} for same
                assets
            </div>

            <a-popover
                trigger="click"
                placement="bottom"
                :align="{ offset: [115, 0] }"
                overlay-class-name="popover-same-assets"
            >
                <template #content>
                    <div class="py-1 content-popover">
                        <div
                            class="flex items-center px-4 py-3 border-gray-200 w-80 hover:bg-gray-100"
                            v-for="(persona, idx) in listSameAssets.result"
                            :key="persona.id"
                            @click="handleClickPersona(persona)"
                            :class="`${
                                persona.id === personaSelected.id &&
                                'bg-gray-100'
                            } ${
                                idx !== listSameAssets.result.length - 1 &&
                                'border-b'
                            }`"
                        >
                            <div class="flex-1 mr-2">
                                <div
                                    class="text-base font-bold truncate text-primary"
                                >
                                    {{ persona.name }}
                                </div>
                                <div class="flex items-center mt-2">
                                    <div
                                        class="flex items-center text-sm text-gray-500"
                                    >
                                        <AtlanIcon icon="User" class="mr-1" />
                                        {{ persona.users?.length || '-' }}
                                    </div>
                                    <div
                                        class="flex items-center ml-4 text-sm text-gray-500"
                                    >
                                        <AtlanIcon icon="Group" class="mr-1" />
                                        {{ persona.groups?.length || '-' }}
                                    </div>
                                    <div
                                        class="flex items-center ml-4 text-sm text-gray-500"
                                        v-if="persona.dataPolicies?.length"
                                    >
                                        <AtlanIcon
                                            icon="QueryGrey"
                                            class="mr-1"
                                        />
                                        {{ persona.dataPolicies.length }}
                                    </div>
                                    <div
                                        class="flex items-center ml-4 text-sm text-gray-500"
                                        v-if="persona.metadataPolicies?.length"
                                    >
                                        <AtlanIcon
                                            icon="Policies"
                                            class="mr-1 icon-gray"
                                        />
                                        {{ persona.metadataPolicies.length }}
                                    </div>
                                </div>
                            </div>
                            <AtlanIcon icon="ChevronRight" />
                        </div>
                    </div>
                </template>
                <div class="ml-2 text-sm font-bold text-primary">
                    View policies
                </div>
            </a-popover>
            <a-popover
                overlay-class-name="popover-same-assets"
                :align="{ offset: [-320, 142] }"
                trigger="click"
                placement="left"
                v-model:visible="visible"
            >
                <template #content>
                    <div class="w-80 content-popover-policy">
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
                        <div class="p-3 bg-gray-100">
                            <div class="border border-gray-300 rounded">
                                <div
                                    class="py-3.5 px-3 flex items-center"
                                    v-for="meta in personaSelected.metadataPolicies"
                                    :key="meta.id"
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
                                            <div class="text-xs text-gray-500">
                                                <AtlanIcon
                                                    icon="AssetsInactiveLight"
                                                    class="icon-gray-stroke"
                                                />
                                                {{
                                                    isAllAssets(meta.assets[0])
                                                        ? 'All'
                                                        : meta.assets.length
                                                }}
                                            </div>
                                            <div
                                                v-if="meta.actions"
                                                class="flex items-center ml-2 text-xs text-gray-500"
                                            >
                                                <div class="mr-1 text-gray-300">
                                                    •
                                                </div>
                                                <AtlanIcon
                                                    icon="ShieldBlank"
                                                    class="mr-1 icon-gray"
                                                />
                                                {{
                                                    meta.actions.length > 9
                                                        ? 'All'
                                                        : meta.actions.length
                                                }}
                                            </div>
                                            <div
                                                v-if="!meta.allow"
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
                                <div
                                    class="py-3.5 px-3 flex items-center"
                                    v-for="data in personaSelected.dataPolicies"
                                    :key="data.id"
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
                                            <div class="text-xs text-gray-500">
                                                <AtlanIcon
                                                    icon="AssetsInactiveLight"
                                                    class="mt-1"
                                                />
                                                {{
                                                    isAllAssets(data.assets[0])
                                                        ? 'All'
                                                        : data.assets.length
                                                }}
                                            </div>
                                            <div
                                                class="flex items-center ml-2 text-xs text-gray-500"
                                            >
                                                <div class="mr-1 text-gray-300">
                                                    •
                                                </div>
                                                <AtlanIcon icon="Number" />
                                                {{ maskLabel(data.type) }}
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
    import { usePersonaStore } from '~/store/persona'
    import { useTimeAgo } from '@vueuse/core'
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
            const visible = ref(false)
            const personaStore = usePersonaStore()
            const personaSelected = ref({})
            const checkAsset = (policyAsset: any) => {
                let result = false
                assets.value.forEach((el) => {
                    if (policyAsset.includes(el)) {
                        result = true
                    }
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

            return {
                listSameAssets,
                visible,
                handleClickPersona,
                personaSelected,
                useTimeAgo,
                imageUrl,
                isAllAssets,
                maskLabel,
            }
        },
    })
</script>
<style lang="less">
    .popover-same-assets {
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
        height: 250px;
        overflow-y: scroll;
    }
    .content-popover {
        max-height: 240px;
        overflow-y: scroll;
    }
</style>
