<template>
    <div class="p-5">
        <div class="flex items-center text-sm font-bold text-gray-600">
            <AtlanIcon icon="Link" class="mb-1 mr-2" />Resources
        </div>
        <div class="mt-5">
            <div
                class="flex items-center p-3 border border-gray-100 rounded-xl"
            >
                <div class="p-2.5 rounded-full bg-gray-100 mr-3">
                    <AtlanIcon icon="Slack" class="w-4 h-4" />
                </div>
                <div>
                    <div class="text-sm font-bold text-gray-800">
                        Slack Resource name
                    </div>
                    <div class="mt-1 text-sm text-gray-700">
                        Edited a day ago
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
        name: 'PersonaResources',
        components: {},
        props: {},
        setup(props) {
            return {}
        },
    })
</script>
<style lang="less"></style>
<style lang="less" scoped></style>
