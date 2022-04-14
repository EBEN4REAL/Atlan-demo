<template>
    <div ref="wrapper" class="flex flex-col w-full h-full">
        <template v-if="minimal">
            <template v-if="resources?.length">
                <div
                    class="flex items-center justify-between px-5 pt-4 gap-x-6"
                >
                    <span class="flex items-center">
                        <PreviewTabsIcon
                            :icon="tab.icon"
                            :image="tab.image"
                            :emoji="tab.emoji"
                            height="h-4"
                            class="mb-0.5"
                        />
                        <span class="ml-1 font-semibold text-gray-500">
                            {{ tab.name }}
                        </span>
                    </span>
                    <div class="flex-grow"></div>

                    <AddResource v-if="!readOnly" @add="addCallback">
                        <template #trigger>
                            <div
                                class="flex items-center cursor-pointer text-primary"
                            >
                                <AtlanIcon icon="Add" class="mr-1 mb-0.5" /> Add
                            </div>
                        </template>
                    </AddResource>
                </div>
            </template>
        </template>

        <template v-else>
            <div class="flex justify-between p-4 border-b gap-x-6">
                <div>
                    <AtlanIcon icon="Link" class="w-auto h-4 mr-3" />
                    <span class="text-base font-bold text-gray">
                        Resources
                    </span>
                </div>
                <div class="flex-grow"></div>
                <template
                    v-if="
                        hasAtleastOneSlackLink &&
                        !userSlackStatus.configured &&
                        tenantSlackStatus.configured &&
                        !minimal
                    "
                >
                    <SlackConnect />
                </template>
                <AddResource v-if="!readOnly" @add="addCallback">
                    <template #trigger>
                        <a-button
                            class="flex items-center border-0 shadow-none text-primary"
                            type="minimal"
                        >
                            <AtlanIcon icon="Add" class="w-auto h-4 mr-1" />Add
                        </a-button>
                    </template>
                </AddResource>
            </div>
        </template>
        <section :class="{ 'overflow-y-auto': resources?.length }">
            <template v-if="!resources?.length">
                <template v-if="$slots?.placeholder">
                    <slot name="placeholder" />
                    <div>
                        <AddResource @add="addCallback">
                            <template #trigger>
                                <AtlanButton2
                                    class="mx-auto"
                                    size="large"
                                    label="Add Resource"
                                />
                            </template>
                        </AddResource>
                    </div>
                </template>
                <div
                    v-else
                    class="flex flex-col items-center justify-center h-48 gap-y-6"
                >
                    <div class="w-24">
                        <AtlanIcon
                            icon="EmptyResource2"
                            alt="EmptyResource"
                            class="w-full h-full"
                        />
                    </div>
                    <p class="w-1/3 text-sm text-center">
                        {{ placeholder }}
                    </p>
                </div>
            </template>
            <template v-else>
                <div
                    class="grid gap-3 p-5"
                    :class="{
                        'grid-cols-1': minimal,
                        'grid-cols-2': !minimal,
                    }"
                >
                    <div
                        v-for="(l, x) in sortResources(resources)"
                        :key="l.uniqueAttributes.qualifiedName"
                        class="flex-grow"
                    >
                        <LinkPreviewCard
                            v-if="
                                getPreviewComponent(l.attributes.link) ===
                                'link'
                            "
                            :link="l"
                            class="h-full"
                            :assetType="assetType"
                        />
                        <SlackPreview
                            v-else
                            :ref="`SlackPreview-${x}`"
                            :link="l"
                            :assetType="assetType"
                        />
                    </div>
                    <template
                        v-if="
                            hasAtleastOneSlackLink &&
                            !userSlackStatus.configured &&
                            tenantSlackStatus.configured &&
                            minimal
                        "
                    >
                        <SlackUserLoginTrigger />
                    </template>
                </div>
            </template>
        </section>
    </div>
</template>

<script setup lang="ts">
    import {
        defineComponent,
        PropType,
        computed,
        toRefs,
        defineAsyncComponent,
        ref,
        provide,
        inject,
    } from 'vue'
    import SlackUserLoginTrigger from '@common/integrations/slack/slackUserLoginTriggerCard.vue'
    import {
        isSlackLink,
        openSlackOAuth,
    } from '~/composables/integrations/slack/useSlack'
    import EmptyScreen from '@/common/empty/index.vue'
    import SlackConnect from './misc/connectSlackCard.vue'
    import LinkPreviewCard from '@/common/widgets/resources/previewCard/linkPreviewCard.vue'
    import SlackPreview from '@/common/widgets/resources/previewCard/slackPreview.vue'
    import AddResource from '@/common/widgets/resources/resourceInputModal.vue'
    import PreviewTabsIcon from '~/components/common/icon/previewTabsIcon.vue'

    import integrationStore from '~/store/integrations/index'
    import { Link } from '~/types/resources.interface'

    const props = defineProps({
        resources: {
            type: Array as PropType<Link[]>,
            required: true,
        },
        addStatus: {
            type: String,
            required: true,
        },
        updateStatus: {
            type: String,
            required: true,
        },
        removeStatus: {
            type: String,
            required: true,
        },
        entityName: {
            type: String,
            required: false,
            default: '',
        },
        assetType: {
            type: String,
            required: false,
            default: '',
        },
        placeholder: {
            type: String,
            required: true,
        },
        readOnly: {
            type: Boolean,
            required: false,
            default: true,
        },
        tab: {
            type: Object,
            required: false,
            default: () => ({}),
        },
    })
    const emit = defineEmits(['add', 'update', 'remove'])

    const wrapper = ref()

    const minimal = computed(() => wrapper.value?.clientWidth < 500)

    const {
        addStatus,
        resources,
        updateStatus,
        removeStatus,
        entityName,
        readOnly,
        tab,
    } = toRefs(props)

    const addCallback = (r) => emit('add', r)
    const updateCallback = (r) => emit('update', r)
    const removeCallback = (id) => emit('remove', id)

    provide('add', addCallback)
    provide('addStatus', addStatus)
    provide('update', updateCallback)
    provide('updateStatus', updateStatus)
    provide('remove', removeCallback)
    provide('removeStatus', removeStatus)
    provide('entityName', entityName)
    provide('readOnly', readOnly)
    provide('tab', tab)

    const store = integrationStore()
    const { tenantSlackStatus, userSlackStatus } = toRefs(store)

    /* eslint-disable no-underscore-dangle */
    const sortResources = (_resources) =>
        _resources?.sort((a, b) =>
            (a.attributes.__modificationTimestamp ?? a.attributes.__timestamp) >
            (b.attributes.__modificationTimestamp ?? b.attributes.__timestamp)
                ? -1
                : 1
        )

    const hasAtleastOneSlackLink = computed(() => {
        const slackLink = resources.value?.some((link) =>
            isSlackLink(link.attributes.link)
        )
        return slackLink
    })

    const getPreviewComponent = (url) => {
        if (
            isSlackLink(url) &&
            tenantSlackStatus.value.configured &&
            userSlackStatus.value.configured
        ) {
            return 'slack'
        }
        return 'link'
    }
</script>

<style scoped lang="less"></style>
