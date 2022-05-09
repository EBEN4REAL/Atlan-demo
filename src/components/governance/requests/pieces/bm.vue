<template>
    <div>
        <div v-if="showLabel" class="pr-2 mt-1 text-gray-500">
            Custom Metadata Update
        </div>
        <a-popover placement="bottomLeft">
            <template #content>
                <div class="p-2 rounded-md">
                    <div
                        class="p-2"
                        v-for="a in applicableList"
                        :key="a?.displayName"
                    >
                        <div class="flex mb-1 font-normal text-gray-500">
                            {{ a?.displayName }}
                            <a-tooltip>
                                <template #title>
                                    <span>{{ a?.options?.description }}</span>
                                </template>
                                <div class="">
                                    <AtlanIcon
                                        v-if="a?.options?.description"
                                        class="h-4 mb-1 ml-2 text-gray-400 hover:text-gray-500"
                                        icon="Info"
                                    />
                                </div>
                            </a-tooltip>
                        </div>

                        <ReadOnly :attribute="a" />
                    </div>
                </div>
            </template>

            <div class="py-1 rounded-full cursor-pointer w-40 flex items-center">
                <PreviewTabsIcon
                    :icon="iconInfo?.icon"
                    :image="iconInfo?.image"
                    :emoji="iconInfo?.emoji"
                    height="h-4"
                    width="w-4"
                    class="mr-1"
                    :display-mode="true"
                    emoji-size="text-md"
                />

                <Truncate
                    :tooltip-text="label"
                    placement="left"
                    :should-open-in-new-tab="true"
                    v-bind="
                        checkAccess(page.PAGE_GOVERNANCE)
                            ? {
                                  routeTo: `/governance/custom-metadata/${guid}`,
                              }
                            : {}
                    "
                    :classes="'hover:text-primary hover:underline'"
                />
            </div>
        </a-popover>
    </div>
</template>

<script lang="ts">
    import {
        defineAsyncComponent,
        defineComponent,
        computed,
        ref,
        onMounted,
    } from 'vue'
    // composables
    import useCustomMetadataHelpers from '~/composables/custommetadata/useCustomMetadataHelpers'
    import useCustomMetadataFacet from '~/composables/custommetadata/useCustomMetadataFacet'
    import useAuth from '~/composables/auth/useAuth'
    import page from '~/constant/accessControl/page'
    import Truncate from '@/common/ellipsis/index.vue'
    import PreviewTabsIcon from '~/components/common/icon/previewTabsIcon.vue'

    export default defineComponent({
        components: {
            Truncate,
            PreviewTabsIcon,
            ReadOnly: defineAsyncComponent(
                () =>
                    import(
                        '@/common/assets/preview/customMetadata/readOnly.vue'
                    )
            ),
        },
        props: {
            data: {
                type: Object,
                required: true,
            },
            showLabel: {
                type: Boolean,
                required: false,
                default: () => true,
            },
        },
        setup(props) {
            const {
                getDatatypeOfAttribute,
                isLink,
                formatDisplayValue,
                getApplicableAttributes,
                getEnumOptions,
                getHumanTypeName,
            } = useCustomMetadataHelpers()

            const { checkAccess } = useAuth()
            const iconInfo = ref({ image: '', emoji: '' })
            const attributeNames = ref(
                Object.keys(props.data?.payload)?.map((i) => i)
            )

            const label = ref(props?.data?.destinationAttribute)
            const guid = ref(props?.data?.destinationAttribute)
            const applicableList = ref()
            const { getList: cmList } = useCustomMetadataFacet()
            const getAttributes = () => {
                const list = cmList(props.data?.entityType).filter(
                    (el) => el?.id === props.data?.destinationAttribute
                )
                console.log(list[0])
                if (list[0]?.label) {
                    label.value = list[0].label
                }
                if (list[0]?.guid) {
                    guid.value = list[0].guid
                }
                if (list[0]?.options) {
                    iconInfo.value.image =
                        list[0]?.options?.imageId || list[0]?.options?.logoUrl
                    iconInfo.value.emoji = list[0]?.options?.emoji
                }

                applicableList.value = getApplicableAttributes(
                    list[0],
                    props.data?.entityType
                )
                applicableList.value?.forEach((i, index) => {
                    if (attributeNames.value?.includes(i?.name)) {
                        applicableList.value[index].value =
                            props.data?.payload[i?.name]
                    }
                })
            }
            onMounted(getAttributes)

            return {
                applicableList,
                label,
                checkAccess,
                page,
                guid,
                iconInfo
            }
        },
    })
</script>

<style lang="less"></style>
