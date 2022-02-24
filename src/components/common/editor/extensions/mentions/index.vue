<template>
    <div
        class="relative border border-gray-200 overflow-y-auto rounded-lg shadow-lg"
    >
        <template v-for="(mention, index) in items" :key="index">
            <UserMention
                v-if="isUser(mention)"
                :selected="selectedIndex === index"
                :user="mention"
            />
            <GroupMention
                v-else
                :group="mention"
                :selected="selectedIndex === index"
            />
        </template>
    </div>
</template>

<script lang="ts">
    import UserMention from '@common/editor/extensions/mentions/user.vue'
    import GroupMention from '@common/editor/extensions/mentions/group.vue'
    import { ref, toRefs } from 'vue'

    export default {
        name: 'MentionList',
        components: { UserMention, GroupMention },
        props: {
            items: {
                type: Array,
                required: true,
            },

            command: {
                type: Function,
                required: true,
            },

            query: {
                type: String,
                required: false,
                default: '',
            },
        },
        setup(props) {
            const { items, command, query } = toRefs(props)
            const isUser = (mention) => mention.firstName && mention.username
            const selectedIndex = ref(0)
            const upHandler = () => {
                selectedIndex.value =
                    (selectedIndex.value + items.value.length - 1) %
                    items.value.length
            }
            const downHandler = () => {
                selectedIndex.value =
                    (selectedIndex.value + 1) % items.value.length
            }
            const selectItem = () => {
                const item = items.value[selectedIndex.value]

                if (item) {
                    command.value({ id: item.username })
                }
            }
            const onKeyDown = ({ event }) => {
                if (event.key === 'ArrowUp') {
                    upHandler()
                    return true
                }

                if (event.key === 'ArrowDown') {
                    downHandler()
                    return true
                }

                if (event.key === 'Enter') {
                    selectItem()
                    return true
                }

                return false
            }

            return {
                isUser,
                selectedIndex,
                onKeyDown,
                query,
            }
        },
    }
</script>

<style scoped></style>
