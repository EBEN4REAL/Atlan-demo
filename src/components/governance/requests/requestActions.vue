<template>
    <div class="flex items-center justify-end gap-x-2">
        <a-dropdown
            v-model:visible="isVisibleReject"
            trigger="click"
            placement="bottomRight"
        >
            <template #overlay>
                <a-menu>
                    <a-menu-item key="1" @click="handleClickReject">
                        Reject
                    </a-menu-item>

                    <a-menu-item key="2" @click="handleClickRejectWithComment">
                        <a-popover
                            v-model:visible="isVisibleRejectWithComment"
                            trigger="click"
                            placement="bottomRight"
                            :align="{ offset: [15, -70] }"
                        >
                            <template #content>
                                <div class="comment-delete">
                                    <div class="flex">
                                        <component
                                            :is="iconQuotes"
                                            class="mr-4"
                                        />
                                        <p>
                                            Lorem ipsum dolor sit amet,
                                            consectetur adipiscing elit.
                                        </p>
                                    </div>
                                </div>
                            </template>
                            Reject with comment
                        </a-popover>
                    </a-menu-item>
                </a-menu>
            </template>
            <!-- @click.stop="$emit('reject')" -->
            <AtlanButton
                color="secondary"
                padding="compact"
                size="sm"
                @click.stop="isVisibleReject = !isVisibleReject"
            >
                <template #suffix>
                    <AtlanIcon class="mr-1" icon="ChevronDown" />
                </template>
                <span class="text-red-500"> Decline </span>
            </AtlanButton>
        </a-dropdown>
        <AtlanButton
            color="secondary"
            padding="compact"
            size="sm"
            @click.stop="$emit('accept')"
            ><template #prefix
                ><AtlanIcon class="mr-1" icon="Approve" />
            </template>
            Accept
        </AtlanButton>
        <!-- <AtlanButton
            color="secondary"
            @click.stop="$emit('more')"
            padding="compact"
            size="sm"
            ><template #label><AtlanIcon icon="KebabMenu" /> </template>
        </AtlanButton> -->
    </div>
</template>

<script lang="ts">
    import { defineComponent, toRefs, ref } from 'vue'
    import AtlanButton from '@/UI/button.vue'
    import iconQuotes from '~/assets/images/icons/Quotes.svg'

    export default defineComponent({
        name: 'RequestActions',
        components: { AtlanButton },
        emits: ['accept', 'reject', 'more'],
        setup(props, { emit }) {
            const isVisibleReject = ref(false)
            const isVisibleRejectWithComment = ref(false)
            const handleClickReject = () => {
                emit('reject')
                isVisibleReject.value = false
            }
            const handleClickRejectWithComment = () => {
                // isVisibleRejectWithComment.value = true
                setTimeout(() => {
                    isVisibleReject.value = false
                }, 300)
            }
            return {
                isVisibleReject,
                handleClickReject,
                handleClickRejectWithComment,
                isVisibleRejectWithComment,
                iconQuotes,
            }
        },
    })
</script>

<style lang="less" scoped>
    .comment-delete {
        height: 90px;
        width: 200px;
        padding: 12px 8px;
    }
</style>
