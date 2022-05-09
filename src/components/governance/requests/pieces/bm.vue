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

            <div class="py-1 rounded-full cursor-pointer w-40">
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
    import Pill from '~/components/UI/pill/pill.vue'
    // composables
    import useCustomMetadataHelpers from '~/composables/custommetadata/useCustomMetadataHelpers'
    import useCustomMetadataFacet from '~/composables/custommetadata/useCustomMetadataFacet'
    import useAuth from '~/composables/auth/useAuth'
    import page from '~/constant/accessControl/page'
    import SingleTab from '@/common/input/customMetadata/singleTab.vue'
    import Truncate from '@/common/ellipsis/index.vue'

    export default defineComponent({
        components: {
            Pill,
            Truncate,
            SingleTab,
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
            const attributeNames = ref(
                Object.keys(props.data?.payload)?.map((i) => i)
            )

            const label = ref(props?.data?.destinationAttribute)
            const guid = ref(props?.data?.destinationAttribute)
            const applicableList = ref()
            console.log(attributeNames.value)
            const { getList: cmList } = useCustomMetadataFacet()
            console.log(cmList(props.data?.entityType))
            const getAttributes = () => {
                const list = cmList(props.data?.entityType).filter(
                    (el) => el?.id === props.data?.destinationAttribute
                )
                if (list[0]?.label) {
                    label.value = list[0].label
                }
                if (list[0]?.guid) {
                    guid.value = list[0].guid
                }
                applicableList.value = getApplicableAttributes(
                    list[0],
                    props.data?.entityType
                )
                applicableList.value?.forEach((i, index) => {
                    if (attributeNames.value?.includes(i?.name)) {
                        console.log(props.data?.payload[i?.name])
                        console.log(applicableList.value[index])
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
            }
        },
    })
</script>

<style lang="less"></style>
