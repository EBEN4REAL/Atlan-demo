<template>
    <a-popover title="">
        <template #content>
            <div class="relation-ship">
                <div class="flex justify-between">
                    <div class="flex items-center">
                        <img :src="logoTitle" class="h-3 mr-2" />
                        <AtlanIcon
                            v-if="
                                ['atlasglossarycategory'].includes(
                                    item.typeName?.toLowerCase()
                                )
                            "
                            icon="Category"
                            class="h-4 mb-0.5 mr-1"
                        ></AtlanIcon>
                        <AtlanIcon
                            v-if="
                                ['atlasglossaryterm'].includes(
                                    item.typeName?.toLowerCase()
                                )
                            "
                            icon="Term"
                            class="h-4 mb-0.5 mr-1"
                        ></AtlanIcon>

                        <span class="uppercase">{{
                            title || item?.typeName
                        }}</span>

                        <slot name="extraHeaders"> </slot>
                    </div>
                    <div
                        v-if="
                            item.typeName?.toLowerCase() === 'column' &&
                            item.attributes?.dataType
                        "
                        class="flex items-center px-1 text-gray-500 bg-gray-100 border border-gray-300 border-solid "
                    >
                        <component
                            :is="dataTypeCategoryImage(item)"
                            class="h-4 text-gray-500"
                        />
                        {{ item.attributes?.dataType }}
                    </div>
                </div>
                <div class="mb-0.5 text-lg font-semibold truncate ...">
                    {{ item?.displayText || item?.attributes?.name }}
                    <CertificateBadge
                        v-if="certificateStatus(item)"
                        :status="certificateStatus(item)"
                        :username="certificateUpdatedBy(item)"
                        :timestamp="certificateUpdatedAt(item)"
                        class="mb-0.5"
                    />
                </div>
                <div class="flex flex-wrap items-center gap-x-2">
                    <span
                        v-if="
                            rows !== '-' &&
                            rows !== '' &&
                            item.typeName?.toLowerCase() !== 'column'
                        "
                        class="text-xs text-gray-500"
                    >
                        <span
                            class="mr-1 text-xs font-semibold tracking-tight text-gray-500 "
                            >{{ rows }}</span
                        >Rows
                    </span>
                    <span
                        v-if="
                            cols !== '-' &&
                            cols !== '' &&
                            item.typeName?.toLowerCase() !== 'column'
                        "
                        class="text-xs text-gray-500"
                    >
                        <span
                            class="text-xs font-semibold tracking-tight text-gray-500 "
                            >{{ cols }}</span
                        >
                        Cols
                    </span>
                    <div
                        v-if="
                            cols !== '-' &&
                            cols !== '' &&
                            item.typeName?.toLowerCase() !== 'column'
                        "
                        class="dot"
                    />
                    <div
                        v-if="table"
                        class="flex items-center text-sm text-gray-500"
                    >
                        <AtlanIcon
                            icon="TableGray"
                            :class="`mr-1 mb-0.5 ${
                                item.typeName?.toLowerCase() === 'column'
                                    ? 'icon-blue-color'
                                    : ''
                            }`"
                        />
                        <div
                            class="max-w-full text-xs tracking-tight text-gray-500 break-all "
                        >
                            {{ table }}
                        </div>
                    </div>
                    <div
                        v-if="
                            table && item.typeName?.toLowerCase() !== 'column'
                        "
                        class="dot"
                    />
                    <div
                        v-if="db && item.typeName?.toLowerCase() !== 'column'"
                        class="flex items-center text-gray-500"
                    >
                        <AtlanIcon icon="DatabaseGray" class="mr-1 mb-0.5" />
                        <div class="text-xs tracking-tight text-gray-500">
                            {{ db }}
                        </div>
                    </div>
                    <div
                        v-if="db && item.typeName?.toLowerCase() !== 'column'"
                        class="dot"
                    />
                    <div
                        v-if="
                            schema && item.typeName?.toLowerCase() !== 'column'
                        "
                        class="flex items-center text-gray-500"
                    >
                        <AtlanIcon icon="SchemaGray" class="mr-1 mb-0.5" />
                        <div class="text-xs tracking-tight text-gray-500">
                            {{ schema }}
                        </div>
                    </div>
                </div>
                <div class="mt-2 text-xs text-gray-500">Description</div>
                <div
                    :class="`mt-1 text-sm ${
                        !item?.attributes?.description ? 'text-gray-500' : ''
                    }`"
                >
                    {{
                        item?.attributes?.description ||
                        `This ${title} has no description added`
                    }}
                </div>
                <div v-if="list.length > 0" class="flex flex-wrap gap-1 mt-2">
                    <template
                        v-for="classification in list"
                        :key="classification.guid"
                    >
                        <ClassificationPill
                            :name="classification.name"
                            :display-name="classification?.displayName"
                            :is-propagated="isPropagated(classification)"
                            :allow-delete="false"
                        ></ClassificationPill>
                    </template>
                </div>
                <div v-if="item?.attributes?.ownerUsers.length > 0">
                    <div class="mt-2 text-xs text-gray-500">Owned by</div>
                    <div class="flex gap-1">
                        <UserPill
                            v-for="(user, idx) in item?.attributes?.ownerUsers"
                            :key="idx"
                            :username="user"
                        />
                    </div>
                </div>
                <router-link v-if="!slots?.button" :to="path">
                    <a-button class="mt-3" block>
                        <strong>
                            View
                            {{
                                title?.toLowerCase() === 'view'
                                    ? ''
                                    : title?.toLowerCase()
                            }}
                            profile
                        </strong>
                    </a-button>
                </router-link>

                <slot name="button"></slot>
            </div>
        </template>
        <slot></slot>
    </a-popover>
</template>

<script lang="ts">
    import { toRefs, computed } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import { mergeArray } from '~/utils/array'
    import CertificateBadge from '@/common/badge/certificate/index.vue'
    import ClassificationPill from '@/common/pills/classification.vue'
    import UserPill from '@/common/pills/user.vue'

    export default {
        name: 'PopoverAsset',
        components: {
            ClassificationPill,
            UserPill,
            CertificateBadge,
        },
        props: {
            item: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
        },
        emits: [],
        setup(props, { slots }) {
            const { item } = toRefs(props)

            const {
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                classifications,
                getConnectorImage,
                assetTypeLabel,
                rowCount,
                columnCount,
                databaseName,
                schemaName,
                tableName,
                dataTypeCategoryImage,
            } = useAssetInfo()

            const { classificationList } = useTypedefData()

            const isPropagated = (classification) => {
                if (!item?.value?.guid?.value) {
                    return false
                }
                if (item?.value?.guid === classification.entityGuid) {
                    return false
                }
                return true
            }

            const list = computed(() => {
                const { matchingIdsResult } = mergeArray(
                    classificationList.value,
                    classifications(item.value),
                    'name',
                    'typeName'
                )
                return matchingIdsResult
            })

            const rows = computed(() => rowCount(item.value, false))
            const cols = computed(() => columnCount(item.value, false))
            const table = computed(() => tableName(item.value))
            const db = computed(() => databaseName(item.value))
            const schema = computed(() => schemaName(item.value))
            const title = computed(() => assetTypeLabel(item.value))
            const logoTitle = computed(() => getConnectorImage(item.value))
            const path = computed(() => `/assets/${item.value.guid}`)

            return {
                certificateStatus,
                certificateUpdatedBy,
                certificateUpdatedAt,
                isPropagated,
                list,
                classifications,
                dataTypeCategoryImage,
                rows,
                cols,
                table,
                db,
                schema,
                title,
                logoTitle,
                path,
                slots,
            }
        },
    }
</script>
<style lang="less">
    .icon-blue-color {
        path {
            stroke: #5277d7;
        }
    }
</style>
<style lang="less" scoped>
    .relation-ship {
        width: 350px;
        padding: 16px;
    }
    .dot {
        background: #c4c4c4;
        height: 4px;
        width: 4px;
        border-radius: 50%;
    }
</style>
