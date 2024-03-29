<template>
    <ResourcesWidget
        :ref="resourcesWidget"
        :resources="resources"
        :add-status="addStatus"
        :update-status="updateStatus"
        :remove-status="removeStatus"
        placeholder="Resources is the place to document all knowledge
                    around the asset"
        :read-only="!linkEditPermission"
        :entity-name="
            selectedAsset.displayText || selectedAsset.attributes.qualifiedName
        "
        :asset-type="selectedAsset.typeName"
        :show-slack-switch-banner="showSlackSwitchBanner"
        :slack-link-count="slackLinkCount"
        @add="handleAdd"
        @update="handleUpdate"
        @remove="handleRemove"
        @switchTab="handleSwitchTab"
    >
        <template #placeholder>
            <Placeholder />
        </template>
    </ResourcesWidget>
</template>

<script setup lang="ts">
    import { PropType, computed, toRefs, ref, inject } from 'vue'
    import { whenever, watchOnce } from '@vueuse/core'
    import ResourcesWidget from '@/common/widgets/resources/resourcesWidget.vue'
    import Placeholder from '@/common/assets/preview/resources/placeholder.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import updateAssetAttributes from '~/composables/discovery/updateAssetAttributes'
    import { getDomain } from '~/utils/url'
    import integrationStore from '~/store/integrations/index'
    import { resourceId } from '~/composables/integrations/slack/useAskAQuestion'

    const props = defineProps({
        selectedAsset: {
            type: Object as PropType<assetInterface>,
            required: true,
        },
        isDrawer: {
            type: Boolean,
            required: false,
            default: false,
        },
    })

    const { selectedAsset, isDrawer } = toRefs(props)
    const resourcesWidget = ref()
    const store = integrationStore()
    const { tenantSlackStatus } = toRefs(store)

    const { links, selectedAssetUpdatePermission, assetPermission } =
        useAssetInfo()

    const {
        handleAddResource,
        localResource,
        handleUpdateResource,
        handleResourceDelete,
    } = updateAssetAttributes(selectedAsset, isDrawer.value)

    // eslint-disable-next-line arrow-body-style
    const resources = computed(() => {
        if (tenantSlackStatus.value.configured)
            return links(selectedAsset.value)?.filter(
                (l) => getDomain(l.attributes.link) !== 'slack.com'
            )
        return links(selectedAsset.value)
    })

    const slackLinkCount = computed(() => {
        const slackLink = links(selectedAsset.value)?.filter(
            (l) => getDomain(l.attributes.link) === 'slack.com'
        ).length
        return slackLink
    })

    const showSlackSwitchBanner = computed(
        () => tenantSlackStatus.value.configured && slackLinkCount.value
    )

    const linkEditPermission = computed(
        () =>
            selectedAssetUpdatePermission(
                selectedAsset.value,
                isDrawer.value,
                'RELATIONSHIP_ADD',
                'Link'
            ) && assetPermission('CREATE_LINK')
    )
    const switchTab = inject('switchTab') as Function

    const addStatus = ref('')
    const handleAdd = async (link) => {
        addStatus.value = 'loading'
        try {
            localResource.value.title = link.attributes.name
            localResource.value.link = link.attributes.link
            const res = await handleAddResource()
            addStatus.value = 'success'
            // ? if the created link is slack , redirect to slack tab
            if (
                getDomain(link.attributes.link) === 'slack.com' &&
                tenantSlackStatus.value.configured
            )
                watchOnce(
                    () => links(selectedAsset.value),
                    () => {
                        switchTab(selectedAsset.value, 'Slack')
                        const createdResourceGuid =
                            res?.mutatedEntities?.CREATE[0]?.guid
                        if (createdResourceGuid)
                            resourceId.value = createdResourceGuid
                    }
                )
        } catch (error) {
            addStatus.value = 'error'
        }
    }

    const handleSwitchTab = (tab) => {
        switchTab(selectedAsset.value, tab || 'Slack')
    }

    const updateStatus = ref('')
    const handleUpdate = async (link) => {
        updateStatus.value = 'loading'
        try {
            localResource.value.title = link.attributes.name
            localResource.value.link = link.attributes.link
            await handleUpdateResource(link)
            updateStatus.value = 'success'
        } catch (error) {
            console.log({ error })
            updateStatus.value = 'error'
        }
    }
    const removeStatus = ref('')
    const handleRemove = async (link) => {
        const { error, isLoading, isReady } = handleResourceDelete(link)
        removeStatus.value = 'loading'
        whenever(error, () => {
            removeStatus.value = 'error'
        })

        whenever(isReady, () => {
            removeStatus.value = 'success'
        })
    }
</script>

<style scoped></style>
