<template>
    <a-collapse expand-icon-position="right" :activeKey="defaultExpandedState">
        <template #expandIcon="{ isActive }">
            <div>
                <AtlanIcon
                    icon="ChevronDown"
                    class="ml-3 text-gray-500 transition-transform duration-300 transform "
                    :class="isActive ? '-rotate-180' : 'rotate-0'"
                />
            </div>
        </template>

        <a-collapse-panel v-for="(scope, idx) in scopeList" :key="scope.type">
            <template #header>
                <a-checkbox
                    data-test-id="checkbox"
                    :checked="
                        groupedActions[idx].scopes.length ===
                        scopeList[idx].scopes.length
                    "
                    :indeterminate="
                        0 < groupedActions[idx].scopes.length &&
                        groupedActions[idx].scopes.length <
                            scopeList[idx].scopes.length
                    "
                    @click.stop="toggleCheckAll(idx)"
                >
                    {{ scope.type }}
                </a-checkbox>
            </template>
            <a-checkbox-group
                :value="groupedActions[idx].scopes"
                :name="scope.type"
                :options="scope.scopes"
                class="capitalize"
                @update:value="updateSelection(scope.type, $event)"
            />
        </a-collapse-panel>
    </a-collapse>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, ref, toRefs } from 'vue'
    import {} from '../composables/useEditPersona'
    import useScopeService from '../composables/useScopeService'

    export default defineComponent({
        name: 'MetadataScopes',
        components: {},
        props: {
            actions: {
                type: Array as PropType<string[]>,
                required: true,
            },
        },
        emits: ['update:actions', 'change'],
        setup(props, { emit }) {
            const { actions } = toRefs(props)
            const { scopeList } = useScopeService().listScopes()
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
