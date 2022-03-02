<template>
    <div class="w-full h-full p-6 bg-white" style="min-height: 430px">
        <div class="mb-1">
            <span class="" style="font-size: 40px">👏</span>
        </div>
        <div class="mb-4">
            <p class="mb-1 text-xl font-bold text-gray-700">
                Query successfully scheduled
            </p>
            <p class="text-gray-500" style="font-size: 16px">
                The output will be shared as a CSV attachment
            </p>
        </div>
        <div class="p-3 mb-4 border border-gray-300 rounded light-shadow">
            <div class="flex items-center justify-between mb-3">
                <p class="font-bold text-gray-700" style="font-size: 16px">
                    Schedule
                </p>
                <div class="text-primary">
                    <AtlanIcon icon="Play" class="w-4 h-4 mr-1.5" />
                    <span class="text-sm">Run Now</span>
                </div>
            </div>
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
        <div class="p-3 border border-gray-300 rounded light-shadow">
            <div class="flex items-center mb-3">
                <p class="font-bold text-gray-700" style="font-size: 16px">
                    Variables
                </p>
            </div>
            <div class="flex items-center mb-2 text-gray-500">
                <AtlanIcon icon="String" class="h-4 mr-2 w-4 -mt-0.5" />
                <span>Customer name - </span>
                <p class="text-sm text-gray-500">
                    <span class="font-bold">&nbsp; Xyz Inc, Acme Inc</span>
                </p>
            </div>
            <div class="flex items-center text-gray-500">
                <AtlanIcon icon="DateTime" class="h-4 mr-2 w-4 -mt-0.5" />
                <span>Date - </span>
                <p class="text-sm text-gray-500">
                    <span class="font-bold">&nbsp; 2019/20/11</span>
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
    .placeholder {
        background-color: #f4f4f4;
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
