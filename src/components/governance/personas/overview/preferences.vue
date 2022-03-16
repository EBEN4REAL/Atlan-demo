<template>
    <div class="p-6 overflow-y-scroll container-preferences">
        <a-collapse
            v-model="activeKey"
            :bordered="false"
            expand-icon-position="right"
            class="bg-red"
        >
            <template #expandIcon="props">
                <AtlanIcon
                    :icon="props.isActive ? 'ChevronUp' : 'ChevronDown'"
                    class="absolute text-gray-700 right-6"
                />
            </template>
            <a-collapse-panel key="1" class="rounded-lg panel">
                <template #header>
                    <div class="px-3 py-1">
                        <div class="text-base font-bold text-gray-700">
                            Custom Metadata
                            <a-popover placement="right">
                                <template #content>
                                    <div class="p-2 bg-gray-700 rounded-lg">
                                        <img :src="gifCM" class="w-64 h-52" />
                                    </div>
                                </template>
                                <AtlanIcon
                                    icon="WarningIcon"
                                    class="ml-1 text-primary"
                                />
                            </a-popover>
                        </div>
                        <div class="mt-1 text-sm text-gray-500">
                            Select the custom metadata that should be visible to
                            Data consultant persona
                        </div>
                    </div>
                </template>
                <div class="p-4">
                    <div
                        v-for="(meta, idx) in customMetadataList"
                        :key="meta.guid"
                        :class="`flex justify-between p-3 ${
                            idx !== customMetadataList.length - 1 && 'border-b'
                        }  border-gray-200`"
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
            <!-- <a-collapse-panel key="2" class="mt-4 rounded-lg panel">
                <template #header>
                    <div class="px-3 py-1">
                        <div class="text-base font-bold text-gray-700">
                            Asset Sidebar
                        </div>
                        <div class="mt-1 text-sm text-gray-500">
                            Select the sidebar tabs that should be visible to
                            Data consultant persona
                        </div>
                    </div>
                </template>
                <div class="p-4">
                    <div
                        v-for="(item, idx) in assetSidebarListComputed"
                        :key="item.name"
                        :class="`flex justify-between p-3 ${
                            idx !== assetSidebarListComputed.length - 1 &&
                            'border-b'
                        }  border-gray-200`"
                    >
                        <div class="flex">
                            <AtlanIcon
                                :icon="item.icon"
                                class="mr-2 text-gray-500"
                            />
                            <span class="text-sm text-gray-700">{{
                                item.name
                            }}</span>
                        </div>
                        <a-switch />
                    </div>
                </div>
            </a-collapse-panel> -->
        </a-collapse>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, computed } from 'vue'
    import { message } from 'ant-design-vue'
    import useBusinessMetadata from '@/governance/custom-metadata/composables/useBusinessMetadata'
    import CustomMetadataAvatar from '@/governance/custom-metadata/CustomMetadataAvatar.vue'
    import gifCM from '~/assets/gifs/Preferences/CM_Preferences.gif'
    import {
        savePersona,
        selectedPersonaDirty,
        updatedSelectedData,
    } from '../composables/useEditPersona'
    import { assetSidebarList } from '../composables/usePreferences'

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
            const customMetadataList = computed(
                () => finalBusinessMetadataList.value
            )
            const assetSidebarListComputed = computed(() => assetSidebarList)
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
                customMetadataList,
                metaSwitchValue,
                assetSidebarListComputed,
                gifCM,
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
            border-radius: 8px !important;
            @apply bg-white;
        }
        .ant-collapse-content-box {
            @apply pb-0;
        }
    }
</style>
