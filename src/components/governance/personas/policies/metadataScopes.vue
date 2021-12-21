<template>
    <div class="meta-data-scope-container">
        <a-collapse
            expand-icon-position="right"
            :active-key="defaultExpandedState"
        >
            <template #expandIcon="{ isActive }">
                <div>
                    <AtlanIcon
                        icon="ChevronDown"
                        class="ml-3 text-gray-500 transition-transform duration-300 transform"
                        :class="isActive ? '-rotate-180' : 'rotate-0'"
                    />
                </div>
            </template>

            <a-collapse-panel
                v-for="(scope, idx) in scopeList"
                :key="scope.type"
                :showArrow="false"
            >
                <template #header>
                    <a-checkbox
                        class="font-bold"
                        data-test-id="checkbox"
                        :checked="
                            groupedActions[idx].scopes.length ===
                            scopeList[idx].scopes.length
                        "
                        @click.stop="toggleCheckAll(idx)"
                    >
                        {{ scope.type }}
                    </a-checkbox>
                </template>
                <div class="meta-data-scope">
                    <a-checkbox-group
                        :value="groupedActions[idx].scopes"
                        :name="scope.type"
                        :class="['capitalize', $style.checkbox_custom]"
                        class="wrapper-checkbox"
                        @update:value="updateSelection(scope.type, $event)"
                    >
                        <a-checkbox
                            :checked="
                                groupedActions[idx].scopes.includes(item.value)
                            "
                            class="mt-2"
                            :value="item.value"
                            v-for="(item, i) in scope.scopes"
                            :key="i"
                            @update:value="updateSelection(scope.type, $event)"
                        >
                            <div
                                class="flex items-baseline justify-between w-100"
                            >
                                <div class="w-40">
                                    {{ item.label }}
                                </div>
                                <div class="text-gray-500 wrapper-desc desc">
                                    {{ item.desc }}
                                    <a-tooltip
                                        v-if="
                                            item.label.toLowerCase() === 'read'
                                        "
                                        placement="right"
                                        color="white"
                                    >
                                        <span
                                            class="text-blue-600 pointer-events-auto"
                                            >Learn more</span
                                        >
                                        <template #title>
                                            <p class="m-3 text-gray">
                                                Atlan opens up most
                                                non-sensitive metadata
                                                attributes to all product users
                                                by default <br />
                                                Sensitive information of assets
                                                coming in from source like
                                                source urls, formulas in
                                                calculated fields, raw SQL QUERY
                                                in views, queries, upstream
                                                information around
                                                tables/datasources and partition
                                                information are only shown up
                                                when read access is given to the
                                                users.
                                            </p>
                                        </template>
                                    </a-tooltip>
                                </div>
                            </div>
                        </a-checkbox>
                    </a-checkbox-group>
                    <!-- <div class="wrapper-desc">
                        <div
                            v-for="(item, i) in scope.scopes"
                            :key="i"
                            class="text-gray-500 desc"
                        >
                            {{ item.desc }}
                            <a-tooltip
                                v-if="item.label.toLowerCase() === 'read'"
                                placement="right"
                                color="white"
                            >
                                <span class="text-blue-600 pointer-events-auto"
                                    >Learn more</span
                                >
                                <template #title>
                                    <p class="m-3 text-gray">
                                        Atlan opens up most non-sensitive
                                        metadata attributes to all product users
                                        by default <br />
                                        Sensitive information of assets coming
                                        in from source like source urls,
                                        formulas in calculated fields, raw SQL
                                        QUERY in views, queries, upstream
                                        information around tables/datasources
                                        and partition information are only shown
                                        up when read access is given to the
                                        users.
                                    </p>
                                </template>
                            </a-tooltip>
                        </div>
                    </div> -->
                </div>
            </a-collapse-panel>
        </a-collapse>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, ref, toRefs } from 'vue'
    // import {} from '../composables/useEditPersona'
    import useScopeService from '../composables/useScopeService'

    export default defineComponent({
        name: 'MetadataScopes',
        components: {},
        props: {
            actions: {
                type: Array as PropType<string[]>,
                required: true,
            },
            type: {
                type: String,
                required: true,
                default: () => 'persona',
            },
        },
        emits: ['update:actions', 'change'],
        setup(props, { emit }) {
            const { actions, type } = toRefs(props)
            const { scopeList } = useScopeService().listScopes(type.value)
            const collapseRef = ref()

            const groupedActions = computed(() =>
                scopeList.map((scp) => ({
                    type: scp.type,
                    scopes: actions.value.filter((ac) =>
                        scp.scopes.find((e) => e.value === ac)
                    ),
                }))
            )

            const defaultExpandedState = ref(scopeList.map((scp) => scp.type))

            function updateSelection(scopeType: string, checked: string[]) {
                const allScopes = Object.values(groupedActions.value).reduce(
                    (acc, curr) => {
                        // Only push the selected checkboxes for it's associated type
                        // For all other types push whatever is already there
                        if (curr.type !== scopeType) acc.push(...curr.scopes)
                        else acc.push(...checked)
                        return acc
                    },
                    [] as string[]
                )
                emit('update:actions', allScopes)
                emit('change')
            }

            function toggleCheckAll(idx: number) {
                if (
                    groupedActions.value[idx].scopes.length <
                    scopeList[idx].scopes.length
                )
                    updateSelection(
                        scopeList[idx].type,
                        scopeList[idx].scopes.map((e) => e.value)
                    )
                else updateSelection(scopeList[idx].type, [])
            }

            return {
                collapseRef,
                scopeList,
                groupedActions,
                updateSelection,
                toggleCheckAll,
                defaultExpandedState,
            }
        },
    })
</script>
<style lang="less" module>
    .checkbox_custom {
        :global(.ant-checkbox-group-item) {
            // @apply my-1  !important;
        }
    }
</style>
<style lang="less">
    .meta-data-scope-container {
        .ant-collapse-header {
            background-color: #fafafa;
        }
    }
    .meta-data-scope {
        .ant-checkbox {
            @apply mt-1;
            // padding-top: 2px;
            // @apply pt-2;
        }
        display: flex;
        .ant-checkbox-wrapper {
            display: flex;
            .ant-checkbox {
                margin-right: 7px;
                height: fit-content;
            }
        }
        .wrapper-desc {
            flex: 1;
        }
        .desc {
            // margin-top: 0.25rem;
            // margin-bottom: 0.25rem;
            // @apply mt-1;
        }
        .wrapper-checkbox {
            // display: flex;
            // flex-direction: column;
            // flex: 1;
            // height: auto;
            .ant-checkbox-wrapper {
                // height: 40px;
            }
            // justify-content: space-between;
        }
    }
</style>
