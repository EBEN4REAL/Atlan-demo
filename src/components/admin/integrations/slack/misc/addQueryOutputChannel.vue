<template>
    <div class="">
        <h2 class="mb-1 font-bold">Query output share channels</h2>
        <span class="text-sm text-gray-500">
            {{ query_output_description }}
        </span>
    </div>
    <div class="flex flex-col w-full col-span-2">
        <div v-if="workflowChannel" class="flex items-center h-12">
            <Chip
                :key="workflowChannel"
                :content="workflowChannel"
                icon="Number"
                :class="invalid ? 'border border-dashed border-red-500' : ''"
                @remove="remove"
            />
        </div>
        <div
            v-else
            class="flex items-center h-10 p-1 border border-gray-300 rounded"
        >
            <div class="flex-grow inline-block mx-3">
                <input
                    :value="workflowChannel"
                    class="w-full focus:outline-none"
                    placeholder="Query output share channels"
                    @keydown.enter="addWorkflowChannel"
                    @blur="addWorkflowChannel"
                    @keydown.tab="
                        (e) => {
                            e.preventDefault()
                            addWorkflowChannel(e)
                        }
                    "
                />
            </div>
        </div>
        <div class="text-sm mt-2.5 text-new-gray-700 flex items-center">
            Note - The atlan bot needs to be added to these channels.

            <a-popover
                :overlay-class-name="$style.learnMorePopover"
                :overlayStyle="{
                    'min-width': '420px',
                    'min-height': '500px',
                }"
            >
                <template #content>
                    <div class="relative p-4" style="min-width: 420px">
                        <div class="w-full p-4 bg-gray-100 rounded-xl">
                            <div class="bg-white shadow-xl rounded-xl">
                                <div
                                    class="flex items-center p-3 border-b border-gray-100"
                                >
                                    <div class="flex items-center gap-x-1">
                                        <div
                                            style="background: #ee6a5f"
                                            class="w-3 h-3 rounded-full"
                                        ></div>
                                        <div
                                            style="background: #f5bd4f"
                                            class="w-3 h-3 rounded-full"
                                        ></div>
                                        <div
                                            style="background: #61c454"
                                            class="w-3 h-3 rounded-full"
                                        ></div>
                                    </div>
                                    <div
                                        class="flex items-center justify-between px-1 ml-6 bg-gray-100 rounded w-52"
                                    >
                                        <div class=""></div>
                                        <div class="flex items-center gap-x-1">
                                            <div class="mb-1">
                                                <AtlanIcon
                                                    icon="SafariLock"
                                                    style="font-color: #797979"
                                                    class="rotate-90"
                                                />
                                            </div>
                                            <span>slack.com</span>
                                        </div>
                                        <div
                                            class=""
                                            :style="{
                                                transform:
                                                    'rotateZ(-45deg) rotateY(180deg)',
                                            }"
                                        >
                                            <AtlanIcon icon="Refresh" />
                                        </div>
                                    </div>
                                </div>
                                <div class="px-3 pb-3">
                                    <div class="rounded-lg">
                                        <AtlanIcon
                                            class="w-full"
                                            style="height: 260px"
                                            icon="SlackAddApp"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            class="bottom-0 left-0 right-0 p-4 bg-white rounded-b-lg"
                        >
                            <ol class="flex flex-col text-xs gap-y-2">
                                <li>
                                    1. Go to the Slack channel where you want to
                                    add the bot.
                                </li>
                                <li>
                                    2. Click on the channel name on top and go
                                    to
                                    <b>Integrations</b> tab
                                </li>
                                <li>
                                    3. Click on
                                    <b>Add an App</b>
                                </li>
                                <li>
                                    4. Find and add the <b> Atlan app </b> to
                                    the channel
                                </li>
                            </ol>
                        </div>
                    </div>
                    <!-- learnMore component is failing import -->
                </template>
                <span class="cursor-pointer text-primary hover:underline"
                    >&nbsp;Learn how to add it</span
                >
            </a-popover>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { Ref, ref, toRefs, watch } from 'vue'
    import Chip from '@/UI/chip.vue'
    import { integrations } from '~/constant/integrations/integrations'
    import { useVModels } from '@vueuse/core'

    const props = defineProps({
        invalid: { type: Boolean, default: false },
        workflowChannel: { type: String, default: '' },
    })

    const emit = defineEmits(['change', 'remove'])

    const { workflowChannel } = useVModels(props, emit)

    const addWorkflowChannel = (e) => {
        const value = e?.target?.value.trim() ?? null
        if (value) {
            workflowChannel.value = value
            emit('change', value)
        } else workflowChannel.value = ''
    }

    const remove = () => {
        workflowChannel.value = ''
        emit('change', '')
    }

    const { query_output_description } = integrations.slack
</script>

<style scoped></style>
<style lang="less" module>
    .learnMorePopover {
        :global(.ant-popover-inner) {
            @apply rounded-lg !important;
        }
    }
</style>
