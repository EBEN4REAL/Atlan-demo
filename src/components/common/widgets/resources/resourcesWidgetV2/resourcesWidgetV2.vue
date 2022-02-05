<template>
    <div class="w-full space-y-3">
        <div class="flex justify-between">
            <h1 class="font-bold">Resources</h1>
            <AddResource @add="addCallback">
                <template #trigger>
                    <AtlanButton
                        class="flex-none px-2 rounded-full"
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
                <div class="flex flex-col items-center">
                    <EmptyScreen desc="No Resources found." />
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
        },
    })
    const emit = defineEmits(['add', 'update', 'remove'])

    const { addStatus, updateStatus, removeStatus, entityName } = toRefs(props)

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

    const store = integrationStore()
    const { tenantSlackStatus, userSlackStatus } = toRefs(store)

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
