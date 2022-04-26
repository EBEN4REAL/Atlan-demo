<template>
    <div
        class="relative border border-gray-200 overflow-y-auto rounded-lg shadow-lg max-w-xs"
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
    import { ref, toRefs } from 'vue'
    import UserMention from './user.vue'
    import GroupMention from './group.vue'
    import AtlanLoader from '@common/loaders/atlanLoader.vue'

    export default {
        name: 'MentionList',
        components: { AtlanLoader, UserMention, GroupMention },
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

            isListLoading: {
                type: Boolean,
                required: false,
                default: false,
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
                    command.value({
                        id: item.username ? item.username : item.alias,
                        'is-user': item.hasOwnProperty('username'),
                    })
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
