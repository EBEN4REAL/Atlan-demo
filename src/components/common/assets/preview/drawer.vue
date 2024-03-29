<template>
    <a-drawer
        :key="data?.guid"
        v-model:visible="visible"
        placement="right"
        :class="$style.drawerStyles"
        :closable="false"
        :mask-closable="showMask"
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

        <div
            v-if="showCollapseButton && visible"
            class="collapse-btn"
            @click="() => $emit('closeDrawer')"
        >
            <AtlanIcon icon="CaretRight" class="w-auto h-4" />
        </div>

        <DrawerNavigator
            v-if="showDrawerNavigator"
            @close="$emit('closeDrawer')"
        />

        <transition name="fade">
            <div
                v-if="deferredLoading"
                class="flex items-center justify-center w-full h-full"
            >
                <AtlanLoader class="h-12 mx-auto my-auto" />
            </div>
            <AssetPreview
                v-else
                :selected-asset="drawerData"
                :is-drawer="true"
                :drawer-active-key="drawerActiveKey"
                @closeDrawer="$emit('closeDrawer')"
            ></AssetPreview>
        </transition>
    </a-drawer>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        watch,
        toRefs,
        provide,
        computed,
        inject,
    } from 'vue'
    import AssetPreview from '@/common/assets/preview/index.vue'
    import DrawerNavigator from '@/common/assets/preview/drawerNavigator.vue'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
    import {
        AssetAttributes,
        InternalAttributes,
        SQLAttributes,
        GlossaryAttributes,
        AssetRelationAttributes,
    } from '~/constant/projection'

    export default defineComponent({
        name: 'AssetDrawer',
        components: {
            AssetPreview,
            DrawerNavigator,
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
                default: false,
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
            watchGuid: {
                type: Boolean,
                required: false,
                default: false,
            },
            showCollapseButton: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        emits: ['closeDrawer', 'update'],

        setup(props, { emit }) {
            const { showDrawer, guid, qualifiedName, data, watchGuid } =
                toRefs(props)

            const visible = ref(false)
            const drawerData = ref(data.value)
            const deferredLoading = ref(false)
            const showDrawerNavigator = inject('showDrawerNavigator', false)

            const updateDrawerList = (asset) => {
                drawerData.value = asset
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

            const defaultAttributes = ref([
                ...InternalAttributes,
                ...AssetAttributes,
                ...SQLAttributes,
                ...GlossaryAttributes,
            ])
            const relationAttributes = ref([...AssetRelationAttributes])

            const { list, fetch, isLoading } = useDiscoverList({
                isCache: false,
                dependentKey,
                facets,
                limit,
                offset,
                attributes: defaultAttributes,
                relationAttributes,
            })

            watch(guid, () => {
                // TODO: Added this for lineage - do let me know if it breaks other places it's being used
                visible.value = showDrawer.value
                if (!visible.value) return

                if (!watchGuid.value) return

                if (guid.value) {
                    fetch()
                    visible.value = true
                } else visible.value = false
            })

            watch(showDrawer, () => {
                // TODO: Added this for lineage - do let me know if it breaks other places it's being used
                visible.value = showDrawer.value
                if (!visible.value) return

                if (watchGuid.value) return

                if (
                    (guid.value !== '' || qualifiedName.value !== '') &&
                    showDrawer.value
                )
                    fetch()

                // visible.value = showDrawer.value
            })

            watch(list, () => {
                if (list.value.length > 0) {
                    drawerData.value = list.value[0]
                }
            })

            watch(
                data,
                () => {
                    drawerData.value = data.value
                },
                { deep: true }
            )

            watch(isLoading, () => {
                if (isLoading.value) {
                    setTimeout(() => {
                        deferredLoading.value = isLoading.value
                    }, 300)
                } else deferredLoading.value = isLoading.value
            })

            return {
                visible,
                drawerData,
                deferredLoading,
                isLoading,
                showDrawerNavigator,
            }
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

<style scoped>
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.1s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0.2;
    }
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

    .collapse-btn {
        @apply p-1 border-t border-b border-l fixed cursor-pointer bg-white rounded-l-md border-gray-300 shadow-sm;
        right: 420px;
        top: 90px;
    }
</style>
