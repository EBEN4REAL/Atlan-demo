<template>
    <div
        class="flex flex-col justify-between px-4 py-3 border rounded cursor-pointer persona-card hover:bg-gray-100"
        @click="$emit('select', persona)"
    >
        <div>
            <!-- header -->
            <div class="flex">
                <span class="font-base">{{ persona?.displayName }}</span>
            </div>
            <!-- body -->
            <div>
                <span class="text-gray-500">{{ persona?.description }}</span>
            </div>
        </div>
        <!-- footer -->
        <div class="flex items-center justify-between">
            <div class="flex items-center">
                <div class="flex items-center">
                    <AtlanIcon
                        icon="User"
                        class="w-3 h-3 mr-1 text-gray-400"
                    ></AtlanIcon>
                    <span class="text-xs text-gray-500">{{
                        persona.users.length
                    }}</span>
                </div>
                <div class="mx-2 bg-gray-300 dot"></div>
                <div class="flex items-center">
                    <AtlanIcon
                        icon="Policies"
                        class="w-3 h-3 mr-1 text-gray-400"
                    ></AtlanIcon>
                    <span class="text-xs text-gray-500">{{
                        persona.metadataPolicies?.length +
                        persona.dataPolicies?.length
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
            <div class="flex gap-x-1">
                <img
                    v-for="imgPath in getUniqueTypeIcons().connectors"
                    :key="imgPath"
                    :src="imgPath"
                    class="w-4 h-4"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, watch, onMounted, toRefs } from 'vue'
    import { storeToRefs } from 'pinia'
    import { useRoute, useRouter } from 'vue-router'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    export default defineComponent({
        name: 'PersonaCard',
        emits: ['select'],
        components: { AtlanIcon },
        props: {
            persona: {
                type: Object,
                required: true,
            },
        },
        setup(props) {
            const { persona } = toRefs(props)
            const { getConnectorImageMap } = useAssetInfo()

            const getUniqueTypeIcons = () => {
                const displayImages = {
                    connectors: new Set(),
                    icons: new Set(),
                }
                const metadataPolicies = persona.value?.metadataPolicies || []
                const dataPolicies = persona.value?.dataPolicies || []
                const policies = [...metadataPolicies, ...dataPolicies]
                policies
                    .map((policy) => policy.assets[0])
                    .forEach((asset) => {
                        console.log('rohan', asset)
                        if (asset.startsWith('default')) {
                            const connectorName = asset.split('/')[1]
                            const imgPath =
                                getConnectorImageMap.value[connectorName]
                            displayImages.connectors.add(imgPath)
                        }
                    })
                return displayImages
            }
            return {
                getUniqueTypeIcons,
            }
        },
    })
</script>
<style lang="less" scoped>
    .persona-card {
        width: 23%;
        height: 120px;
    }
    .dot {
        height: 4px;
        width: 4px;
        border-radius: 50%;
    }
</style>
