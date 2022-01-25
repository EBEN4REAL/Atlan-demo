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
                                ? 'Slack must be set up in admin first to use this feature.'
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
                <span
                    class="text-red-500 cursor-pointer hover:underline"
                    @click="disconnect"
                    >Disconnect</span
                >
            </div></template
        >
    </div>
</template>

<script setup lang="ts">
    import { Modal } from 'ant-design-vue'
    import { h } from 'vue'

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

    const disconnect = () => {
        Modal.confirm({
            class: '',
            icon: null,
            content: () =>
                h(
                    'div',
                    {
                        class: ['p-4'],
                    },
                    ['Are you sure you want to disconnect?']
                ),
            okType: 'danger',
            autoFocusButton: null,
            okButtonProps: {
                type: 'primary',
            },
            okText: 'Confirm',
            cancelText: 'Cancel',
            onOk() {
                emit('disconnect')
            },
        })
    }
</script>

<style scoped></style>
