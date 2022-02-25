<template>
    <a-popover
        title=""
        placement="left"
        :mouse-enter-delay="mouseEnterDelay"
        class="w-96"
    >
        <template #content>
            <div class="rounded w-96">
                <!-- Start Header-->
                <div class="p-4 bg-gray-100 border-b rounded-tl rounded-tr">
                    <div class="flex justify-between mb-2">
                        <div
                            class="flex items-center font-semibold break-words"
                        >
                            <div class="flex">
                                <div
                                    v-if="
                                        item.typeName?.toLowerCase() ===
                                            'column' &&
                                        item.attributes?.dataType
                                    "
                                    class="flex items-center h-6 p-1 mr-2 text-gray-500 bg-gray-200 border-gray-300 rounded"
                                >
                                    <component
                                        :is="dataTypeCategoryImage(item)"
                                        class="h-4 text-gray-500"
                                    />
                                </div>
                                <span
                                    class="w-64 text-lg break-words line-clamp-3"
                                >
                                    {{
                                        item?.displayText ||
                                        item?.attributes?.name
                                    }}
                                    <CertificateBadge
                                        v-if="certificateStatus(item)"
                                        :status="certificateStatus(item)"
                                        :username="certificateUpdatedBy(item)"
                                        :timestamp="certificateUpdatedAt(item)"
                                        class="flex mb-1 ml-1"
                                        style="min-width: 16px"
                                    />
                                </span>
                            </div>
                        </div>
                        <slot name="button">
                            <AtlanBtn
                                v-if="!showPreviewLink"
                                class="self-start flex-none bg-white border border-gray-300"
                                size="icn"
                                color="minimal"
                                padding="icon"
                                @click="$emit('previewAsset')"
                            >
                                <AtlanIcon icon="OpenPreview" />
                            </AtlanBtn>
                        </slot>
                    </div>
                    <div class="flex items-center leading-5">
                        <img :src="logoTitle" class="h-4 mr-1 mb-0.5" />
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
                        <div class="uppercase">
                            {{ title || item?.typeName }}
                        </div>

                        <!-- Table context for columns -->
                        <div v-if="table" class="flex items-center">
                            <span class="mx-2">in</span>
                            <AtlanIcon
                                icon="TableGray"
                                :class="`mr-1 mb-0.5 text-blueGray`"
                            />
                            <div class="w-56 truncate">
                                {{ table }}
                            </div>
                        </div>
                        <!-- DB and Schema context for tables/views etc. -->
                        <div
                            v-if="
                                db && item.typeName?.toLowerCase() !== 'column'
                            "
                            class="flex items-center text-gray-500"
                        >
                            <span class="mx-2">in</span>
                            <AtlanIcon
                                icon="DatabaseGray"
                                class="mr-1 mb-0.5"
                            />
                            <div class="truncate w-28">
                                {{ db }}
                            </div>
                        </div>
                        <div
                            v-if="
                                schema &&
                                item.typeName?.toLowerCase() !== 'column'
                            "
                            class="flex items-center text-gray-500"
                        >
                            <span v-if="db" class="mx-0.5 mb-0.5"
                                ><AtlanIcon icon="CaretRight"
                            /></span>
                            <AtlanIcon icon="SchemaGray" class="mr-1 mb-0.5" />
                            <div class="truncate w-28">
                                {{ schema }}
                            </div>
                        </div>
                        <!--Collection context for queries -->
                        <div
                            v-if="collectionName"
                            class="flex items-center text-gray-500"
                        >
                            <span class="mx-2">in</span>
                            <AtlanIcon
                                icon="CollectionIconSmall"
                                class="mr-1 mb-0.5"
                            />
                            <div class="w-56 truncate">
                                {{ collectionName }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- End Header-->
                <div class="w-full px-4 mt-3">
                    <!-- start row 1  -->
                    <div class="mb-4">
                        <!-- #rows/cols/size for tables, views etc. -->
                        <div
                            v-if="
                                [
                                    'table',
                                    'view',
                                    'tablepartition',
                                    'materialisedview',
                                ].includes(item.typeName?.toLowerCase())
                            "
                            class="flex justify-between flex-grow"
                        >
                            <div class="">
                                <div class="text-gray-500">Rows</div>
                                <div class="mt-1 font-bold">{{ rows }}</div>
                            </div>
                            <div class="">
                                <div class="text-gray-500">Columns</div>
                                <div class="mt-1 font-bold">{{ cols }}</div>
                            </div>
                            <div class="mr-14">
                                <div class="text-gray-500">Size</div>
                                <div class="mt-1 font-bold">
                                    {{ sizeBytes(item, false) }}
                                </div>
                            </div>
                        </div>
                        <!--data type context for columns -->
                        <div
                            v-if="
                                item.typeName?.toLowerCase() === 'column' &&
                                item.attributes?.dataType
                            "
                        >
                            <div class="text-gray-500">Data type</div>
                            <div class="flex items-center mt-1">
                                <component
                                    :is="dataTypeCategoryImage(item)"
                                    class="h-4 mr-1 text-gray-500"
                                />
                                <span>{{ item.attributes?.dataType }}</span>
                            </div>
                        </div>
                    </div>
                    <!-- end row 1  -->

                    <!-- description -->
                    <div v-if="description(item)" class="mb-4">
                        <div class="text-gray-500">Description</div>
                        <div class="flex items-center mt-1">
                            {{ description(item) }}
                        </div>
                    </div>

                    <!-- terms/clsfs  -->
                    <div
                        v-if="list?.length || item?.meanings?.length"
                        class="mb-4"
                    >
                        <div class="text-gray-500">Terms & Classifications</div>
                        <div class="mt-3"></div>
                        <div
                            v-if="list?.length > 0"
                            class="flex flex-wrap gap-1"
                        >
                            <template
                                v-for="classification in list"
                                :key="classification.guid"
                            >
                                <ClassificationPill
                                    :name="classification.name"
                                    :display-name="classification?.displayName"
                                    :is-propagated="
                                        isPropagated(classification)
                                    "
                                    :allow-delete="false"
                                    :created-by="classification?.createdBy"
                                ></ClassificationPill>
                            </template>
                        </div>
                        <div
                            v-if="item?.meanings?.length"
                            class="flex flex-wrap gap-1"
                        >
                            <template
                                v-for="term in item.meanings"
                                :key="term.termGuid"
                            >
                                <TermPill :term="term" :allow-delete="false" />
                            </template>
                        </div>
                    </div>

                    <!-- owners -->
                    <div
                        v-if="item?.attributes?.ownerUsers?.length > 0"
                        class="mb-4"
                    >
                        <div class="text-gray-500">Owners</div>
                        <div class="flex flex-wrap gap-1 mt-1">
                            <div
                                v-for="(user, idx) in item?.attributes
                                    ?.ownerUsers"
                                :key="idx"
                            >
                                <!-- <PopOverUser :item="user"> -->
                                <UserPill :key="idx" :username="user" />
                                <!-- </PopOverUser> -->
                            </div>
                        </div>
                    </div>

                    <!-- <div class="flex justify-between">
                            <div class="flex items-center mb-1 text-gray-500">
                                <slot name="extraHeaders"> </slot>
                            </div>
                        </div> -->

                    <div class="flex">
                        <router-link
                            v-if="showPreviewLink"
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
                                <AtlanIcon
                                    icon="ArrowRight"
                                    class="text-primary"
                                />
                            </AtlanBtn>
                        </router-link>
                    </div>
                </div>
            </div>
        </template>
        <slot></slot>
    </a-popover>
</template>

<script lang="ts">
    import { toRefs, computed, inject, onMounted, ref, ComputedRef } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import { mergeArray } from '~/utils/array'
    import CertificateBadge from '@/common/badge/certificate/index.vue'
    import ClassificationPill from '@/common/pills/classification.vue'
    import UserPill from '@/common/pills/user.vue'
    import AtlanBtn from '@/UI/button.vue'
    import TermPill from '@/common/pills/term.vue'
    import PopOverUser from '@/common/popover/user/user.vue'
    import { QueryCollection } from '~/types/insights/savedQuery.interface'

    export default {
        name: 'PopoverAsset',
        components: {
            PopOverUser,
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
                default: 1,
            },
            showPreviewLink: {
                type: Boolean,
                default: false,
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
                description,
                sizeBytes,
                connectionName,
                connectorName,
            } = useAssetInfo()

            const { classificationList } = useTypedefData()

            const isPropagated = (classification) => {
                if (!item?.value?.guid) {
                    return false
                }
                return item?.value?.guid !== classification.entityGuid
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

            const rows = computed(() => {
                const rawRowCount = rowCount(item.value, true)
                if (rawRowCount.length > 12) return rowCount(item.value, false)
                return rawRowCount ?? ''
            })
            const cols = computed(() => {
                const rawColCount = columnCount(item.value, true)
                if (rawColCount.length > 12)
                    return columnCount(item.value, false)
                return rawColCount ?? ''
            })
            const table = computed(() => tableName(item.value))
            const db = computed(() => databaseName(item.value))
            const schema = computed(() => schemaName(item.value))
            const title = computed(() => assetTypeLabel(item.value))
            const logoTitle = computed(() => getConnectorImage(item.value))
            const path = computed(() => `/assets/${item.value.guid}`)
            const collectionName = ref('')

            const queryCollections = inject('queryCollections') as ComputedRef<
                QueryCollection[] | undefined
            >

            const setCollectionName = () => {
                if (
                    item?.value?.attributes &&
                    queryCollections?.value?.length
                ) {
                    const { attributes } = item.value
                    const { collectionQualifiedName } = attributes
                    if (collectionQualifiedName) {
                        const col = queryCollections.value?.find(
                            (col) =>
                                col.attributes.qualifiedName ===
                                collectionQualifiedName
                        )
                        collectionName.value = col?.displayText || ''
                    }
                }
            }

            onMounted(() => {
                setCollectionName()
            })

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
                description,
                sizeBytes,
                connectionName,
                connectorName,
                collectionName,
            }
        },
    }
</script>
<style lang="less">
    // .icon-blue-color {
    //     path {
    //         stroke: #5277d7;
    //     }
    // }
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
