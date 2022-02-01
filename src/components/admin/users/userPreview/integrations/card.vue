<template>
    <div class="border rounded">
        <main class="p-3 space-y-2">
            <section class="flex gap-x-2">
                <div
                    class="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full"
                >
                    <AtlanIcon class="h-6" icon="Slack" />
                </div>
                <div class="">
                    <h1 class="font-bold">Slack</h1>
                    <div class="text-xs text-gray-500">
                        {{ integration.category }}
                    </div>
                </div>
                <div class="flex-grow" />
                <template v-if="status.configured">
                    <span class="flex items-center text-green-500 gap-x-1">
                        <AtlanIcon icon="Check" /> Connected
                    </span>
                </template>
                <template v-else>
                    <a-tooltip
                        :title="
                            disableConnect
                                ? 'Please ask your admin to setup Slack integration from admin center first'
                                : ''
                        "
                    >
                        <span
                            class="flex items-center gap-x-1"
                            @click="() => !disableConnect && $emit('connect')"
                            :class="{
                                'text-gray-400 cursor-not-allowed ':
                                    disableConnect,
                                'text-primary cursor-pointer ': !disableConnect,
                            }"
                        >
                            <AtlanIcon icon="Add" /> Connect
                        </span>
                    </a-tooltip>
                </template>
            </section>
            <p class="text-gray-500">{{ integration.description }}</p>
        </main>
        <template v-if="status.configured">
            <div
                class="flex items-center justify-between px-3 bg-gray-100 border-t rounded-b h-11"
            >
                <div class="">{{ status.teamName }}</div>
                <a-popover
                    v-model:visible="popover"
                    trigger="click"
                    placement="bottom"
                >
                    <template #content>
                        <div class="p-4 space-y-5">
                            <h1>
                                Are you sure you want to disconnect from
                                <b>Slack</b>?
                            </h1>
                            <div class="flex justify-end space-x-2">
                                <AtlanButton
                                    @click="popover = false"
                                    padding="compact"
                                    size="sm"
                                    color="minimal"
                                    >Cancel</AtlanButton
                                >
                                <AtlanButton
                                    @click="disconnect"
                                    padding="compact"
                                    size="sm"
                                    >Confirm</AtlanButton
                                >
                            </div>
                        </div>
                    </template>
                    <span class="text-red-500 cursor-pointer hover:underline"
                        >Disconnect</span
                    >
                </a-popover>
            </div></template
        >
    </div>
</template>

<script setup lang="ts">
    import { Modal } from 'ant-design-vue'
    import { h, ref } from 'vue'

    const props = defineProps({
        integration: {
            type: Object,
            required: true,
        },
        status: {
            type: Object,
            required: true,
        },
        disableConnect: {
            type: Boolean,
            default: false,
        },
    })

    const emit = defineEmits(['disconnect'])

    const popover = ref(false)

    const disconnect = () => {
        emit('disconnect')
        popover.value = false
    }
</script>

<style scoped></style>
