<template>
    <div class="">
        <h1 class="text-gray-500">Everything in Atlan</h1>
        <section class="grid grid-cols-2 gap-y-3">
            <div class="flex items-center gap-x-2">
                <span
                    class="flex items-center justify-center p-1 rounded bg-green-50 w-7 h-7"
                >
                    <AtlanIcon icon="Add" class="text-green-600" />
                </span>
                Create Jira issues from Atlan
            </div>
            <div class="flex items-center gap-x-2">
                <span
                    class="flex items-center justify-center p-1 rounded bg-primary-light w-7 h-7"
                >
                    <AtlanIcon icon="Link" class="text-primary" />
                </span>
                Link Jira issues with Atlan
            </div>
            <div class="flex items-center gap-x-2">
                <span
                    class="flex items-center justify-center p-1 rounded bg-yellow-50 w-7 h-7"
                >
                    <AtlanIcon icon="Time" class="text-yellow-600" />
                </span>
                See history of all Jira issues for any asset
            </div>
        </section>
    </div>
</template>
