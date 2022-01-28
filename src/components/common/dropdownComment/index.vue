<template>
    <a-dropdown
        v-model:visible="isVisibleReject"
        trigger="hover"
        placement="bottomRight"
    >
        <template #overlay>
            <a-menu>
                <!-- <a-menu-item key="1" @click="handleClickReject">
                                Reject
                            </a-menu-item> -->

                <a-menu-item key="2" @click="handleClickRejectWithComment">
                    <a-popover
                        v-model:visible="isVisibleRejectWithComment"
                        trigger="click"
                        placement="bottomRight"
                        :align="{ offset: [15, -60] }"
                    >
                        <template #content>
                            <div class="comment-delete">
                                <div class="flex">
                                    <a-textarea
                                        v-model:value="messageReject"
                                        placeholder="Message"
                                        class="border-none"
                                        :rows="2"
                                    />
                                </div>
                                <div
                                    class="flex items-center justify-between mt-4"
                                >
                                    <a-button
                                        class="text-gray-500"
                                        size="small"
                                        type="link"
                                        @click="cancelReject"
                                    >
                                        Cancel
                                    </a-button>
                                    <a-button
                                        size="small"
                                        type="link"
                                        :class="'text-red-500'"
                                        @click="handleReject"
                                    >
                                        Reject
                                    </a-button>
                                </div>
                            </div>
                        </template>
                        Reject with comment
                    </a-popover>
                </a-menu-item>
            </a-menu>
        </template>
        <!-- @click.stop="$emit('reject')" -->
        <div
            class="chevron-icon"
            @click.stop="isVisibleReject = !isVisibleReject"
        >
            <AtlanIcon icon="ChevronDown" />
        </div>
    </a-dropdown>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        ref,
        ComputedRef,
        Ref,
        toRefs,
        PropType,
    } from 'vue'

    export default defineComponent({
        name: 'DropdownComment',
        components: {},
        props: {},
        setup(props, { emit }) {
            return {}
        },
    })
</script>

<style scoped></style>
