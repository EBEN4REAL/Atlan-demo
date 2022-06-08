<template>
    <template v-if="isLoading">
        <div class="p-2 border rounded">
            <a-skeleton
                :loading="true"
                avatar
                active
                :title="false"
                :paragraph="{ rows: 2 }"
            />
        </div>
    </template>
    <LinkPreview v-else-if="error" v-bind="$props">
        <template #subtitle>
            <slot name="subtitle" />
        </template>
    </LinkPreview>
    <template v-else>
        <div
            class="p-2 border rounded cursor-pointer hover:bg-gray-100"
            :class="shouldHighlight ? 'animate-yellow' : ''"
        >
            <div class="flex" @click="openLink(link.attributes.link)">
                <template v-if="data">
                    <div
                        class="flex mt-1.5 items-start w-16 overflow-hidden"
                        style="max-width: 40px"
                    >
                        <div class="relative w-10">
                            <img
                                class="rounded-full"
                                :src="data.user.image_32"
                                alt=""
                            />
                            <div class="absolute right-1 -bottom-1">
                                <AtlanIcon icon="Slack" class="" />
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col flex-grow overflow-hidden">
                        <div class="flex items-center">
                            <!-- sender -->
                            <b class="mr-2 font-bold">{{
                                data.user.real_name
                            }}</b>
                            <span class="text-xs text-gray-500">
                                {{
                                    useTimeAgo(new Date(data.message.ts * 1000))
                                        .value
                                }}
                            </span>
                        </div>

                        <!-- <ShowLess :text="stripSlackText(data.message.text ?? '')" /> -->

                        <div class="text-xs" style="">
                            <Truncate
                                placement="left"
                                :rows="2"
                                :tooltip-text="
                                    stripSlackText(data.message.text ?? '')
                                "
                                width="450px"
                                tooltip-color="white"
                            />
                        </div>

                        <div class="flex mt-1 text-xs text-gray-500">
                            <span v-if="data.message.reply_count" class="">
                                {{ data.message.reply_count }}
                                replies
                                <span class="ml-1 mr-1 text-gray-300">•</span>
                            </span>
                            <span v-if="data?.channel?.name">
                                #{{ data?.channel?.name }}
                            </span>
                            <span v-else> Private dm</span>
                        </div>

                        <!-- <div
                            v-if="
                                link.attributes.__modifiedBy &&
                                link.attributes.__modificationTimestamp
                            "
                            class="text-xs text-gray-500"
                        >
                            Edited by {{ link.attributes.__modifiedBy }}
                            {{
                                useTimeAgo(
                                    new Date(
                                        link.attributes.__modificationTimestamp
                                    )
                                ).value
                            }}
                        </div>
                        <div v-else class="text-xs text-gray-500">
                            Added by {{ link.attributes.__createdBy }}
                            {{
                                useTimeAgo(
                                    new Date(link.attributes.__timestamp)
                                ).value
                            }}
                        </div> -->
                    </div>

                    <div v-if="!readOnly">
                        <CardActions :actions="actions" v-bind="props">
                            <div @click="(e) => e.stopPropagation()">
                                <AtlanIcon
                                    icon="KebabMenu"
                                    class="h-4 m-0 cursor-pointer hover:text-primary"
                                />
                            </div>
                        </CardActions>
                    </div>
                </template>
            </div>
            <slot name="subtitle" />
        </div>
    </template>
</template>

<script setup lang="ts">
    import { PropType, toRefs, computed, watch, inject } from 'vue'
    import { useTimeAgo, whenever } from '@vueuse/core'
    import { Link } from '~/types/resources.interface'
    import LinkPreview from '@/common/widgets/resources/previewCard/linkPreviewCard.vue'
    import {
        getChannelAndMessageIdFromSlackLink,
        UnfurlSlackMessage,
        stripSlackText,
    } from '~/composables/integrations/slack/useSlack'
    import DeleteResource from '@/common/widgets/resources/misc/deleteResource.vue'
    import EditResource from '@/common/widgets/resources/resourceInputModal.vue'
    import ShowLess from '@/UI/showLess.vue'
    import CardActions from '@/common/widgets/resources/misc/cardActionMenu.vue'
    import integrationStore from '~/store/integrations/index'
    import Truncate from '@/common/ellipsis/index.vue'
    import { resourceId } from '~/composables/integrations/slack/useAskAQuestion'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import { getDomain } from '~/utils/url'

    const props = defineProps({
        link: {
            type: Object as PropType<Link>,
            required: true,
        },
        assetType: {
            type: String,
            required: false,
            default: '',
        },
        actions: {
            type: Array,
            required: false,
        },
    })

    const { link } = toRefs(props)
    const readOnly = inject('readOnly')

    const body = computed(() => {
        const { channelId, messageId } = getChannelAndMessageIdFromSlackLink(
            link.value.attributes.link
        )
        return {
            conversationId: channelId,
            messageId,
        }
    })

    const { data, isLoading, error, mutate, isReady } = UnfurlSlackMessage(
        body,
        {
            immediate: true,
        }
    )

    const shouldHighlight = computed(
        () => resourceId.value === link.value.guid && isReady?.value
    )

    whenever(shouldHighlight, () =>
        setTimeout(() => {
            resourceId.value = ''
        }, 3000)
    )

    watch(
        () => link.value.attributes.link,
        () => {
            mutate()
        }
    )

    const store = integrationStore()

    const { userSlackStatus } = toRefs(store)

    // ? watch for user level slack integration configuration status and try refresh
    watch(
        () => userSlackStatus.value.configured,
        (v) => {
            if (v) mutate()
        }
    )

    const openLink = (url) => {
        if (url) {
            window.open(url)
            useAddEvent('discovery', 'resource', 'clicked', {
                resource_url_domain: url.split('/')[2],
                asset_type: props.assetType,
            })
        }
    }
</script>

<style lang="less" scoped>
    .slack-icon-avatar-overlay {
        height: 1rem;
        bottom: -3px;
        right: -3px;
        border-radius: 100px;
        background: white;
        padding: 0.9px;
    }

    .animate-yellow {
        animation: animateYellow 3s ease;
    }
    @keyframes animateYellow {
        0% {
            @apply bg-yellow-100;
        }
        20% {
            @apply bg-yellow-100;
        }
        100% {
            @apply bg-white;
        }
    }
</style>
