<template>
    <div
        class="relative w-full px-4 py-3 bg-gray-100 border-b border-gray-300"
        style="min-width: 374px"
    >
        <div
            v-if="isLoading"
            class="flex items-center content-center justify-center"
        >
            <AtlanLoader class="h-10 animate-spin" />
        </div>
        <div v-else class="flex items-center w-full align-center">
            <ClassificationIcon
                :classification="classification"
                :entity-guid="guid"
                :class-names="'h-6'"
                :linked-by="
                    linkedUser.hasOwnProperty('username')
                        ? linkedUser.username
                        : ''
                "
            />
            <p
                class="max-w-xs ml-2 mr-1 text-lg font-bold truncate font-gray-700"
            >
                {{ classification.displayName }}
            </p>
            <a-button
                class="px-1.5 py-1 ml-auto"
                @click="$emit('togglePreview')"
            >
                <AtlanIcon icon="SidebarSwitch" style="height: auto" />
            </a-button>
        </div>
        <div
            v-if="!isPropagated && Object.keys(linkedUser).length > 0"
            class="flex gap-1 mt-1.5 text-sm content-center items-center flex-wrap break-all"
        >
            <span class="text-gray-500">Linked by</span>
            <UserAvatar :username="linkedUser.username" />
            <span class="text-gray-700">{{ linkedUser.name }}</span>
            <span class="text-gray-500">{{ linkedAt }}</span>
        </div>
        <div
            v-else-if="isPropagated && Object.prototype.toString.call(propagatedVia) === '[object Object]' &&  Object.keys(propagatedVia)?.length"
            class="flex gap-1 mt-1.5 text-sm content-center items-center text-gray-500 flex-wrap break-all"
        >
            
            Propagated via <AtlanIcon :icon="propagatedViaIcon" />
            <span class="text-gray-700 cursor-pointer hover:text-primary" @click="handleOpenProfile(propagatedVia)" >
                {{ computeDisplayText(propagatedVia) }}
            </span>
            {{ linkedAt }}
        </div>
        <div
            v-else-if="isPropagated && propagatedVia?.length"
            class="flex gap-1 mt-1.5 text-sm content-center items-center text-gray-500 flex-wrap break-all"
        >
            Propagated via <AtlanIcon :icon="detailedPropagatedViaIcon(propagatedVia[0])" />
            <span class="text-gray-700 cursor-pointer hover:text-primary" @click="() => propagatedVia?.length ?  handleOpenProfile(propagatedVia[0]) : handleOpenProfile(propagatedVia)" >
                {{ computeDisplayText(propagatedVia) }}
            </span>
            <a-popover 
                placement="rightTop" >
                <template #content>
                    <div class="py-3 pl-3 bg-white rounded-md w-52">
                        <div class="flex items-center" v-for="(pv,i) in propagatedVia.slice(1)" :key="i">
                            <div class="mr-1">
                                <AtlanIcon
                                    class="text-gray-500"
                                    :icon="detailedPropagatedViaIcon(pv)"
                                    
                                />
                            </div>
                            <div class="text-sm text-gray-500 cursor-pointer hover:text-primary" @click="handleOpenProfile(pv)" >
                                {{pv?.displayText}}
                            </div>
                        </div>
                    </div>
                </template>
                <span class="cursor-pointer" style="text-decoration: underline dotted">
                    {{extendedText}}
                </span>
            </a-popover>
            {{ linkedAt }}
        </div>
    </div>
</template>

<script lang="ts">
    import dayjs from 'dayjs'
    import relativeTime from 'dayjs/plugin/relativeTime'

    import { computed, defineComponent, PropType, ref } from 'vue'
    import { and } from '@vueuse/core'
    import AtlanLoader from '@common/loaders/atlanLoader.vue'
    import ClassificationIcon from '@/common/icon/classificationIcon.vue'
    import AtlanIcon from '@/common/icon/atlanIcon.vue'
    import UserAvatar from '@/common/avatar/user.vue'

    import { usePropagatedVia } from '~/composables/classification/usePropagatedVia'
    import { useLinkedBy } from '~/composables/classification/useLinkedBy'

    import { ClassificationInterface } from '~/types/classifications/classification.interface'

    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { assetTypeList } from '~/constant/assetType'

    dayjs.extend(relativeTime)

    export default defineComponent({
        name: 'ClassificationHead',
        components: {
            AtlanLoader,
            ClassificationIcon,
            AtlanIcon,
            UserAvatar,
        },
        props: {
            classification: {
                type: Object as PropType<ClassificationInterface>,
                required: true,
            },
            entityGuid: {
                type: String,
                required: false,
                default: '',
            },
        },
        emits: ['togglePreview'],
        setup(props) {
            const classification = ref<ClassificationInterface>(
                props.classification
            )
            const remainingClassifications = ref<boolean>(false)
            const guid = ref(props.entityGuid)
            const extendedText = ref<string>()

            const {getProfilePath } = useAssetInfo()

            const isPropagated = computed(() => {
                if (!guid.value || guid.value.length === 0) {
                    return false
                }
                return guid.value !== classification.value.entityGuid
            })

            const {
                linkedBy: linkedUser,
                linkedAt,
                isLoading: isAuditLoading,
            } = useLinkedBy(classification, isPropagated)

            const {
                isLoading: isAssetLoading,
                propagatedVia,
                propagatedViaIcon,
            } = usePropagatedVia(classification)

            const isLoading = and(isAuditLoading, isAssetLoading)

            const propagateByIcon = item => {
                const assetIcon = assetTypeList.find(asset => asset?.id === item?.typeName)
                return assetIcon?.image
            }

            const computeDisplayText = progatedVia => {
                if(progatedVia?.length) {
                    progatedVia.forEach((el) => {
                        // eslint-disable-next-line no-param-reassign
                        progatedVia.icon = propagateByIcon(el)
                    })
                    extendedText.value = `and ${progatedVia.slice(1).length} ${progatedVia.slice(1).length > 1 ? "others" : "other"}`
                    return `${progatedVia[0]?.displayText}`
                }
                return progatedVia?.displayText
            }

            const progatedIcon = progatedVia => {
                if(progatedVia?.length) {
                    return propagateByIcon(progatedVia[0])
                }
                return propagatedViaIcon
            }

            const detailedPropagatedViaIcon = progatedViaObj =>  propagateByIcon(progatedViaObj)

            const handleOpenProfile = (asset) => {
                window.open(getProfilePath(asset), '_blank')
            }

            return {
                linkedUser,
                linkedAt,
                isPropagated,
                guid,
                propagatedVia,
                propagatedViaIcon,
                isLoading,
                computeDisplayText,
                progatedIcon,
                detailedPropagatedViaIcon,
                remainingClassifications,
                extendedText,
                handleOpenProfile
            }
        },
    })
</script>


<style lang="less" scoped>
    .propagated-tooltip {
        box-shadow: 0px 0px 4px rgba(55, 65, 81, 0.06), 0px 2px 6px rgba(55, 65, 81, 0.1);
        left: 93px;
    }
    .propagated-class-tooltip {
        .ant-popover-inner-content {
            @apply p-4 !important;
        }
        
    }
</style>
