<template>
    <div class="meta-data-scope-container">
        <div v-for="(scope, idx) in scopeList" :key="scope.type">
            <div class="px-3 py-3 mx-3 mb-6 border border-dashed">
                <a-checkbox
                    class="mb-3 font-bold"
                    data-test-id="checkbox"
                    :checked="
                        groupedActions[idx].scopes.length ===
                        scopeList[idx].scopes.length
                    "
                    @click.stop="toggleCheckAll(idx)"
                >
                    All {{ scope.type }} permissions
                </a-checkbox>

                <a-checkbox-group
                    :value="groupedActions[idx].scopes"
                    :name="scope.type"
                    :options="scope.scopes"
                    :class="['capitalize', $style.checkbox_custom]"
                    class="wrapper-checkbox"
                    @update:value="updateSelection(scope.type, $event)"
                ></a-checkbox-group>
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
