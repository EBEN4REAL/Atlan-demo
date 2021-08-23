<template>
    <div class="grid h-full grid-cols-12">
        <div class="col-span-3 overflow-hidden border-r border-gray-100">
            <div class="p-3">
                <div class="flex">
                    <a-input-search
                        v-model:value="searchText"
                        placeholder="Search"
                        @change="handleSearchTextChange"
                    >
                    </a-input-search>
                    <a-button
                        type="primary"
                        class="ml-2"
                        @click="handleNewConnector"
                    >
                        <fa icon="fal plus" class="mr-1"></fa>New
                    </a-button>
                </div>
            </div>
            <div style="height: calc(100% - 60px)" class="px-3 overflow-y-auto">
                <ConnectionTree
                    :tree-data="treeData"
                    :is-loading="isLoading"
                    :is-validating="isValidating"
                    :error="error"
                    :is-error="isError"
                    @select="handleSelect"
                ></ConnectionTree>
            </div>
        </div>

        <div class="h-full col-span-9 overflow-y-auto">
            <router-view></router-view>
        </div>
    </div>
</template>

<script lang="ts">
    import { watch, defineComponent, ref, computed } from 'vue'
    import ConnectionTree from '@/connection/tree/index.vue'
    import { useRouter } from 'vue-router'
    import { useHead } from '@vueuse/head'
    import { useDebounceFn } from '@vueuse/core'
    import useConnectionsList from '~/composables/bots/useConnectionList'
    import { CONNECTION_FETCH_LIST } from '~/constant/cache'
    import { useConnectionsStore } from '~/store/connections'

    export default defineComponent({
        components: { ConnectionTree },
        setup() {
            // Fetch Connection to Global Store - Max 100
            const now = ref(true)
            const initialBody = {
                limit: 100,
            }
            const { data, isLoading, isValidating } = useConnectionsList(
                now,
                initialBody,
                CONNECTION_FETCH_LIST
            )

            const searchText = ref('')
            useHead({
                title: 'Connections',
            })
            const router = useRouter()
            const handleNewConnector = () => {
                router.push('/setup')
            }
            const handleSelect = (key: any) => {
                router.push(`/connections/${key}`)
            }

            const treeData = ref()
            const store = useConnectionsStore()
            watch(data, () => {
                treeData.value = store.getSourceTree(searchText.value)
            })
            const handleSearchTextChange = useDebounceFn(() => {
                treeData.value = store.getSourceTree(searchText.value)
            }, 200)

            const isError = computed(() => store.getStatus.isLoading)
            const error = computed(() => store.getStatus.error)

            return {
                searchText,
                handleNewConnector,
                handleSelect,
                treeData,
                handleSearchTextChange,
                isLoading,
                isError,
                error,
                isValidating,
            }
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
