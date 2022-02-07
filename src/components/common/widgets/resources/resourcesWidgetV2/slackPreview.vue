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
    <LinkPreview v-else-if="error" v-bind="$props" />
    <template v-else>
        <div
            class="flex p-2 border rounded cursor-pointer hover:bg-gray-100"
            @click="openLink(link.url)"
        >
            <template v-if="data">
                <div class="relative h-8 mr-3 min-w-link-left-col">
                    <!-- avatar -->
                    <img
                        class="rounded-full"
                        :src="data.user.image_32"
                        alt=""
                    />
                    <AtlanIcon
                        :icon="'Slack'"
                        class="absolute slack-icon-avatar-overlay"
                    ></AtlanIcon>
                </div>

                <div class="flex flex-col">
                    <div class="flex items-center">
                        <!-- sender -->
                        <b class="mr-2 font-bold">{{ data.user.real_name }}</b>
                        <span class="text-xs text-gray-500">
                            {{
                                useTimeAgo(new Date(data.message.ts * 1000))
                                    .value
                            }}
                        </span>
                    </div>

                    <!-- <ShowLess :text="stripSlackText(data.message.text ?? '')" /> -->

                    <span class="" style="min-width: 20rem">
                        <Truncate
                            placement="left"
                            :tooltip-text="
                                stripSlackText(data.message.text ?? '')
                            "
                            width=""
                            tooltipColor="white"
                        />
                    </span>

                    <div class="flex text-sm text-gray-500">
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
                </div>
                <div class="flex-grow"></div>
                <div class="">
                    <CardActions v-bind="props">
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
    </template>
</template>

<script setup lang="ts">
    import { PropType, ref, provide, toRefs, computed, watch } from 'vue'
    import { useTimeAgo } from '@vueuse/core'
    import { Link } from '~/types/resources.interface'
    import LinkPreview from '@/common/widgets/resources/resourcesWidgetV2/linkPreviewCard.vue'
    import {
        getChannelAndMessageIdFromSlackLink,
        UnfurlSlackMessage,
        stripSlackText,
    } from '~/composables/integrations/useSlack'
    import DeleteResource from '@/common/widgets/resources/resourcesWidgetV2/misc/deleteResource.vue'
    import EditResource from '@/common/widgets/resources/resourcesWidgetV2/resourceInputModal.vue'
    import ShowLess from '@/UI/showLess.vue'
    import CardActions from '@/common/widgets/resources/resourcesWidgetV2/misc/cardActionMenu.vue'
    import integrationStore from '~/store/integrations/index'
    import Truncate from '@/common/ellipsis/index.vue'

    const props = defineProps({
        link: {
            type: Object as PropType<Link>,
            required: true,
        },
    })

    const { link } = toRefs(props)
    const body = computed(() => {
        const { channelId, messageId } = getChannelAndMessageIdFromSlackLink(
            link.value.url
        )
        return {
            conversationId: channelId,
            messageId,
        }
    })

    const { data, isLoading, error, mutate } = UnfurlSlackMessage(body, {
        immediate: true,
    })

    watch(
        () => link.value.url,
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
        }
    }
</script>

<style lang="less" scoped>
    .slack-icon-avatar-overlay {
        height: 1rem;
        bottom: -3px;
        right: -6px;
        border-radius: 100px;
        /* box-shadow: -1px 1px 4px white; */
        background: white;
        padding: 0.9px;
    }
    .min-w-link-left-col {
        min-width: 2rem;
    }
</style>
