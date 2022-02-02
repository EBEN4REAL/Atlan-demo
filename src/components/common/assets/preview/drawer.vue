<template>
    <teleport to="#overAssetSidebar">
        <a-drawer
            v-if="visible"
            :key="data?.guid"
            v-model:visible="visible"
            placement="right"
            :get-container="false"
            :class="$style.drawerStyles"
            :closable="false"
            :mask-closable="showMask"
            :style="{ position: 'absolute' }"
            :width="420"
            :mask="showMask"
            @close="$emit('closeDrawer')"
        >
            <div
                v-if="showCloseBtn && visible"
                class="close-btn"
                @click="() => $emit('closeDrawer')"
            >
                <AtlanIcon icon="Add" class="text-white" />
            </div>
            <AssetPreview
                :selected-asset="drawerData"
                :is-drawer="true"
                :drawer-active-key="drawerActiveKey"
                @closeDrawer="$emit('closeDrawer')"
            ></AssetPreview> </a-drawer
    ></teleport>
</template>

<script lang="ts">
    import { defineComponent, ref, watch, toRefs, provide, computed } from 'vue'
    import AssetPreview from '@/common/assets/preview/index.vue'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
    import {
        AssetAttributes,
        InternalAttributes,
        SQLAttributes,
        GlossaryAttributes,
        AssetRelationAttributes,
    } from '~/constant/projection'
    import useTypedefData from '~/composables/typedefs/useTypedefData'

    export default defineComponent({
        components: {
            AssetPreview,
        },
        props: {
            data: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            showDrawer: {
                type: Boolean,
                required: false,
                default: true,
            },
            showMask: {
                type: Boolean,
                required: false,
                default: true,
            },
            drawerActiveKey: {
                type: String,
                required: false,
                default: 'Overview',
            },
            showCloseBtn: {
                type: Boolean,
                required: false,
                default: false,
            },
            guid: {
                type: String,
                required: false,
                default: '',
            },
            qualifiedName: {
                type: String,
                required: false,
                default: '',
            },
        },
        emits: ['closeDrawer', 'update'],

        setup(props, { emit }) {
            const { showDrawer, guid, qualifiedName, data } = toRefs(props)

            const visible = ref(false)
            const drawerData = ref(data.value)

            const updateDrawerList = (asset) => {
                emit('update', asset)
            }

            provide('updateDrawerList', updateDrawerList)

            const limit = ref(1)
            const offset = ref(0)
            const facets = computed(() => {
                if (guid.value !== '') {
                    return { guid: guid.value }
                }
                return { qualifiedName: qualifiedName.value }
            })

            const dependentKey = ref(null)

            const { customMetadataProjections } = useTypedefData()

            const defaultAttributes = ref([
                ...InternalAttributes,
                ...AssetAttributes,
                ...SQLAttributes,
                ...GlossaryAttributes,
                ...customMetadataProjections,
            ])
            const relationAttributes = ref([...AssetRelationAttributes])

            const { list, fetch } = useDiscoverList({
                isCache: false,
                dependentKey,
                facets,
                limit,
                offset,
                attributes: defaultAttributes,
                relationAttributes,
            })

            watch(showDrawer, () => {
                if (
                    (guid.value !== '' || qualifiedName.value !== '') &&
                    showDrawer.value
                ) {
                    fetch()
                } else {
                    visible.value = showDrawer.value
                }
            })

            watch(list, () => {
                if (list.value.length > 0) {
                    drawerData.value = list.value[0]
                    visible.value = true
                }
            })

            watch(data, () => {
                drawerData.value = data.value
            })

            return { visible, drawerData }
        },
    })
</script>

<style lang="less" module>
    .drawerStyles {
        :global(.ant-drawer-body) {
            @apply h-full !important;
            width: 420px;
        }
        :global(.ant-drawer-content-wrapper) {
            width: 420px;
        }
    }
</style>

<style lang="less" scoped>
    .close-btn {
        height: 32px;
        width: 32px;
        background: #3e4359cc;
        position: fixed;
        border-radius: 50%;
        display: grid;
        place-items: center;
        transform: rotate(45deg);
        right: 430px;
        top: 60px;
        cursor: pointer;
    }
</style>
