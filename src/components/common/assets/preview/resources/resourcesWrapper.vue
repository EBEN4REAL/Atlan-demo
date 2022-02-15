<template>
    <ResourcesWidget
        class="px-5 pt-4"
        :resources="resources"
        :add-status="addStatus"
        :update-status="updateStatus"
        :remove-status="removeStatus"
        placeholder="Resources is the place to document all knowledge
                    around the asset"
        :read-only="!linkEditPermission"
        :entity-name="selectedAsset.displayText"
        @add="handleAdd"
        @update="handleUpdate"
        @remove="handleRemove"
    >
        <template #title>
            <span class="font-semibold text-gray-500"> Resources </span>
        </template>
        <template #placeholder>
            <Placeholder />
        </template>
    </ResourcesWidget>
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
    import { whenever } from '@vueuse/core'
    import ResourcesWidget from '@/common/widgets/resources/resourcesWidget.vue'
    import Placeholder from '@/common/assets/preview/resources/placeholder.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import updateAssetAttributes from '~/composables/discovery/updateAssetAttributes'

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

    const { links, selectedAssetUpdatePermission, assetPermission } =
        useAssetInfo()

    const {
        handleAddResource,
        localResource,
        handleUpdateResource,
        handleResourceDelete,
    } = updateAssetAttributes(selectedAsset)

    // eslint-disable-next-line arrow-body-style
    const resources = computed(() => {
        return links(selectedAsset.value)?.sort((a, b) =>
            // eslint-disable-next-line no-underscore-dangle
            a.attributes.__timestamp < b.attributes.__timestamp ? -1 : 1
        )
    })

    const linkEditPermission = computed(
        () =>
            selectedAssetUpdatePermission(
                selectedAsset.value,
                isDrawer.value,
                'RELATIONSHIP_ADD',
                'Link'
            ) && assetPermission('CREATE_LINK')
    )

    const addStatus = ref('')
    const handleAdd = async (link) => {
        addStatus.value = 'loading'
        try {
            localResource.value.title = link.attributes.name
            localResource.value.link = link.attributes.link
            await handleAddResource()
            addStatus.value = 'success'
        } catch (error) {
            addStatus.value = 'error'
        }
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
