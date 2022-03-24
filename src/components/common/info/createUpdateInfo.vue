<template>
    <p class="mb-0 text-sm text-gray-500" style="word-break: break-word">
        <span v-if="updatedBy || updatedAtString" class="space-x-1">
            <span v-if="updatedBy">
                Last updated
                <template
                    v-if="updatedBy?.startsWith('service-account-apikey-')"
                >
                    via <AtlanIcon icon="Key" class="h-3" /> API key
                </template>
                <template v-else>
                    by
                    <template v-if="updatedBy === 'service-account-atlan-argo'">
                        <span class="mr-1">
                            <AtlanIcon icon="Atlan" class="rounded-full" />
                            Atlan</span
                        >
                    </template>
                    <span
                        v-else
                        class="cursor-pointer hover:underline"
                        @click="() => handleClickUser(updatedBy)"
                    >
                        <img
                            v-if="showUpdaterImage"
                            :src="imageUrl(updatedBy)"
                            class="flex-none inline-block h-4 rounded-full"
                            @error="showUpdaterImage = false"
                        />
                        {{ updatedBy }}
                    </span>
                </template>
            </span>
            <span v-if="updatedAtString">
                {{ updatedAtString }}
            </span>
        </span>
        <span class="pl-2 pr-1 text-gray-300">•</span>
        <span v-if="createdAtString || createdBy" class="space-x-1">
            <span v-if="createdBy">
                Created
                <template
                    v-if="createdBy?.startsWith('service-account-apikey-')"
                >
                    via <AtlanIcon icon="Key" class="h-3" /> API key
                </template>
                <template v-else>
                    by
                    <template v-if="createdBy === 'service-account-atlan-argo'">
                        <span class="mr-1">
                            <AtlanIcon icon="Atlan" class="rounded-full" />
                            Atlan</span
                        >
                    </template>
                    <span
                        v-else
                        class="cursor-pointer hover:underline"
                        @click="() => handleClickUser(createdBy)"
                    >
                        <img
                            v-if="showCreatorImage"
                            :src="imageUrl(createdBy)"
                            class="flex-none inline-block h-4 rounded-full"
                            @error="showCreatorImage = false"
                        />
                        {{ createdBy }}
                    </span>
                </template>
            </span>
            <span v-if="createdAtString">
                {{ createdAtString }}
            </span>
        </span>
    </p>
</template>

<script lang="ts">
    import { defineComponent, computed, ref } from 'vue'

    // ? Composables
    import { useTimeAgo } from '@vueuse/core'
    import { useUserPreview } from '~/composables/user/showUserPreview'

    // ? Utils

    export default defineComponent({
        components: {},
        props: {
            createdAt: {
                type: [Number, String],
                default: 0,
            },
            createdBy: {
                type: String,
                default: '',
            },
            updatedAt: {
                type: [Number, String],
                default: 0,
            },
            updatedBy: {
                type: String,
                default: '',
            },
        },
        setup(props, context) {
            // user preview drawer
            const { showUserPreview, setUserUniqueAttribute } = useUserPreview()
            // ? Methods
            const handleClickUser = (username: string) => {
                setUserUniqueAttribute(username, 'username')
                showUserPreview({ allowed: ['about'] })
            }
            // ? computed
            const updatedAtString = computed(() => {
                if (props.updatedAt) {
                    return useTimeAgo(props.updatedAt).value
                }
                return 0
            })

            const imageUrl = (username: any) =>
                `${window.location.origin}/api/service/avatars/${username}`

            const createdAtString = computed(() => {
                if (props.createdAt) {
                    return useTimeAgo(props.createdAt).value
                }
                return 0
            })

            const showCreatorImage = ref(true)
            const showUpdaterImage = ref(true)
            return {
                showUpdaterImage,
                showCreatorImage,
                imageUrl,
                useTimeAgo,
                updatedAtString,
                createdAtString,
                handleClickUser,
            }
        },
    })
</script>

<style scoped></style>
