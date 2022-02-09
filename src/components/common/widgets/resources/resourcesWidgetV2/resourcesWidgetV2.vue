<template>
    <div class="w-full space-y-3">
        <div class="flex justify-between gap-x-6">
            <div>
                <AtlanIcon icon="Resources2" class="w-auto h-8 mr-3" />
                <span class="text-base font-bold text-gray"> Resources </span>
            </div>
            <div class="flex-grow"></div>
            <template
                v-if="
                    hasAtleastOneSlackLink &&
                    !userSlackStatus.configured &&
                    tenantSlackStatus.configured
                "
            >
                <div
                    class="flex items-center px-2 text-xs bg-gray-100 border rounded gap-x-2"
                >
                    <div class="p-1 bg-white rounded">
                        <AtlanIcon icon="Slack" class="h-3.5" />
                    </div>
                    <span>See rich preview for Slack links.</span>
                    <span
                        class="cursor-pointer text-primary hover:underline"
                        @click="() => openSlackOAuth({ emit: $emit })"
                    >
                        Connect
                    </span>
                </div>
            </template>
            <AddResource @add="addCallback">
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
        <section>
            <template v-if="!resources?.length">
                <div
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
                <div class="grid grid-cols-2 gap-3">
                    <div v-for="l in resources" :key="l.qualifiedName">
                        <LinkPreviewCard
                            style="min-height: 80px"
                            v-if="getPreviewComponent(l.url) === 'link'"
                            :link="l"
                        />
                        <SlackPreview
                            style="min-height: 80px"
                            v-else
                            :link="l"
                        />
                    </div>
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
    import { isSlackLink } from '~/composables/integrations/useSlack'
    import { openSlackOAuth } from '~/composables/integrations/useSlack'
    import EmptyScreen from '@/common/empty/index.vue'
    import LinkPreviewCard from '@/common/widgets/resources/resourcesWidgetV2/linkPreviewCard.vue'
    import SlackPreview from '@/common/widgets/resources/resourcesWidgetV2/slackPreview.vue'
    import AddResource from '@/common/widgets/resources/resourcesWidgetV2/resourceInputModal.vue'

    import integrationStore from '~/store/integrations/index'
    import { Link } from '~/types/resources.interface'
    import propertyListVue from '~/components/governance/custom-metadata/propertyList.vue'

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
