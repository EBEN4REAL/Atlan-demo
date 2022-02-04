<template>
    <div class="w-full">
        <div class="flex justify-between">
            <h1 class="font-bold">Resources</h1>
            <AddResources @add="(r) => $emit('add', r)" @update="handleUpdate">
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
            </AddResources>
        </div>
        <section>
            <template v-if="!resources?.length">
                <div class="flex flex-col items-center">
                    <EmptyScreen desc="No Resources found." />
                </div>
            </template>
            <template v-else>
                <div class="grid grid-cols-2">
                    <template v-for="l in resources" :key="l.attributes.link">
                        <ResourcePreview
                            v-if="
                                getPreviewComponent(l.attributes.link) ===
                                'link'
                            "
                            :resource="l"
                        />
                        <SlackPreview v-else :resource="l" />
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
    } from 'vue'
    import { isSlackLink } from '~/composables/integrations/useSlack'
    import EmptyScreen from '@/common/empty/index.vue'
    import ResourcePreview from './resourcePreview.vue'
    import SlackPreview from './slackPreview.vue'
    import AddResources from './addResource.vue'
    import integrationStore from '~/store/integrations/index'

    const props = defineProps({
        resources: {
            type: Array,
            required: true,
        },
    })
    const emit = defineEmits(['add', 'update'])
    const store = integrationStore()
    const { tenantSlackStatus, userSlackStatus } = toRefs(store)

    const handleAdd = (r) => {
        console.log('handleAdd', r)
        emit('add', r)
    }

    const handleUpdate = (r) => {
        console.log('handleUpdate', r)
        emit('update', r)
    }

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
