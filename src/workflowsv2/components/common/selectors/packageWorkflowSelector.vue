<template>
    <a-dropdown :trigger="['click']" v-model:visible="dropdownVisible">
        <div
            class="flex items-center w-64 h-8 px-2 py-1 text-gray-500 transition-colors duration-300 border border-gray-300 rounded cursor-pointer gap-x-2 hover:border-primary-focus"
        >
            <img
                v-if="packageId && icon(selectedPackage)"
                :src="icon(selectedPackage)"
                class="w-4 h-auto"
            />
            <span
                v-else-if="packageId && emoji(selectedPackage)"
                class="w-4 text-xs"
            >
                {{ emoji(selectedPackage) }}
            </span>
            <span class="text-sm truncate" :class="placeholder.class">{{
                placeholder.text
            }}</span>
            <AtlanIcon
                v-if="packageId"
                class="h-3 ml-auto text-gray-500 hover:text-gray"
                icon="Cancel"
                @click="clearSelection"
            />
            <AtlanIcon
                v-else
                icon="CaretRight"
                class="ml-auto transition-transform"
                :class="dropdownVisible ? 'transform rotate-90' : ''"
            />
        </div>
        <template #overlay>
            <div class="py-2 bg-white rounded-lg shadow-md">
                <!-- Package selector -->
                <a-popover
                    :trigger="['click']"
                    placement="rightTop"
                    :class="$style.packagePopover"
                    mouseEnterDelay="0"
                    mouseLeaveDelay="0.1"
                >
                    <template #content>
                        <!-- Package search -->
                        <SearchAndFilter
                            v-model:value="packageQuery"
                            size="minimal"
                            class="focus-within:border-primary-focus"
                        />
                        <!-- Package list -->
                        <div class="w-64 overflow-y-auto h-44">
                            <div
                                v-for="item in packageList"
                                class="package-list-item"
                                :class="{ selected: item.id === packageId }"
                                @click="$emit('update:packageId', item.id)"
                            >
                                <img
                                    v-if="item.icon"
                                    :src="item.icon"
                                    class="w-4 h-auto"
                                />
                                <span v-else-if="item.emoji" class="text-xs">
                                    {{ item.emoji }}
                                </span>
                                {{ item.label }}
                                <span class="text-gray-500 truncate"
                                    >({{ item.count }} Workflows)</span
                                >
                            </div>
                            <div
                                v-if="!packageList.length"
                                class="flex flex-col items-center pt-4"
                            >
                                <AtlanIcon icon="NoResultsFound" class="h-28" />
                                <span class="text-gray-500"
                                    >No result found</span
                                >
                            </div>
                        </div>
                    </template>
                    <!-- Main selector -->
                    <div class="combo-menu-item">
                        <img
                            v-if="packageId && icon(selectedPackage)"
                            :src="icon(selectedPackage)"
                            class="w-6 h-auto"
                        />
                        <span
                            v-else-if="packageId && emoji(selectedPackage)"
                            class="w-6 text-base"
                        >
                            {{ emoji(selectedPackage) }}
                        </span>
                        <AtlanIcon icon="Package" v-else class="h-6" />
                        <div>
                            <p class="text-xs text-gray-500">Package</p>
                            <p class="text-sm text-gray">
                                {{
                                    packageId
                                        ? name(selectedPackage)
                                        : 'Select a package'
                                }}
                            </p>
                        </div>
                        <AtlanIcon icon="CaretRight" class="ml-auto" />
                    </div>
                </a-popover>

                <!-- Workflow selector -->
                <a-popover
                    :trigger="['click']"
                    placement="rightTop"
                    :class="$style.packagePopover"
                    mouseEnterDelay="0"
                    mouseLeaveDelay="0.1"
                >
                    <template v-if="packageId" #content>
                        <!-- Workflow search -->
                        <SearchAndFilter
                            v-model:value="workflowQuery"
                            size="minimal"
                            class="focus-within:border-primary-focus"
                        />
                        <!-- Workflow list -->
                        <div class="w-64 overflow-y-auto h-44">
                            <div
                                v-for="item in wfListFiltered"
                                class="package-list-item"
                                :class="{ selected: item.id === workflowId }"
                                @click="$emit('update:workflowId', item.id)"
                            >
                                {{ item.label }}
                            </div>

                            <div
                                v-if="!wfListFiltered.length"
                                class="flex flex-col items-center pt-4"
                            >
                                <AtlanIcon icon="NoResultsFound" class="h-28" />
                                <span class="text-gray-500"
                                    >No result found</span
                                >
                            </div>
                        </div>
                    </template>
                    <!-- Main Workflow selector -->
                    <div
                        class="combo-menu-item"
                        :class="{ disabled: !packageId }"
                    >
                        <img
                            v-if="workflowId && icon(selectedPackage)"
                            :src="icon(selectedPackage)"
                            class="w-6 h-auto"
                        />
                        <span
                            v-else-if="workflowId && emoji(selectedPackage)"
                            class="w-6 text-base"
                        >
                            {{ emoji(selectedPackage) }}
                        </span>
                        <AtlanIcon icon="Workflow" v-else class="h-6" />
                        <div>
                            <p class="text-xs text-gray-500">Workflow</p>
                            <p class="text-sm text-gray">
                                {{
                                    workflowId
                                        ? displayName(
                                              selectedPackage,
                                              workflowId
                                          )
                                        : 'Select workflow context'
                                }}
                            </p>
                        </div>
                        <AtlanIcon icon="CaretRight" class="ml-auto" />
                    </div>
                </a-popover>
            </div>
        </template>
    </a-dropdown>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, toRefs, watch } from 'vue'
    import SearchAndFilter from '~/components/common/input/searchAndFilter.vue'
    import { useWorkflowStore } from '~/workflowsv2/store/index'
    import { usePackageInfo } from '~/workflowsv2/composables/usePackageInfo'
    import BaseSelector from './baseSelector.vue'
    import useWorkflowInfo from '~/workflowsv2/composables/useWorkflowInfo'
    import { whenever } from '@vueuse/core'
    import { useWorkflowDiscoverList } from '~/workflowsv2/composables/useWorkflowDiscoverList'

    export default defineComponent({
        name: 'PackageWorkflowSelector',
        components: { BaseSelector, SearchAndFilter },
        props: {
            packageId: {
                type: String,
                required: false,
                default: () => undefined,
            },
            workflowId: {
                type: String,
                required: false,
                default: () => undefined,
            },
        },
        emits: ['update:packageId', 'update:workflowId'],
        setup(props, { emit }) {
            const { packageId, workflowId } = toRefs(props)
            const dropdownVisible = ref(false)
            const packageQuery = ref(undefined)
            const workflowQuery = ref(undefined)

            const workflowStore = useWorkflowStore()
            const { identifier, name, icon, emoji } = usePackageInfo()
            const { displayName } = useWorkflowInfo()

            const init = async () => {
                await workflowStore.fetchActivePackages()
                workflowStore.fetchActivePackageMeta()
            }

            // Package related stuff //
            const selectedPackage = computed(() =>
                packageId.value
                    ? workflowStore.packageMeta?.[packageId.value]
                    : {}
            )

            const packageList = computed(() =>
                Object.values(workflowStore.packageMeta)
                    .map((pkg) => ({
                        id: identifier(pkg),
                        icon: icon(pkg),
                        label: name(pkg),
                        count: workflowStore.activePackageMap?.[
                            identifier(pkg)
                        ],
                        emoji: emoji(pkg),
                    }))
                    .filter((li) => {
                        if (packageQuery.value)
                            return (
                                li.label.includes(packageQuery.value) ||
                                li.id.includes(packageQuery.value)
                            )
                        else return true
                    })
            )
            // Package related stuff END //

            // Workflow related stuff //
            const workflowList = ref<{ id: string; label: string }[]>([])

            const {
                list,
                quickChange,
                isLoading: isWfLoading,
            } = useWorkflowDiscoverList({
                facets: computed(() => ({
                    ui: true,
                    packageName:
                        selectedPackage.value?.metadata?.annotations?.[
                            'package.argoproj.io/name'
                        ],
                })),
                limit: ref(100),
                source: ref({
                    excludes: ['spec'],
                }),
                preference: ref({
                    sort: 'metadata.creationTimestamp-desc',
                }),
                immediate: false,
            })

            whenever(list, () => {
                workflowList.value = list.value.map((workflow) => ({
                    id: workflow.metadata.name,
                    label: displayName(
                        selectedPackage.value,
                        workflow.metadata.name
                    ),
                }))
            })

            const wfListFiltered = computed(() =>
                workflowList.value.filter((li) => {
                    if (workflowQuery.value)
                        return (
                            li.label.includes(workflowQuery.value) ||
                            li.id.includes(workflowQuery.value)
                        )
                    else return true
                })
            )

            watch(packageId, () => {
                workflowList.value = []
                emit('update:workflowId', undefined)

                if (packageId.value) {
                    quickChange()
                }
            })

            // Workflow related stuff END //

            const placeholder = computed(() => {
                if (workflowId.value)
                    return {
                        text: `${name(selectedPackage.value)} → ${displayName(
                            selectedPackage.value,
                            workflowId.value
                        )}`,
                        class: 'text-gray',
                    }
                if (packageId.value)
                    return {
                        text: name(selectedPackage.value),
                        class: 'text-gray',
                    }

                return {
                    text: 'Select package & workflow',
                    class: 'text-gray-500',
                }
            })

            const clearSelection = () => {
                emit('update:packageId', undefined)
                emit('update:workflowId', undefined)
            }

            init()
            return {
                packageList,
                dropdownVisible,
                packageQuery,
                selectedPackage,
                name,
                icon,
                emoji,
                displayName,
                placeholder,
                isWfLoading,
                workflowQuery,
                wfListFiltered,
                clearSelection,
            }
        },
    })
</script>
<style lang="less" scoped>
    .combo-menu-item {
        @apply flex items-center px-4 py-2 w-64 gap-x-3;

        &:hover {
            @apply bg-primary-menu;
        }

        &.disabled {
            @apply bg-gray-100 opacity-80;
            @apply cursor-not-allowed;
        }
    }
    .package-list-item {
        @apply flex items-center truncate gap-x-2 text-sm cursor-pointer select-none;
        padding: 6px 16px;
        &:hover {
            @apply bg-primary-menu;
        }
        &.selected {
            @apply bg-primary-selected-focus;
        }
    }
</style>
<style lang="less" module>
    .packagePopover {
        &:global(.ant-popover) {
            &:global(.ant-popover-inner) {
                @apply rounded-lg;
            }
        }
    }
</style>
