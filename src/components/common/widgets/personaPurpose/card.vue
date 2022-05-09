<template>
    <div class="border border-gray-300 rounded-xl">
        <div class="flex h-12">
            <div
                v-if="connection.length"
                class="p-1 bg-gray-100 rounded-tl-xl rounded-br-xl"
            >
                <div class="flex p-1.5 bg-white rounded-tl-xl rounded-br-xl">
                    <div
                        v-for="imgPath in connection"
                        :key="imgPath"
                        class="p-1.5 rounded-full fit bg-white relative"
                    >
                        <img class="w-4 h-4" :src="imgPath" />
                    </div>
                </div>
            </div>
        </div>
        <div class="px-4 mt-3">
            <div class="w-40 text-base font-bold truncate text-primary">
                {{ item.name }}
            </div>
            <div class="w-40 h-16 mt-2 text-xs text-gray-600 line-clamp-2">
                {{ item.description || 'No description' }}
            </div>
        </div>
        <div class="flex items-center h-6 px-4">
            <Avatar
                v-for="(user, index) in users"
                :key="user"
                :avatar-size="24"
                :avatar-shape="'circle'"
                :style="{
                    'z-index': `${users.length - 1 - index}`,
                    transform: `translateX(-${index * 8}px)`,
                }"
            />
            <div
                v-if="item.users?.length > 3"
                class="flex items-center justify-center w-6 h-6 mt-1 text-xs text-gray-600 bg-gray-100 rounded-full"
                :style="{
                    'z-index': `4`,
                    transform: `translateX(-24px)`,
                }"
            >
                +{{ item.users?.length - 3 }}
            </div>
        </div>
        <div class="flex items-center px-4 py-3 mt-4 border-t border-gray-300">
            <div class="text-xs cursor-pointer text-primary">
                View from 1.2k assets
            </div>
            <AtlanIcon icon="ArrowRight" class="ml-2 text-primary" />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed, toRefs } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import Avatar from '~/components/common/avatar/index.vue'

    export default defineComponent({
        name: 'WidgetPersonaPurposeCard',
        components: { Avatar },

        props: {
            item: {
                type: Object,
                required: true,
            },
        },
        setup(props) {
            const { getConnectorImageMap } = useAssetInfo()
            const { item } = toRefs(props)
            const getUniqueTypeIcons = () => {
                const displayImages = {
                    connectors: [],
                    icons: new Set(),
                    count: 0,
                }
                const metadataPolicies = item.value?.metadataPolicies || []
                const dataPolicies = item.value?.dataPolicies || []
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
            const users = computed(() => item.value.users.slice(0, 3))
            const connection = computed(() => {
                // const glossary = item.value?.glossaryPolicies?.length || 0
                const lengthCoonection = 5
                return getUniqueTypeIcons().connectors.slice(
                    0,
                    lengthCoonection
                )
            })
            return {
                connection,
                users,
            }
        },
    })
</script>

<style lang="less" scoped></style>
