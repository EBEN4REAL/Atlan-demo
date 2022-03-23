import { VueRenderer } from '@tiptap/vue-3'
import tippy from 'tippy.js'
import { reactive } from 'vue'
import { or, until } from '@vueuse/core'
import MentionList from './index.vue'
import { useUsers } from '~/composables/user/useUsers'
import useGroups from '~/composables/group/useGroups'

const userListAPIParams = reactive({
    limit: 5,
    offset: 0,
    sort: 'firstName',
    filter: {},
})
const {
    userList,
    isLoading: isUserLoading,
    getUserList,
} = useUsers(userListAPIParams, true)

const groupListAPIParams = reactive({
    limit: 5,
    offset: 0,
    sort: 'name',
    filter: {},
})
const {
    groupList,
    isLoading: isGroupLoading,
    cancelRequest: cancelGroupRequest,
    getGroupList,
} = useGroups(groupListAPIParams, '', {})

const isListLoading = or(isGroupLoading, isUserLoading)

export default {
    items: async ({ query }) => {
        userListAPIParams.filter = {
            $or: [
                { firstName: { $ilike: `${query}%` } },
                { lastName: { $ilike: `${query}%` } },
                { username: { $ilike: `${query}%` } },
            ],
        }
        groupListAPIParams.filter = {
            $or: [
                { alias: { $ilike: `${query}%` } },
                { name: { $ilike: `${query}%` } },
            ],
        }
        getUserList()
        cancelGroupRequest()
        await getGroupList()
        return until(or(isUserLoading, isGroupLoading))
            .toBe(false)
            .then(() =>
                [...userList.value].concat([...groupList.value]).slice(0, 5)
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
                    props: {
                        ...props,
                        isListLoading,
                    },
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
                component.updateProps({
                    ...props,
                    isListLoading,
                })

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
