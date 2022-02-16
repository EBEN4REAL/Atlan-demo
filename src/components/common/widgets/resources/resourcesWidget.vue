<template>
    <div ref="wrapper" class="w-full space-y-3">
        <template
            v-if="$slots?.placeholder && !resources?.length ? false : true"
        >
            <div class="flex justify-between gap-x-6">
                <template v-if="$slots?.title">
                    <slot name="title" />
                </template>
                <div v-else>
                    <AtlanIcon icon="Resources2" class="w-auto h-8 mr-3" />
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
                <AddResource @add="addCallback" v-if="!readOnly">
                    <template #trigger>
                        <AtlanButton
                            class="flex-none px-2"
                            size="sm"
                            color="secondary"
                            padding="compact"
                        >
                            <AtlanIcon icon="Add" class="text-gray-400" />
                        </AtlanButton>
                    </template>
                </AddResource>
            </div>
        </template>
        <section>
            <template v-if="!resources?.length">
                <template v-if="$slots?.placeholder">
                    <slot name="placeholder" />
                    <div class="mt-5">
                        <AddResource @add="addCallback">
                            <template #trigger>
                                <AtlanButton class="mx-auto"
                                    >Add Resource</AtlanButton
                                >
                            </template>
                        </AddResource>
                    </div>
                </template>
                <div
                    v-else
                    class="flex flex-col items-center justify-center h-40 gap-y-6"
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
                    class="grid gap-3"
                    :class="{
                        'grid-cols-1': minimal,
                        'grid-cols-2': !minimal,
                    }"
                >
                    <div
                        v-for="l in resources"
                        :key="l.qualifiedName"
                        class="flex-grow"
                    >
                        <LinkPreviewCard
                            v-if="
                                getPreviewComponent(l.attributes.link) ===
                                'link'
                            "
                            :link="l"
                            class="h-full"
                        />
                        <SlackPreview v-else :link="l" />
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
    } from 'vue'
    import {
        isSlackLink,
        openSlackOAuth,
    } from '~/composables/integrations/useSlack'
    import EmptyScreen from '@/common/empty/index.vue'
    import SlackConnect from './misc/connectSlackCard.vue'
    import LinkPreviewCard from '@/common/widgets/resources/previewCard/linkPreviewCard.vue'
    import SlackPreview from '@/common/widgets/resources/previewCard/slackPreview.vue'
    import AddResource from '@/common/widgets/resources/resourceInputModal.vue'
    import SlackUserLoginTrigger from '@common/integrations/slack/slackUserLoginTriggerCard.vue'

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
        placeholder: {
            type: String,
            required: true,
        },
        readOnly: {
            type: Boolean,
            required: false,
            default: true,
        },
    })
    const emit = defineEmits(['add', 'update', 'remove'])

    const wrapper = ref()

    const minimal = computed(() => wrapper.value?.clientWidth < 500)
    // const placeholderVisible = computed(() => !resources.value?.length)

    const {
        addStatus,
        resources,
        updateStatus,
        removeStatus,
        entityName,
        readOnly,
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

    const store = integrationStore()
    const { tenantSlackStatus, userSlackStatus } = toRefs(store)

    const hasAtleastOneSlackLink = computed(() => {
        const slackLink = resources.value.some((link) =>
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

<style scoped></style>
