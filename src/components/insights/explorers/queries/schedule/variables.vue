<template>
    <div
        class="flex flex-col w-full h-full overflow-auto bg-white"
        style="min-height: 430px"
    >
        <div class="flex items-center py-6 pb-2 mx-6 border-b border-gray-200">
            <AtlanIcon icon="Flash" class="w-4 h-4 mr-2" />
            <p class="font-bold text-gray-700" style="font-size: 16px">
                Variables
            </p>
        </div>
        <div class="p-6 overflow-auto" style="height: 240px">
            <div class="flex items-center justify-between mb-6">
                <div class="w-full" style="flex-0.5">
                    <p class="mb-1 font-bold text-gray-500 required">
                        Customer name
                    </p>
                    <a-input class="input" placeholder="Enter a value" />
                </div>
                <div class="w-full ml-10" style="flex-0.5">
                    <p class="mb-1 font-bold text-gray-500 required">
                        Order date
                    </p>
                    <a-input class="input" placeholder="Enter a value" />
                </div>
            </div>
            <div class="flex items-center justify-between mb-6">
                <div class="w-full" style="flex-0.5">
                    <p class="mb-1 font-bold text-gray-500 required">
                        Customer name
                    </p>
                    <a-input class="input" placeholder="Enter a value" />
                </div>
                <div class="w-full ml-10" style="flex-0.5">
                    <p class="mb-1 font-bold text-gray-500 required">
                        Order date
                    </p>
                    <a-input class="input" placeholder="Enter a value" />
                </div>
            </div>
        </div>
        <div class="p-3 mx-6 my-6 border border-gray-300 rounded light-shadow">
            <div class="flex items-center mb-2">
                <div class="w-2 h-2 mr-2.5 bg-green-400 rounded-full"></div>
                <p class="text-sm text-gray-500">
                    Next run
                    <span class="font-bold">Feb 28, Monday, 12:00 pm EST</span>
                </p>
            </div>
            <div class="flex items-center">
                <AtlanIcon
                    icon="Mail"
                    class="w-4 h-4 mr-2 -mt-0.5 text-gray-500"
                />
                <p class="text-sm text-gray-500">
                    <span class="font-bold">20 users</span> will be notified
                    over email at 12:00 pm EST daily
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    export default defineComponent({
        components: {},
        props: {},
        setup(props) {},
    })
</script>
<style lang="less" scoped>
    .input::placeholder {
        @apply text-gray-400 !important;
    }
    .light-shadow {
        box-shadow: 0px 1px 0px 0px #0000000d;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
