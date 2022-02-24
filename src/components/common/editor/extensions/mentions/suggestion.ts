import { VueRenderer } from '@tiptap/vue-3'
import tippy from 'tippy.js'
import { reactive, computed } from 'vue'
import { and, until } from '@vueuse/core'
import MentionList from './index.vue'
import { useUsers } from '~/composables/user/useUsers'
import useGroups from '~/composables/group/useGroups'

export default {
    items: async ({ query }) => {
        const userListAPIParams = reactive({
            limit: 5,
            offset: 0,
            sort: 'firstName',
            filter: {
                $and: [
                    {
                        $or: [
                            { firstName: { $ilike: `${query}%` } },
                            { lastName: { $ilike: `${query}%` } },
                            { username: { $ilike: `${query}%` } },
                        ],
                    },
                ],
            },
        })
        const { userList, isLoading: isUserLoading } = useUsers(
            userListAPIParams,
            true
        )

        const groupListAPIParams = reactive({
            limit: 50,
            offset: 0,
            sort: '-createdAt',
            filter: {},
        })
        console.log(groupListAPIParams)
        const { groupList, isLoading: isGroupLoading } = useGroups(
            groupListAPIParams,
            'LIST_GROUPS_MENTIONS_README'
        )

        return until(and(isUserLoading, isGroupLoading))
            .toBe(false)
            .then(() =>
                [
                    ...userList.value
                        .concat(...groupList.value)
                        .sort((x, y) => {
                            const firstProperty = x.hasOwnProperty('alias')
                                ? x.alias
                                : x.username
                            const secondProperty = y.hasOwnProperty('alias')
                                ? y.alias
                                : y.username
                            return firstProperty.localeCompare(secondProperty)
                        }),
                ].slice(0, 5)
            )
            .catch(() => [])
    },

    render: () => {
        let component
        let popup

        return {
            onStart: (props) => {
                component = new VueRenderer(MentionList, {
                    // using vue 2:
                    // parent: this,
                    // propsData: props,
                    // using vue 3:
                    props,
                    editor: props.editor,
                })

                popup = tippy('body', {
                    getReferenceClientRect: props.clientRect,
                    appendTo: () => document.body,
                    content: component.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: 'manual',
                    placement: 'bottom-start',
                })
            },

            onUpdate(props) {
                component.updateProps(props)

                popup[0].setProps({
                    getReferenceClientRect: props.clientRect,
                })
            },

            onKeyDown(props) {
                if (props.event.key === 'Escape') {
                    popup[0].hide()

                    return true
                }
                return component.ref?.onKeyDown(props)
            },

            onExit() {
                popup[0].destroy()
                component.destroy()
            },
        }
    },
}
