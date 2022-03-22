<template>
    <div class="">
        <h1 class="text-gray-500">Everything in Atlan</h1>
        <section class="grid grid-cols-2 gap-y-3">
            <div class="flex items-center gap-x-2">
                <span
                    class="flex items-center justify-center p-1 rounded bg-green-50 w-7 h-7"
                >
                    <AtlanIcon icon="Chat" class="text-green-600" />
                </span>
                Ask question on slack directly from an asset
            </div>
            <div class="flex items-center gap-x-2">
                <span
                    class="flex items-center justify-center p-1 rounded bg-primary-light w-7 h-7"
                >
                    <AtlanIcon icon="Share" class="text-primary" />
                </span>
                Share asset profile, terms, queries with your team
            </div>
            <div class="flex items-center gap-x-2">
                <span
                    class="flex items-center justify-center p-1 rounded bg-yellow-50 w-7 h-7"
                >
                    <AtlanIcon
                        icon="NotificationNoDot"
                        class="text-yellow-600"
                    />
                </span>
                Get workflow success and failure notifications
            </div>
            <div class="flex items-center gap-x-2">
                <span
                    style="background: #fcf3fc"
                    class="flex items-center justify-center p-1 rounded w-7 h-7"
                >
                    <AtlanIcon icon="Search" class="text-pink-600" />
                </span>
                Search assets directly from slack
            </div>
        </section>
    </div>
</template>
