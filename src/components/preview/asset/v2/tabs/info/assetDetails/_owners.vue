<template>
    <p class="mb-0">Owners</p>
    <div class="" @click="$emit('toggleOwnersDropdown')">
        <a-dropdown :trigger="['click']" v-model:visible="showOwnersDropdown">
            <div
                class="grid grid-cols-2 p-2 rounded  hover:border auto-rows-auto gap-y-3"
            >
                <div class="flex items-center mr-2.5">
                    <img
                        src="https://picsum.photos/id/237/50/50"
                        alt="view"
                        class="w-4 h-4 mr-1 rounded-full"
                    /><span class="text-gray truncate ...">@sarbik</span>
                </div>
                <div class="flex items-center mr-2.5">
                    <img
                        src="https://picsum.photos/id/238/50/50"
                        alt="view"
                        class="w-4 h-4 mr-1 rounded-full"
                    /><span class="text-gray truncate ...">@shreyas</span>
                </div>
                <div class="flex items-center mr-2.5">
                    <img
                        src="https://picsum.photos/id/239/50/50"
                        alt="view"
                        class="w-4 h-4 mr-1 rounded-full"
                    /><span class="text-gray truncate ...">@shubankar</span>
                </div>
                <div>
                    <span
                        class="
                            px-1
                            py-0.5
                            rounded
                            text-primary
                            _bg-primary-light
                        "
                    >
                        +3 Others
                    </span>
                </div>
            </div>
            <template #overlay>
                <div
                    class="
                        p-2.5
                        bg-white
                        rounded
                        shadow
                        flex
                        items-center
                        flex-col
                    "
                >
                    <a-input v-input-focus placeholder="Search Owners">
                        <!-- <template #prefix>
                                        <fa icon="fal search" />
                                    </template> -->
                    </a-input>
                    <div class="h-56 overflow-y-auto">
                        <div
                            class="flex items-center w-full px-1 py-1 mt-2 rounded cursor-pointer  hover_bg-primary-light"
                        >
                            <img
                                src="https://picsum.photos/id/237/50/50"
                                alt="view"
                                class="w-4 h-4 mr-1 rounded-full"
                            /><span class="text-gray truncate ..."
                                >Sarbik Betal</span
                            >
                        </div>
                        <div
                            class="flex items-center w-full px-1 py-1 mt-2 rounded cursor-pointer  hover_bg-primary-light"
                        >
                            <img
                                src="https://picsum.photos/id/239/50/50"
                                alt="view"
                                class="w-4 h-4 mr-1 rounded-full"
                            /><span class="text-gray truncate ..."
                                >Shubhankar Khare</span
                            >
                        </div>
                        <div
                            class="flex items-center w-full px-1 py-1 mt-2 rounded cursor-pointer  hover_bg-primary-light"
                        >
                            <img
                                src="https://picsum.photos/id/239/50/50"
                                alt="view"
                                class="w-4 h-4 mr-1 rounded-full"
                            /><span class="text-gray truncate ..."
                                >Shubhankar Khare</span
                            >
                        </div>
                        <div
                            class="flex items-center w-full px-1 py-1 mt-2 rounded cursor-pointer  hover_bg-primary-light"
                        >
                            <img
                                src="https://picsum.photos/id/239/50/50"
                                alt="view"
                                class="w-4 h-4 mr-1 rounded-full"
                            /><span class="text-gray truncate ..."
                                >Shubhankar Khare</span
                            >
                        </div>
                        <div
                            class="flex items-center w-full px-1 py-1 mt-2 rounded cursor-pointer  hover_bg-primary-light"
                        >
                            <img
                                src="https://picsum.photos/id/239/50/50"
                                alt="view"
                                class="w-4 h-4 mr-1 rounded-full"
                            /><span class="text-gray truncate ..."
                                >Shubhankar Khare</span
                            >
                        </div>
                    </div>
                </div>
            </template>
        </a-dropdown>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'

    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        components: {},
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            showOwnersDropdown: {
                type: Boolean,
                required: true,
            },
        },
        emits: ['toggleOwnersDropdown'],
        setup(props) {
            return {}
        },
    })
</script>

<style lang="less" scoped></style>
