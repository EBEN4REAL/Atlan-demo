<template>
    <div class="flex items-center justify-between">
        <div class="flex w-full">
            <!-- back button -->
            <div class="self-start mt-5 mr-2">
                <router-link
                    class="rounded block border border-gray-200 px-1 border-transparent shadow-none hover:border-gray-300 py-0.5"
                    to="/workflows"
                >
                    <atlan-icon
                        icon="ArrowRight"
                        class="w-5 h-5 text-gray-500 transform rotate-180"
                    />
                </router-link>
            </div>
            <div class="flex flex-col w-full">
                <div class="flex text-sm text-gray-500">
                    <div class="mr-2">
                        <img
                            v-if="logo"
                            :src="logo"
                            class="flex-none w-auto h-3.5 mb-0.5"
                        />
                    </div>
                    <span class="text-gray-500">Workflow</span>
                </div>
                <div>
                    <h3 class="text-xl">
                        {{ workflow?.metadata.name }}
                        <!-- <span
                            class="px-2 py-1 text-xs border border-transparent border-gray-200 rounded shadow-none hover:border-gray-300"
                            @click="$router.back()"
                        >
                            Scheduled
                        </span> -->
                    </h3>
                </div>
                <div class="flex items-center gap-x-3">
                    <div
                        class="flex items-center text-sm text-gray-500 cursor-pointer gap-x-1"
                        @click="showUserPreviewDrawer"
                    >
                        <AtlanIcon v-if="creator?.first_name" icon="User" />
                        <span>{{ creator?.first_name }}</span>
                    </div>

                    <div v-if="latRun" class="flex text-sm text-gray-500">
                        <div
                            v-if="creator?.first_name"
                            class="mr-3"
                            style="color: rgb(196, 196, 196)"
                        >
                            •
                        </div>
                        <span class="text-gray-500">
                            Last run {{ latRun }}</span
                        >
                    </div>
                    <template v-if="totalRun">
                        <div
                            v-if="latRun || creator?.first_name"
                            style="color: rgb(196, 196, 196)"
                        >
                            •
                        </div>
                        <div class="flex text-sm text-gray-500">
                            <span class="text-gray-500"
                                >{{ totalRun }} total runs</span
                            >
                        </div>
                    </template>
                </div>
            </div>
            <div class="flex space-x-2">
                <UtilityButtons />
                <!-- <a-button size="small" @click="$emit('openLogs')"
                    >Logs</a-button
                > -->
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, watch, ref, toRefs } from 'vue'
    import { useTimeAgo } from '@vueuse/core'
    import UtilityButtons from '@/workflows/shared/utilityButtons.vue'
    import { getArchivedRunList } from '~/composables/workflow/useWorkflowList'
    import { useUserPreview } from '~/composables/user/showUserPreview'

    export default defineComponent({
        components: {
            UtilityButtons,
        },
        props: {
            workflow: { type: Object, default: () => {} },
            id: {
                type: String,
                required: true,
            },
            creator: {
                type: Object,
                required: true,
            },
            logo: {
                type: String,
                requred: false,
                default: '',
            },
        },
        setup(props) {
            const totalRun = ref(0)
            const latRun = ref('')
            const { id } = toRefs(props)
            const { archivedList, filter_record } = getArchivedRunList(id.value)
            watch(archivedList, (newVal) => {
                totalRun.value = filter_record.value ?? 0
                if (newVal?.length > 0) {
                    const lastRun = newVal[newVal.length - 0]
                    latRun.value = lastRun?.finished_at
                        ? useTimeAgo(lastRun.finished_at as string).value
                        : ''
                }
            })

            // BEGIN: USER PREVIEW
            const { showUserPreview: openPreview, setUserUniqueAttribute } =
                useUserPreview()
            const showUserPreviewDrawer = () => {
                setUserUniqueAttribute(props.creator.id)
                openPreview()
            }

            return {
                showUserPreviewDrawer,
                totalRun,
                latRun,
            }
        },
    })
</script>
