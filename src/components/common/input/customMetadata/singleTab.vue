<template>
    <div
        v-if="applicableList"
        ref="target"
        class="flex flex-col w-full overflow-hidden border border-transparent rounded-lg"
        :class="{ 'mb-1': activeKey.includes(['1'].toString()) }"
        @mouseenter="showEditButton = true"
        @mouseleave="showEditButton = false"
    >
        <a-collapse
            v-model:activeKey="activeKey"
            :class="$style.cmTab"
            :bordered="false"
            ghost
            @change="handleActiveKeyChange"
        >
            <a-collapse-panel key="1" :show-arrow="false">
                <template #header>
                    <!-- header starts here -->
                    <div
                        class="flex items-center justify-between w-full px-3 py-2.5 group"
                        :class="
                            activeKey.includes(['1'].toString()) ||
                            showEditButton
                                ? 'bg-gray-100'
                                : 'bg-white'
                        "
                    >
                        <span class="flex items-center">
                            <PreviewTabsIcon
                                :icon="tab.icon"
                                :image="tab.image"
                                :emoji="tab.emoji"
                                height="h-4"
                                width="w-4"
                                class="mr-1"
                                :class="{
                                    'mb-0.5': tab.icon || tab.image,
                                    'mr-1': tab.emoji,
                                }"
                                :display-mode="true"
                                emoji-size="text-base"
                            />
                            <Truncate
                                :tooltip-text="data.label"
                                placement="left"
                                :should-open-in-new-tab="true"
                                :classes="
                                    selectedAssetUpdatePermission(
                                        selectedAsset,
                                        isDrawer,
                                        'ENTITY_UPDATE_BUSINESS_METADATA'
                                    )
                                        ? 'text-primary hover:underline mr-1 font-semibold'
                                        : 'mr-1 line-clamp-1'
                                "
                                @click="switchTab(selectedAsset, data?.label)"
                                clamp-percentage="80%"
                            />
                            <a-tooltip>
                                <template #title>
                                    <span>{{ data?.description }}</span>
                                </template>
                                <div class="flex items-center">
                                    <AtlanIcon
                                        v-if="data?.description"
                                        class="text-gray-400 hover:text-gray-500 mb-0.5"
                                        icon="Info"
                                    />
                                </div>
                            </a-tooltip>
                        </span>
                        <div class="flex items-center">
                            <div
                                v-if="
                                    selectedAssetUpdatePermission(
                                        selectedAsset,
                                        isDrawer,
                                        'ENTITY_UPDATE_BUSINESS_METADATA'
                                    ) &&
                                    !viewOnly &&
                                    showEditButton
                                "
                                class="mr-3 font-normal cursor-pointer hover:underline text-primary"
                                @click="
                                    switchTab(selectedAsset, data?.label, true)
                                "
                            >
                                Edit
                            </div>
                            <AtlanIcon icon="CaretDown" class="text-gray-700" />
                        </div>
                    </div>
                    <!-- header ends here -->
                </template>
                <template v-if="data?.options?.isLocked === 'true'">
                    <div
                        class="flex items-center p-2 mx-5 my-2 text-xs rounded gap-x-2 bg-primary-light text-primary"
                    >
                        <InternalCMBanner />
                    </div>
                </template>

                <div v-if="loading || isEvaluating" class="p-2">
                    <a-skeleton
                        :loading="true"
                        active
                        class="w-full"
                        :title="false"
                        :paragraph="{ rows: 2 }"
                    />
                </div>

                <div
                    v-else
                    class="flex flex-col flex-grow px-3 overflow-y-auto"
                    :class="
                        activeKey.includes(['1'].toString()) || showEditButton
                            ? 'bg-gray-100'
                            : 'bg-white'
                    "
                >
                    <!-- showing non empty starts here -->
                    <template v-for="(a, x) in applicableList" :key="x">
                        <div :class="hasValue(a) ? 'my-1.5' : 'mt-1.5'">
                            <div class="flex mb-1 font-normal text-gray-500">
                                <Truncate
                                    :tooltip-text="a.displayName"
                                    :rows="1"
                                    width="500px"
                                    placement="left"
                                    classes="text-gray-500"
                                />
                                <a-tooltip>
                                    <template #title>
                                        <span>{{ a.options.description }}</span>
                                    </template>
                                    <div class="">
                                        <AtlanIcon
                                            v-if="a.options.description"
                                            class="h-4 mb-1 ml-2 text-gray-400 hover:text-gray-500"
                                            icon="Info"
                                        />
                                    </div>
                                </a-tooltip>
                            </div>

                            <ReadOnly :attribute="a" />
                        </div>
                    </template></div></a-collapse-panel
        ></a-collapse>
    </div>
    <hr
        v-if="applicableList && !activeKey.includes(['1'].toString())"
        class="mx-3"
    />
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        toRefs,
        PropType,
        defineAsyncComponent,
        inject,
    } from 'vue'
    import { whenever } from '@vueuse/core'
    import useCustomMetadataHelpers from '~/composables/custommetadata/useCustomMetadataHelpers'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    import Truncate from '@/common/ellipsis/index.vue'
    import page from '~/constant/accessControl/page'
    import useAuth from '~/composables/auth/useAuth'
    import InternalCMBanner from '@/common/customMetadata/internalCMBanner.vue'
    import PreviewTabsIcon from '~/components/common/icon/previewTabsIcon.vue'

    export default defineComponent({
        name: 'CustomMetadata',
        components: {
            InternalCMBanner,
            Truncate,
            ReadOnly: defineAsyncComponent(
                () =>
                    import(
                        '@/common/assets/preview/customMetadata/readOnly.vue'
                    )
            ),
            PreviewTabsIcon,
        },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            data: {
                type: Object,
                required: true,
            },
            isDrawer: {
                type: Boolean,
                required: false,
                default: false,
            },
            tab: {
                type: Object,
                required: false,
            },
            loading: {
                type: Boolean,
                required: false,
                default: false,
            },
            isCmReady: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        setup(props) {
            const { selectedAsset, data, isCmReady } = toRefs(props)

            const viewOnly = ref(data.value?.options?.isLocked === 'true')
            const activeKey = ref(['0'])

            const { checkAccess } = useAuth()

            const showEditButton = ref(false)

            const isEvaluating = inject('isEvaluating')

            const { selectedAssetUpdatePermission } = useAssetInfo()
            const {
                getDatatypeOfAttribute,
                isLink,
                formatDisplayValue,
                getApplicableAttributes,
                getEnumOptions,
                getHumanTypeName,
            } = useCustomMetadataHelpers()

            // ? local attribute list , may consist of key - values required by this component only, (ex, boolean unsavedChanges )
            const applicableList = ref(
                getApplicableAttributes(
                    data.value,
                    selectedAsset.value?.typeName
                )
            )

            const initializeAttributesList = () => {
                applicableList.value = []
                applicableList.value = getApplicableAttributes(
                    data.value,
                    selectedAsset.value?.typeName
                )
            }

            /**
             * @desc parses all the attached bm from the asset payload and
             *  forms the initial attribute list
             */
            const setAttributesList = () => {
                initializeAttributesList()
                if (selectedAsset.value?.attributes) {
                    const bmAttributes = Object.keys(
                        selectedAsset.value?.attributes
                    ).filter((attr) => attr.split('.').length > 1)

                    if (bmAttributes.length)
                        bmAttributes.forEach((ab) => {
                            if (data.value.id === ab.split('.')[0]) {
                                const attribute = ab.split('.')[1]

                                const value =
                                    selectedAsset.value?.attributes[ab]
                                const attrIndex =
                                    applicableList.value.findIndex(
                                        (a) => a.name === attribute
                                    )
                                const options =
                                    applicableList.value[attrIndex]?.options

                                if (attrIndex > -1) {
                                    if (options?.multiValueSelect === 'true') {
                                        // value = JSON.parse(value)
                                    }

                                    applicableList.value[attrIndex].value =
                                        value
                                }
                            }
                        })
                }
            }

            const hasValue = (a) => {
                const isMultivalued =
                    a?.options?.multiValueSelect === 'true' ||
                    a?.options?.multiValueSelect === true
                const dataType = getDatatypeOfAttribute(a)

                if (
                    [
                        'url',
                        'text',
                        'int',
                        'float',
                        'number',
                        'decimal',
                        'users',
                        'groups',
                        'enum',
                    ].includes(dataType) &&
                    isMultivalued
                )
                    return !!a.value?.length
                if (
                    ['url', 'text', 'users', 'groups', 'enum'].includes(
                        dataType
                    )
                )
                    return !!a.value
                return !!formatDisplayValue(a.value?.toString() || '', dataType)
            }

            whenever(isCmReady, () => {
                setAttributesList()

                if (applicableList.value?.filter((i) => hasValue(i)).length) {
                    activeKey.value = ['1']
                }
            })

            const isProfile = inject('isProfile')

            const switchTab = inject('switchTab')

            const handleActiveKeyChange = (newKey) => {
                activeKey.value = newKey
            }

            return {
                viewOnly,
                switchTab,
                checkAccess,
                page,
                getHumanTypeName,
                isProfile,
                hasValue,
                getDatatypeOfAttribute,
                isLink,
                formatDisplayValue,
                applicableList,
                getEnumOptions,
                selectedAssetUpdatePermission,
                activeKey,
                isEvaluating,
                showEditButton,
                handleActiveKeyChange,
            }
        },
    })
</script>

<style lang="less" module>
    .cmTab {
        :global(.ant-collapse-item) {
            :global(.ant-collapse-header) {
                padding: 0 !important;
            }
            :global(.ant-collapse-content-box) {
                padding-bottom: 0 !important;
            }
        }
    }
</style>
