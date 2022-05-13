<template>
    <div class="p-5">
        <div class="flex items-center text-sm font-bold text-gray-600">
            <AtlanIcon icon="Property" class="mb-1 mr-2" />Properties
        </div>
        <div class="mt-3">
            <div class="py-3">
                <div class="text-base text-gray-600">Last updated by</div>
            </div>
            <div class="py-3">
                <div class="text-base text-gray-600">Last updated at</div>
                <div class="mt-2 text-base text-gray-800">
                    May 5, 2022, 4:41:55 PM (5 days ago)
                </div>
            </div>
            <div class="py-3">
                <div class="text-base text-gray-600">Created at</div>
                <div class="mt-2 text-base text-gray-800">
                    May 5, 2022, 4:41:55 PM (5 days ago)
                </div>
            </div>
            <div class="py-3">
                <div class="text-base text-gray-600">Created by</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
        name: 'PropertyPersona',
        components: {},
        props: {},
        setup(props) {
            return {}
        },
    })
</script>
<style lang="less"></style>
<style lang="less" scoped></style>
