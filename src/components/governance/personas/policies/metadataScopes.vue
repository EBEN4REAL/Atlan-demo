<template>
    <div class="mx-6 border rounded-lg meta-data-scope-container">
        <div v-for="(scope, idx) in scopeList" :key="scope.type">
            <div>
                <div class="flex px-4 py-3 bg-gray-100">
                    <a-checkbox
                        :indeterminate="
                            groupedActions[idx].scopes.length ===
                            scopeList[idx].scopes.length
                                ? false
                                : Boolean(groupedActions[idx].scopes.length)
                        "
                        class="text-sm font-bold text-gray-700"
                        data-test-id="checkbox"
                        :checked="
                            groupedActions[idx].scopes.length ===
                            scopeList[idx].scopes.length
                        "
                        @click.stop="toggleCheckAll(idx)"
                    >
                        {{ scope.type }}
                    </a-checkbox>
                </div>
                <div class="p-2 bg-white">
                    <a-checkbox-group
                        :value="groupedActions[idx].scopes"
                        :name="scope.type"
                        :class="['capitalize', $style.checkbox_custom]"
                        class="w-full"
                        @update:value="updateSelection(scope.type, $event)"
                    >
                        <div
                            v-for="(check, i) in scope.scopes"
                            :key="i"
                            class="w-full p-1 px-2 hover:bg-primary-light"
                            :class="{ ' mt-4': i !== 0 }"
                        >
                            <a-popover
                                v-if="
                                    check.value === 'link-assets' && !hasLink
                                        ? false
                                        : true
                                "
                                placement="left"
                            >
                                <template #content>
                                    <div
                                        class="w-64 p-2 bg-gray-700 rounded"
                                        :class="
                                            check.gif
                                                ? 'container-gif-permission'
                                                : ''
                                        "
                                    >
                                        <img
                                            v-if="check.gif"
                                            :src="check.gif"
                                            class="mb-2 rounded"
                                        />
                                        <span class="text-sm text-white">
                                            {{ check.desc }}
                                        </span>
                                    </div>
                                </template>
                                <a-checkbox
                                    :value="check.value"
                                    class="text-sm text-gray-700"
                                >
                                    {{ check.label }}
                                </a-checkbox>
                            </a-popover>
                        </div>
                    </a-checkbox-group>

                    <!-- <a-checkbox-group
                        :value="groupedActions[idx].scopes"
                        :name="scope.type"
                        :options="scope.scopes"
                        :class="['capitalize', $style.checkbox_custom]"
                        class="flex flex-wrap wrapper-checkbox"
                        @update:value="updateSelection(scope.type, $event)"
                    ></a-checkbox-group> -->
                </div>
            </div>
        </div>
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
            const hasLink = computed(() =>
                actions.value?.includes('link-assets')
            )

            return {
                collapseRef,
                scopeList,
                groupedActions,
                updateSelection,
                toggleCheckAll,
                defaultExpandedState,
                hasLink,
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
    .content-popover-permission {
        max-width: 150px;
    }
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
    }
    .wrapper-checkbox {
        gap: 15px !important;
    }
    .container-gif-permission {
        min-height: 150px;
    }
</style>
