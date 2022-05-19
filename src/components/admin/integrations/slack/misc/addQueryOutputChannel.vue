<template>
    <div class="">
        <h2 class="mb-1 font-bold">Query output share channels</h2>
        <span class="text-sm text-gray-500">
            {{ query_output_description }}
        </span>
    </div>
    <div class="col-span-2">
        <div
            class="flex flex-wrap items-center gap-2 p-1 mb-5 border border-gray-300 rounded min-h-10"
        >
            <Chip
                v-for="(channel, x) in queryOutputChannels"
                :key="channel.name"
                :index="x"
                :content="channel.name"
                icon="Number"
                :class="
                    channel?.invalid
                        ? 'border border-dashed border-red-500'
                        : ''
                "
                @remove="removeQueryOutputChannel"
            />
            <div class="flex-grow inline-block mx-3">
                <input
                    v-model="queryOutputChannel"
                    class="w-full focus:outline-none"
                    placeholder="Query output share channels"
                    @keydown.enter="addQueryOutputChannel"
                    @blur="addQueryOutputChannel"
                    @keydown.backspace="
                        (e) => {
                            if (!e?.target?.value)
                                removeQueryOutputChannel(queryOutputChannel)
                        }
                    "
                    @keydown.tab="
                        (e) => {
                            e.preventDefault()
                            addQueryOutputChannel(e)
                        }
                    "
                />
            </div>
        </div>
        <div
            class="text-sm mt-2.5 text-new-gray-700 flex col-span-2 items-center"
        >
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

        <div
            class="text-sm mt-2.5 text-new-red-500"
            v-if="atlanBotNotAddedToChannels.length"
        >
            <AtlanIcon icon="Error" class="text-new-red-500 -mt-0.5 mr-1" />
            Error! Atlan bot is not added to
            <b>
                {{
                    atlanBotNotAddedToChannels
                        .map((channel) => `"${channel.name}"`)
                        ?.join(',')
                }}
            </b>

            channel
        </div>
    </div>
</template>

<script setup lang="ts">
    import { Ref, ref, toRefs, watch, PropType, computed } from 'vue'
    import Chip from '@/UI/chip.vue'
    import { integrations } from '~/constant/integrations/integrations'
    import { useVModels } from '@vueuse/core'
    import { checkAtlanBotInChannels } from '~/composables/integrations/slack/useSlack'
    import { invoke, until } from '@vueuse/core'

    const props = defineProps({
        queryOutputChannels: {
            type: Object as PropType<string[]>,
            default: () => [],
        },
    })

    const emit = defineEmits(['change', 'remove'])

    const { queryOutputChannels } = useVModels(props, emit)
    const queryOutputChannel = ref('')

    const addQueryOutputChannel = (e) => {
        const value = e?.target?.value.trim() ?? null
        if (value) {
            queryOutputChannels.value = [
                ...queryOutputChannels.value,
                { name: value, invalid: false, atlanBotAdded: true },
            ]
            emit('change', '')
            queryOutputChannel.value = ''
        }
    }

    const removeQueryOutputChannel = (i) => {
        const index = i
        queryOutputChannels.value.splice(index, 1)
        emit('change', '')
    }

    const atlanBotNotAddedToChannels = computed(() => {
        return queryOutputChannels.value?.filter(
            (channel) => channel.atlanBotAdded === false
        )
    })

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
