<template>
    <a-button-group>
        <a-tooltip placement="topLeft">
            <template #title>
                <span>Add users</span>
            </template>
            <a-button
                v-if="permissions.update"
                size="small"
                type="secondary"
                class="mr-3.5 rounded"
                @click="$emit('addMembers')"
            >
                <AtlanIcon icon="AddUser"></AtlanIcon>
            </a-button>
        </a-tooltip>
        <a-dropdown
            v-if="permissions.remove && permissions.update"
            :trigger="['click']"
            :visible="dropDownOpened"
            @visibleChange="handleVisibleChange"
        >
            <a-button size="small" type="secondary" class="rounded">
                <AtlanIcon icon="KebabMenu"></AtlanIcon>
            </a-button>
            <template #overlay>
                <a-menu>
                    <a-menu-item
                        v-if="permissions.update"
                        key="1"
                        :disabled="markAsDefaultLoading || deleteGroupLoading"
                    >
                        <div class="flex items-center">
                            <template v-if="markAsDefaultLoading">
                                <AtlanIcon
                                    icon="CircleLoader"
                                    class="animate-spin"
                                />
                            </template>
                            <a-checkbox
                                :class="{
                                    'hide-checkbox': markAsDefaultLoading,
                                }"
                                :checked="group.isDefault === 'true'"
                                :disabled="
                                    markAsDefaultLoading || deleteGroupLoading
                                "
                                @click="$emit('toggleDefault')"
                                >{{
                                    group.isDefault === 'true'
                                        ? 'Unmark'
                                        : 'Mark as'
                                }}
                                default
                            </a-checkbox>
                            <a-tooltip placement="topLeft">
                                <template #title>
                                    <span>
                                        New users are automatically added to
                                        default groups
                                    </span>
                                </template>

                                <AtlanIcon
                                    icon="Info"
                                    class="text-xs text-gray-500"
                                />
                            </a-tooltip>
                        </div>
                    </a-menu-item>
                    <a-menu-item
                        v-if="permissions.remove"
                        key="2"
                        :disabled="deleteGroupLoading || markAsDefaultLoading"
                        @click="$emit('deleteGroup')"
                    >
                        <div class="flex items-center text-red-600">
                            <div v-if="deleteGroupLoading">
                                <AtlanIcon
                                    icon="CircleLoader"
                                    class="mr-1 animate-spin"
                                />
                            </div>
                            <AtlanIcon icon="Trash" class="mb-1 mr-1 text-xs" />

                            Delete
                        </div>
                    </a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>
    </a-button-group>
</template>

<script lang="ts">
    import { ref, defineComponent, watch, toRefs } from 'vue'

    export default defineComponent({
        name: 'GroupsActionButton',
        props: {
            group: {
                type: Object,
                default: () => {},
                required: true,
            },
            permissions: {
                type: Object,
                default: () => {},
                required: true,
            },
            markAsDefaultLoading: {
                type: Boolean,
                default: false,
                required: true,
            },
            deleteGroupLoading: {
                type: Boolean,
                default: false,
                required: true,
            },
        },
        emits: ['addMembers', 'deleteGroup', 'toggleDefault'],
        setup(props) {
            const { markAsDefaultLoading, deleteGroupLoading } = toRefs(props)
            const dropDownOpened = ref(false)

            const handleVisibleChange = (flag) => {
                // need to handle dropdown manual so as to keep
                // open when deleting or toggle default is still happening
                if (flag) dropDownOpened.value = true
                if (!flag) {
                    if (
                        !markAsDefaultLoading.value &&
                        !deleteGroupLoading.value
                    )
                        dropDownOpened.value = false
                }
            }

            // automatically close dropdown after loading action is complete
            watch(
                [markAsDefaultLoading, deleteGroupLoading],
                (
                    [newDefaultVal, newDeleteVal],
                    [oldDefaultVal, oldDeleteVal]
                ) => {
                    if (
                        (oldDefaultVal === true && newDefaultVal === false) ||
                        (oldDeleteVal === true && newDeleteVal === false)
                    ) {
                        dropDownOpened.value = false
                    }
                }
            )

            return {
                dropDownOpened,
                handleVisibleChange,
            }
        },
    })
</script>
