<template>
    <AtlanButton
        class="flex items-center btn-actions"
        color="secondary"
        padding="compact"
        size="sm"
        :disabled="isLoading"
        @click.stop="$emit('submit', '')"
    >
        <AtlanIcon
            v-if="isLoading"
            icon="CircleLoader"
            class="w-4 h-3 animate-spin"
            :class="{
                'text-green-500': type === 'approve',
                'text-red-500': type === 'reject',
            }"
        />
        <slot></slot>
        <div class="sparator" />
        <a-dropdown
            v-model:visible="visible"
            trigger="click"
            placement="bottomRight"
        >
            <template #overlay>
                <a-menu>
                    <!-- <a-menu-item key="4" @click="$emit('accept')">
                            Approve
                        </a-menu-item> -->
                    <a-menu-item key="2" @click="handleAddComment">
                        <a-popover
                            v-model:visible="visibleComment"
                            trigger="click"
                            placement="bottomRight"
                            :align="{ offset: [15, -70] }"
                        >
                            <template #content>
                                <div class="comment-container">
                                    <div class="flex mb-2">
                                        <Avatar
                                            :allow-upload="false"
                                            :avatar-size="16"
                                            :avatar-shape="'circle'"
                                            class="mr-2"
                                            :image-url="avatarUrl"
                                        />
                                        <div
                                            class="mt-1 text-sm text-gray-500 capitalize"
                                        >
                                            {{ name }}
                                        </div>
                                    </div>
                                    <div class="p-2 border rounded-md">
                                        <div class="flex">
                                            <a-textarea
                                                v-model:value="message"
                                                placeholder="Message"
                                                class="border-none outline-none focus:border-none focus:outline-none hover:border-none hover:outline-none"
                                                :rows="2"
                                            />
                                        </div>
                                        <div
                                            class="flex items-center justify-end mt-4"
                                        >
                                            <a-button
                                                class="text-gray-500"
                                                size="small"
                                                type="link"
                                                @click="handleCancel"
                                            >
                                                Cancel
                                            </a-button>
                                            <AtlanButton
                                                :padding="'compact'"
                                                :size="'small'"
                                                class="py-1 ml-2 capitalize"
                                                type="primary"
                                                :disabled="!message"
                                                @click="handleSubmitWithComment"
                                            >
                                                {{ type }}
                                            </AtlanButton>
                                        </div>
                                    </div>
                                </div>
                            </template>
                            {{ itemDropDown }}
                        </a-popover>
                    </a-menu-item>
                </a-menu>
            </template>
            <div class="chevron-icon" @click.stop="visible = !visible">
                <AtlanIcon icon="ChevronDown" :class="'icon-drop'" />
            </div>
        </a-dropdown>
    </AtlanButton>
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
    import AtlanButton from '@/UI/button.vue'
    import Avatar from '~/components/common/avatar/index.vue'
    import useUserData from '~/composables/user/useUserData'

    export default defineComponent({
        name: 'RequestDropdown',
        components: { AtlanButton, Avatar },
        props: {
            isLoading: {
                type: Boolean,
                required: false,
                default: false,
            },
            itemDropDown: {
                type: String,
                require: false,
                default: '',
            },
            type: {
                type: String,
                require: false,
                default: '',
            },
        },
        emits: ['submit'],
        setup(props, { emit }) {
            const visible = ref(false)
            const visibleComment = ref(false)
            const message = ref('')
            const handleCancel = () => {
                visibleComment.value = false
            }
            const handleAddComment = () => {
                visibleComment.value = true
                message.value = ''
                setTimeout(() => {
                    visible.value = false
                }, 300)
            }
            const handleSubmitWithComment = () => {
                emit('submit', message.value)
            }
            const { name, avatar: avatarUrl } = useUserData()
            return {
                visible,
                visibleComment,
                message,
                handleCancel,
                handleAddComment,
                handleSubmitWithComment,
                name,
                avatarUrl,
            }
        },
    })
</script>

<style scoped>
    .sparator {
        width: 1px;
        height: 60%;
        background: #e6e6eb;
        margin-left: 10px;
    }
    .comment-container {
        padding: 12px;
    }
</style>
