<template>
    <div class="w-full">
        <div class="flex justify-between">
            <h1 class="font-bold">Resources</h1>
            <AddResource @add="addCallback" @update="handleUpdate">
                <template #trigger>
                    <AtlanButton
                        class="flex-none px-2 rounded-full"
                        size="sm"
                        color="secondary"
                        padding="compact"
                    >
                        <AtlanIcon icon="Add" class="w-4 text-gray-400" />
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
                <div class="grid grid-cols-2 gap-2">
                    <template v-for="l in resources" :key="l.qualifiedName">
                        <LinkPreviewCard
                            v-if="getPreviewComponent(l.url) === 'link'"
                            :link="l"
                        />
                        <SlackPreview v-else :link="l" />
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
    import { isSlackLink } from '~/composables/integrations/useSlack'
    import EmptyScreen from '@/common/empty/index.vue'
    import LinkPreviewCard from '@/common/widgets/resources/resourcesWidgetV2/linkPreviewCard.vue'
    import SlackPreview from '@/common/widgets/resources/resourcesWidgetV2/slackPreview.vue'
    import AddResource from '@/common/widgets/resources/resourcesWidgetV2/resourceInputModal.vue'

    import integrationStore from '~/store/integrations/index'
    import { Link } from '~/types/resources.interface'

    const props = defineProps({
        resources: {
            type: Array as PropType<Link[]>,
            required: true,
        },
    })
    const emit = defineEmits(['add', 'update', 'remove'])

    const addCallback = (r) => emit('add', r)
    const updateCallback = (r) => emit('update', r)
    const deleteCallback = (id) => emit('remove', id)

    provide('add', addCallback)
    provide('update', updateCallback)
    provide('delete', deleteCallback)

    const store = integrationStore()
    const { tenantSlackStatus, userSlackStatus } = toRefs(store)

    function getPreviewComponent(url) {
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
