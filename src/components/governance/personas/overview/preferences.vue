<template>
    <div class="p-6 overflow-y-scroll container-preferences">
        <a-collapse
            v-model="activeKey"
            :bordered="false"
            expand-icon-position="right"
            class="bg-red"
        >
            <a-collapse-panel key="1" class="rounded-lg panel">
                <template #header>
                    <div class="px-3 py-1">
                        <div class="text-base font-bold text-gray-700">
                            Custom Metadata
                        </div>
                        <div class="mt-1 text-sm text-gray-500">
                            Select the custom metadata that should be visible to
                            Data consultant persona
                        </div>
                    </div>
                </template>
                <div class="p-4">
                    <div
                        v-for="meta in metaList"
                        :key="meta.guid"
                        class="flex justify-between p-3 border-b border-gray-200"
                    >
                        <div class="flex">
                            <CustomMetadataAvatar
                                class="mr-2"
                                :metadata="meta"
                                :internal="
                                    ['true', true].includes(
                                        meta?.options?.isLocked
                                    )
                                "
                                size="16px"
                            />

                            <span class="text-sm text-primary">{{
                                meta.displayName
                            }}</span>
                        </div>
                        <a-switch
                            :checked="metaSwitchValue[meta.guid]"
                            :disabled="isLoadingMeta"
                            :loading="
                                isLoadingMeta && currentIdUpdated === meta.guid
                            "
                            @click="handleSwitch(meta.guid)"
                        />
                    </div>
                </div>
            </a-collapse-panel>
        </a-collapse>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, computed } from 'vue'
    import { message } from 'ant-design-vue'
    import useBusinessMetadata from '@/governance/custom-metadata/composables/useBusinessMetadata'
    import CustomMetadataAvatar from '@/governance/custom-metadata/CustomMetadataAvatar.vue'
    import {
        savePersona,
        selectedPersonaDirty,
        updatedSelectedData,
    } from '../composables/useEditPersona'

    export default defineComponent({
        name: 'Preferences',
        components: { CustomMetadataAvatar },
        props: {},
        emits: [],
        setup(props) {
            const activeKey = ref('')
            const { finalBusinessMetadataList } = useBusinessMetadata()
            const isLoadingMeta = ref(false)
            const currentIdUpdated = ref('')
            const metaList = computed(() => finalBusinessMetadataList.value)
            const metaSwitchValue = computed(() => {
                let objMeta = {}
                const meta =
                    selectedPersonaDirty.value?.attributes?.preferences
                        ?.custom_metadata || []
                meta.forEach((el) => {
                    objMeta = { ...objMeta, ...el }
                })
                return objMeta
            })
            const metaKey = computed(() =>
                [...finalBusinessMetadataList.value].map((el) => ({
                    [el.guid]: metaSwitchValue.value[el.guid] || false,
                }))
            )
            const handleUpdateMeta = async (guid) => {
                isLoadingMeta.value = true
                const payload = {
                    ...selectedPersonaDirty.value,
                }
                delete payload.dataPolicies
                delete payload.glossaryPolicies
                delete payload.metadataPolicies
                const metaKeys = [...metaKey.value].map((el) => {
                    const id = Object.keys(el)[0]
                    if (id === guid) {
                        return { [guid]: !el[id] }
                    }
                    return el
                })
                try {
                    await savePersona({
                        ...payload,
                        attributes: {
                            ...payload.attributes,
                            preferences: {
                                custom_metadata: metaKeys,
                            },
                        },
                    })
                    updatedSelectedData({
                        id: payload.id,
                        attributes: {
                            ...payload.attributes,
                            preferences: {
                                custom_metadata: metaKeys,
                            },
                        },
                    })
                } catch (error) {
                    message.error({
                        content: 'Failed to update',
                    })
                } finally {
                    isLoadingMeta.value = false
                }
            }
            const handleSwitch = (guid) => {
                currentIdUpdated.value = guid
                handleUpdateMeta(guid)
            }
            return {
                activeKey,
                finalBusinessMetadataList,
                handleUpdateMeta,
                handleSwitch,
                isLoadingMeta,
                currentIdUpdated,
                metaList,
                metaSwitchValue,
            }
        },
    })
</script>
<style lang="less">
    .container-preferences {
        max-height: 70vh;
    }
    .panel {
        box-shadow: 0px 8px 24px 0px #1920380a;

        .ant-collapse-header {
            @apply bg-white;
        }
        .ant-collapse-content-box {
            @apply pb-0;
        }
    }
</style>
