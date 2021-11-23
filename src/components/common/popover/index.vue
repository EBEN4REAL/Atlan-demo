<template>
    <a-popover title="">
        <template #content>
            <div class="relation-ship">
                <div class="flex items-center">
                    <img :src="logoTitle" class="h-3 mr-1" />
                    <span>{{ title }}</span>
                </div>
                <div class="text-lg font-semibold truncate ...">
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
                        v-if="row !== '-' && row !== ''"
                        class="text-xs text-gray-500"
                    >
                        <span
                            class="mr-1 text-xs font-semibold tracking-tight text-gray-500 "
                            >{{ row }}</span
                        >Rows
                    </span>
                    <span
                        v-if="col !== '-' && col !== ''"
                        class="text-xs text-gray-500"
                    >
                        <span
                            class="text-xs font-semibold tracking-tight text-gray-500 "
                            >{{ col }}</span
                        >
                        Cols
                    </span>
                    <div v-if="col !== '-' && col !== ''" class="dot" />
                    <div
                        v-if="table"
                        class="flex items-center text-sm text-gray-500"
                    >
                        <AtlanIcon icon="TableGray" class="mr-1 mb-0.5" />
                        <div class="text-xs tracking-tight text-gray-500">
                            {{ table }}
                        </div>
                    </div>
                    <div v-if="table" class="dot" />
                    <div v-if="db" class="flex items-center text-gray-500">
                        <AtlanIcon icon="DatabaseGray" class="mr-1 mb-0.5" />
                        <div class="text-xs tracking-tight text-gray-500">
                            {{ db }}
                        </div>
                    </div>
                    <div v-if="db" class="dot" />
                    <div v-if="schema" class="flex items-center text-gray-500">
                        <AtlanIcon icon="SchemaGray" class="mr-1 mb-0.5" />
                        <div class="text-xs tracking-tight text-gray-500">
                            {{ schema }}
                        </div>
                    </div>
                </div>
                <div class="mt-2 text-xs text-gray-500">Description</div>
                <div class="mt-1 text-sm">
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
                <router-link :to="path">
                    <a-button class="mt-3" block
                        >View {{ title?.toLowerCase() }} profile</a-button
                    >
                </router-link>
            </div>
        </template>
        <slot></slot>
    </a-popover>
</template>

<script lang="ts">
    import { toRefs, computed } from 'vue'
    // import UserAvatar from '@/common/avatar/user.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import { mergeArray } from '~/utils/array'
    import CertificateBadge from '@/common/badge/certificate/index.vue'
    import ClassificationPill from '@/common/pills/classification.vue'
    import UserPill from '@/common/pills/user.vue'

    export default {
        name: 'PophoverAsset',
        components: {
            // UserAvatar,
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
            logoTitle: {
                type: String,
                required: false,
                default: '',
            },
            title: {
                type: String,
                required: false,
                default: '',
            },
            row: {
                type: String,
                required: false,
                default: '',
            },
            col: {
                type: String,
                required: false,
                default: '',
            },
            db: {
                type: String,
                required: false,
                default: '',
            },
            schema: {
                type: String,
                required: false,
                default: '',
            },
            table: {
                type: String,
                required: false,
                default: '',
            },
            path: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
        },
        emits: [],
        setup(props) {
            const { item } = toRefs(props)
            const {
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                classifications,
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

            return {
                certificateStatus,
                certificateUpdatedBy,
                certificateUpdatedAt,
                isPropagated,
                list,
                classifications,
            }
        },
    }
</script>

<style lang="less" scoped>
    .relation-ship {
        width: 330px;
    }
    .dot {
        background: #c4c4c4;
        height: 4px;
        width: 4px;
        border-radius: 50%;
    }
</style>
