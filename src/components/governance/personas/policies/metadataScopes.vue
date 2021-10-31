<template>
    <a-collapse expand-icon-position="right">
        <template #expandIcon="{ isActive }">
            <div>
                <AtlanIcon
                    icon="ChevronDown"
                    class="ml-3 text-gray-500 transition-transform duration-300 transform "
                    :class="isActive ? '-rotate-180' : 'rotate-0'"
                />
            </div>
        </template>

        <a-collapse-panel v-for="(scope, idx) in scopeList" :key="idx">
            <template #header>
                <a-checkbox
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
                ></a-checkbox>
                {{ scope.type }}
            </template>
            <a-checkbox-group
                :value="groupedActions[idx].scopes"
                :name="scope.type"
                :options="scope.scopes"
                @update:value="updateSelection(scope.type, $event)"
            />
        </a-collapse-panel>
    </a-collapse>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, toRefs } from 'vue'
    import {} from '../composables/useEditPersona'
    import useScope from '~/composables/scope/useScope'

    export default defineComponent({
        name: 'MetadataScopes',
        components: {},
        props: {
            actions: {
                type: Array as PropType<string[]>,
                required: true,
            },
        },
        emits: ['update:actions'],
        setup(props, { emit }) {
            const { actions } = toRefs(props)
            const { scopeList } = useScope()

            const groupedActions = computed(() =>
                scopeList.map((scp) => ({
                    type: scp.type,
                    scopes: actions.value.filter((ac) =>
                        scp.scopes.includes(ac)
                    ),
                }))
            )

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
            }

            function toggleCheckAll(idx: number) {
                if (
                    groupedActions.value[idx].scopes.length <
                    scopeList[idx].scopes.length
                )
                    updateSelection(scopeList[idx].type, scopeList[idx].scopes)
                else updateSelection(scopeList[idx].type, [])
            }

            return {
                scopeList,
                groupedActions,
                updateSelection,
                toggleCheckAll,
            }
        },
    })
</script>