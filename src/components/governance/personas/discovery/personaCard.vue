<template>
    <div
        class="flex flex-col justify-between p-3 border rounded-lg cursor-pointer persona-card hover:border-primary"
        @click="$emit('select', persona)"
    >
        <div>
            <!-- header -->
            <div class="flex">
                <span
                    class="mb-0 font-bold cursor-pointer ant-typography ant-typography-ellipsis ant-typography-single-line text-md text-primary hover:underline"
                    >{{ persona?.displayName }}</span
                >
            </div>
            <!-- body -->
            <div class="h-8 mt-1">
                <span class="text-gray-500 line-clamp-2">{{
                    persona?.description || 'No description'
                }}</span>
            </div>
        </div>
        <!-- footer -->
        <div class="flex items-center justify-between mt-3">
            <div class="flex items-center">
                <div class="flex items-center">
                    <AtlanIcon
                        icon="User"
                        class="w-3 h-3 mr-1 text-gray-400 mb-0.5"
                    ></AtlanIcon>
                    <span class="text-xs text-gray-500">{{
                        persona.users.length + persona.groups.length || '-'
                    }}</span>
                </div>
                <div class="mx-2 bg-gray-300 dot"></div>
                <div class="flex items-center">
                    <AtlanIcon
                        icon="Policies"
                        class="w-3 h-3 mr-1 text-gray-400 mb-0.5"
                    ></AtlanIcon>
                    <span class="text-xs text-gray-500">{{
                        persona.metadataPolicies?.length +
                            persona.dataPolicies?.length +
                            (persona.glossaryPolicies?.length || 0) || '-'
                    }}</span>
                </div>
                <!-- <div class="mx-2 bg-gray-300 dot"></div>
                <div class="flex items-center">
                    <AtlanIcon
                        icon="Query"
                        class="w-3 h-3 mr-1 text-gray-400"
                    ></AtlanIcon>
                    <span class="text-xs text-gray-500">{{
                        persona.dataPolicies?.length
                    }}</span>
                </div> -->
            </div>
            <div class="flex items-center">
                <div
                    v-if="persona.glossaryPolicies?.length || 0"
                    class="px-1.5 py-1 rounded-full border border-gray-200 fit bg-white relative"
                    :style="{
                        'z-index': `${connection.length}`,
                        transform: `translateX(${connection.length * 8}px)`,
                    }"
                >
                    <AtlanIcon icon="Glossary" class="w-4 h-4" />
                </div>
                <div
                    v-for="(imgPath, index) in connection"
                    :key="imgPath"
                    class="p-1.5 rounded-full border border-gray-200 fit bg-white relative"
                    :style="{
                        'z-index': `${connection.length - 1 - index}`,
                        transform: `translateX(${
                            (connection.length - 1 - index) * 8
                        }px)`,
                    }"
                >
                    <img class="w-4 h-4" :src="imgPath" />
                </div>
                <div
                    v-if="
                        getUniqueTypeIcons().connectors.length >
                        connection.length
                    "
                    class="mt-1 text-xs text-gray-500"
                >
                    +{{
                        getUniqueTypeIcons().connectors.length -
                        connection.length
                    }}
                </div>
            </div>
        </div>
        <div
            class="flex items-center justify-between pt-2 mt-3 border-t border-gray-200"
        >
            <div class="text-xs text-gray-500">Updated {{ lastUpdate }}</div>
            <!-- <div
                :class="`p-1 text-xs rounded tag ${
                    persona.enabled
                        ? 'enabled-tag'
                        : 'disabled-tag text-gray-500'
                } `"
            >
                {{ persona.enabled ? 'Enabled' : 'Disabled' }}
            </div> -->
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed, toRefs } from 'vue'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { useTimeAgo } from '@vueuse/core'
    export default defineComponent({
        name: 'PersonaCard',
        components: { AtlanIcon },
        props: {
            persona: {
                type: Object,
                required: true,
            },
        },
        emits: ['select'],

        setup(props) {
            const { persona } = toRefs(props)
            const { getConnectorImageMap } = useAssetInfo()
            const lastUpdate = computed(() => {
                return useTimeAgo(
                    persona.value.updatedAt || persona.value.createdAt
                ).value
            })

            const getUniqueTypeIcons = () => {
                const displayImages = {
                    connectors: [],
                    icons: new Set(),
                    count: 0,
                }
                const metadataPolicies = persona.value?.metadataPolicies || []
                const dataPolicies = persona.value?.dataPolicies || []
                const policies = [...metadataPolicies, ...dataPolicies]
                policies
                    .map((policy) => policy.assets[0])
                    .forEach((asset) => {
                        if (asset.startsWith('default')) {
                            const connectorName = asset.split('/')[1]
                            const imgPath =
                                getConnectorImageMap.value[connectorName]
                            displayImages.connectors.push(imgPath)
                        }
                    })
                return {
                    ...displayImages,
                    connectors: [...new Set(displayImages.connectors)],
                }
            }
            const connection = computed(() => {
                const glossary = persona.value?.glossaryPolicies?.length || 0
                const lengthCoonection = glossary ? 2 : 3
                return getUniqueTypeIcons().connectors.slice(
                    0,
                    lengthCoonection
                )
            })
            return {
                getUniqueTypeIcons,
                lastUpdate,
                connection,
            }
        },
    })
</script>
<style lang="less">
    .fit {
        height: fit-content;
    }
</style>
<style lang="less" scoped>
    .persona-card {
        box-shadow: 0px 1px 0px 0px #0000000d;

        // height: 120px;
        &:hover {
            box-shadow: 0px 2px 8px 0px #0000001a;
        }
    }
    .dot {
        height: 4px;
        width: 4px;
        border-radius: 50%;
    }
    .enabled-tag {
        border: 1px solid #0080624d;
        background: #e3fdf7;
        color: #008062;
    }
    .tag {
        height: fit-content;
        line-height: 10px !important;
    }
    .disabled-tag {
        height: fit-content;
        border: 1px solid #e0e4eb;
        background: #f6f7f9;
    }
</style>
