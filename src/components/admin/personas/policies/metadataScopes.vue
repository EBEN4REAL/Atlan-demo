<template>
    <div>
        <span class="mb-1 text-sm text-gray-700">SCOPES</span>
        <div class="mb-3" v-for="(scope, idx) in scopeList">
            <span class="block mb-1 text-sm text-gray-500 capitalize">{{
                scope.type
            }}</span>
            <a-checkbox-group
                :value="groupedActions[idx].scopes"
                @update:value="updateSelection(scope.type, $event)"
                :name="scope.type"
                :options="scope.scopes"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, ref, toRefs } from 'vue'
    import { isEditing } from '../composables/useEditPersona'
    import useScopeService from '~/services/heracles/composables/scopes'

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
            const { scopeList } = useScopeService().listScopes()

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

            return {
                scopeList,
                isEditing,
                groupedActions,
                updateSelection,
            }
        },
    })
</script>
