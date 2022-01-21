<template>
    <a-popover title="" placement="left" :mouseEnterDelay="mouseEnterDelay">
        <template #content>
            <div class="relation-ship">
                <div class="flex justify-between">
                    <div class="flex items-center mb-1 text-gray-500">
                        <img :src="logoTitle" class="h-3 mr-1 mb-0.5" />
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

                        <div>
                            <span
                                v-if="
                                    rows !== '' &&
                                    (item.typeName?.toLowerCase() === 'table' ||
                                        item.typeName?.toLowerCase() ===
                                            'view' ||
                                        item.typeName?.toLowerCase() ===
                                            'tablepartition' ||
                                        item.typeName?.toLowerCase() ===
                                            'materialisedview')
                                "
                                class="ml-3 text-xs text-gray-500"
                            >
                                <span
                                    class="mr-1 text-xs font-semibold tracking-tight text-gray-500"
                                    >{{ rows }}</span
                                >Rows
                            </span>
                            <span
                                v-if="
                                    cols !== '' &&
                                    (item.typeName?.toLowerCase() === 'table' ||
                                        item.typeName?.toLowerCase() ===
                                            'view' ||
                                        item.typeName?.toLowerCase() ===
                                            'tablepartition' ||
                                        item.typeName?.toLowerCase() ===
                                            'materialisedview')
                                "
                                class="text-xs text-gray-500"
                                :class="{ 'ml-3': rows === '-' || rows === '' }"
                            >
                                <span
                                    class="text-xs font-semibold tracking-tight text-gray-500"
                                    >{{ cols }}</span
                                >
                                Cols
                            </span>
                        </div>

                        <slot name="extraHeaders"> </slot>
                    </div>
                    <div
                        v-if="
                            item.typeName?.toLowerCase() === 'column' &&
                            item.attributes?.dataType
                        "
                        class="flex items-center px-1 text-gray-500 bg-gray-100 border-gray-300 rounded"
                    >
                        <component
                            :is="dataTypeCategoryImage(item)"
                            class="h-4 text-gray-500"
                            style="margin-bottom: 3px"
                        />
                        <span>{{ item.attributes?.dataType }}</span>
                    </div>
                </div>
                <div class="flex">
                    <div class="mb-0.5 font-semibold truncate">
                        {{ item?.displayText || item?.attributes?.name }}
                    </div>
                    <CertificateBadge
                        v-if="certificateStatus(item)"
                        :status="certificateStatus(item)"
                        :username="certificateUpdatedBy(item)"
                        :timestamp="certificateUpdatedAt(item)"
                        class="mb-1 ml-1"
                    />
                </div>
                <div class="flex flex-wrap items-center gap-x-2">
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
                            class="max-w-full text-xs tracking-tight text-gray-500 break-all"
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
                <div v-if="description(item)" class="mt-1 text-sm">
                    {{ description(item) }}
                </div>
                <div v-if="list?.length > 0" class="flex flex-wrap gap-1 mt-3">
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
                    <template
                        v-for="term in item.meanings"
                        :key="term.termGuid"
                    >
                        <TermPill :term="term" :allow-delete="false" />
                    </template>
                </div>
                <div
                    v-if="item?.attributes?.ownerUsers?.length > 0"
                    class="mt-4"
                >
                    <div class="mb-1 text-sm text-gray-500">Owners</div>
                    <div class="flex flex-wrap gap-1">
                        <UserPill
                            v-for="(user, idx) in item?.attributes?.ownerUsers"
                            :key="idx"
                            :username="user"
                        />
                    </div>
                </div>
                <div class="flex mt-4">
                    <slot name="button"></slot>
                    <router-link
                        v-if="!slots?.button"
                        :to="path"
                        class="ml-auto"
                    >
                        <AtlanBtn
                            class="flex-none px-0"
                            size="sm"
                            color="minimal"
                            padding="compact"
                            style="height: fit-content"
                        >
                            <span class="text-primary whitespace-nowrap">
                                View Profile</span
                            >
                            <AtlanIcon icon="ArrowRight" class="text-primary" />
                        </AtlanBtn>
                    </router-link>
                </div>
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
    import AtlanBtn from '@/UI/button.vue'
    import TermPill from '@/common/pills/term.vue'

    export default {
        name: 'PopoverAsset',
        components: {
            ClassificationPill,
            UserPill,
            CertificateBadge,
            AtlanBtn,
            TermPill,
        },
        props: {
            item: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            mouseEnterDelay: {
                type: Number,
                required: false,
                default: 0.5,
            },
        },
        emits: [],
        setup(props, { slots }) {
            const { item, mouseEnterDelay } = toRefs(props)

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
                description,
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
                mouseEnterDelay,
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
                description,
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
