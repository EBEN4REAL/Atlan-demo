<template>
    <div
        class="flex flex-col w-full h-full overflow-auto bg-white"
        style="min-height: 430px"
    >
        <div class="flex items-center py-6 pb-2 mx-6 border-b border-gray-200">
            <AtlanIcon icon="Flash" class="w-4 h-4 mr-2" />
            <div
                class="flex items-center font-bold text-gray-700"
                style="font-size: 16px"
            >
                <span class="mr-2"> Variables</span>
                <div
                    class="flex items-center justify-center w-4 h-5 text-xs font-bold rounded text-primary bg-primary-light"
                >
                    <span> {{ variablesData.length }}</span>
                </div>
            </div>
        </div>

        <div class="p-6 overflow-auto custom-grid" style="height: 240px">
            <!-- {{ variablesData }} -->
            <template v-for="item in variablesData" :key="item.key">
                <div class="w-full item">
                    <p class="mb-1 font-bold text-gray-500 required">
                        {{ item.name }}
                    </p>
                    <a-input
                        class="input"
                        :value="item.value"
                        :placeholder="`Enter a ${item.type} value`"
                    />
                </div>
            </template>
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
    import { defineComponent, PropType, toRefs, ref } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        components: {},
        props: {
            item: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const { item } = toRefs(props)
            const variablesData = ref(
                JSON.parse(
                    window.atob(
                        item.value.attributes?.variablesSchemaBase64 ?? '[]'
                    )
                )
            )
            return {
                variablesData,
            }
        },
    })
</script>
<style lang="less" scoped>
    .input::placeholder {
        @apply text-gray-400 !important;
    }
    .light-shadow {
        box-shadow: 0px 1px 0px 0px #0000000d;
    }
    .custom-grid {
        display: grid;
        grid-template-columns: repeat(
            auto-fill,
            minmax(300px, 1fr)
        ); /* see notes below */
        grid-gap: 40px;
        grid-row-gap: 20px;
    }
    .item {
        height: fit-content;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
