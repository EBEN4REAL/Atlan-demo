<template>
    <div class="p-5">
        <div class="flex items-center text-sm font-bold text-gray-500">
            <AtlanIcon icon="Link" class="mb-1 mr-2" />Resources
        </div>
        <div v-if="item?.resources?.links?.length > 0" class="mt-5">
            <div
                v-for="(resource, index) in sortResources(
                    item?.resources?.links
                )"
                :key="index"
                class="flex-grow mb-3"
            >
                <component
                    :is="getPreviewComponent(resource?.attributes?.link)"
                    :link="resource"
                    :asset-type="resource?.attributes?.asset?.typeName || null"
                    :asset-subtitle="true"
                    :actions="['copy']"
                />
            </div>
        </div>
        <div v-else class="mt-5">
            <div
                class="flex flex-col items-center justify-center h-96 gap-y-10"
            >
                <div class="w-full h-28">
                    <AtlanIcon
                        icon="EmptyResource2"
                        alt="EmptyResource"
                        class="w-full h-full"
                    />
                </div>
                <p class="w-3/4 text-sm text-center">
                    Resources is the place to document all knowledge around the
                    persona
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, provide, defineAsyncComponent, ref } from 'vue'
    import { useTimeAgo } from '@vueuse/core'
    import { getDomain } from '~/utils/url'
    import Avatar from '~/components/common/avatar/index.vue'
    import { isSlackLink } from '~/composables/integrations/slack/useSlack'

    export default defineComponent({
        name: 'PersonaPurposeResources',
        components: {
            Avatar,
            SlackLinkPreview: defineAsyncComponent(
                () =>
                    import(
                        '@/common/widgets/resources/previewCard/slackPreview.vue'
                    )
            ),
            LinkPreview: defineAsyncComponent(
                () =>
                    import(
                        '@/common/widgets/resources/previewCard/linkPreviewCard.vue'
                    )
            ),
        },
        props: {
            item: {
                type: Object,
                required: true,
            },
        },
        setup(props) {
            const tab = ref({
                activeIcon: 'Link',
                analyticsKey: 'resources',
                component: 'resources',
                icon: 'Link',
                name: 'Resources',
                requiredInProfile: true,
                scrubbed: true,
                tooltip: 'Resources',
            })
            provide('tab', tab)

            /* eslint-disable no-underscore-dangle */
            const sortResources = (_resources) =>
                _resources?.sort((a, b) =>
                    (a.attributes.__modificationTimestamp ??
                        a.attributes.__timestamp) >
                    (b.attributes.__modificationTimestamp ??
                        b.attributes.__timestamp)
                        ? -1
                        : 1
                )

            function getPreviewComponent(url) {
                if (isSlackLink(url)) {
                    return 'SlackLinkPreview'
                }
                return 'LinkPreview'
            }

            const imageUrl = (username: any) =>
                `${window.location.origin}/api/service/avatars/${username}`
            return {
                useTimeAgo,
                getDomain,
                imageUrl,
                getPreviewComponent,
                sortResources,
            }
        },
    })
</script>
<style lang="less"></style>
<style lang="less" scoped></style>
