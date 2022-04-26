<template>
    <div @click="visible = true">
        <slot name="trigger" />
    </div>

    <a-modal
        v-model:visible="visible"
        width="30%"
        :closable="false"
        :footer="null"
    >
        <div class="p-3">
            <p class="mb-1 font-bold text-md">
                Delete {{ isSlackTab ? 'Slack thread' : 'Resource' }}
            </p>
            <p class="text-md">
                Are you sure you want to delete
                {{ isSlackTab ? 'Slack thread' : 'resource' }}
                "{{ link.attributes.name }}" of
                <span class="font-bold">{{ entityName }} </span>?
            </p>
        </div>

        <div class="flex justify-end p-3 space-x-2 border-t border-gray-200">
            <AtlanButton2
                color="secondary"
                label="Cancel"
                @click="visible = false"
            />

            <AtlanButton2
                color="danger"
                label="Delete"
                :loading="removeStatus === 'loading'"
                @click="
                    () =>
                        remove(link.guid || link.uniqueAttributes.qualifiedName)
                "
            />
        </div>
    </a-modal>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        toRefs,
        ref,
        inject,
        Ref,
        watch,
        computed,
    } from 'vue'
    import { message } from 'ant-design-vue'
    import { Link } from '~/types/resources.interface'
    import { getDomain } from '~/utils/url'

    export default defineComponent({
        name: 'DeleteResourceModal',
        props: {
            link: {
                type: Object as PropType<Link>,
                required: false,
                default: () => null,
            },
        },
        setup(props) {
            const { link } = toRefs(props)

            const visible = ref<boolean>(false)

            const remove: Function = inject('remove') as Function
            const removeStatus: Ref = inject('removeStatus') ?? ref('')
            const entityName = inject('entityName')
            const tab = inject('tab') as Ref
            const isTab = computed(() => !!tab?.value?.component)
            const isSlackTab = computed(
                () => tab.value.component === 'SlackResourcesTab'
            )
            const isSlackLink = computed(
                () => getDomain(link.value.attributes.link) === 'slack.com'
            )

            watch(removeStatus, (v) => {
                // FIXME this watcher is running multiple times, ???!
                if (v === 'success') {
                    if (link.value?.attributes?.name)
                        message.success({
                            content: `Successfully removed ${
                                isSlackTab.value ? 'Slack thread' : 'resource'
                            } "${link.value.attributes.name}"`,
                            duration: 1.5,
                            key: 'update',
                        })
                    visible.value = false
                } else if (v === 'error') {
                    if (link.value?.attributes?.name)
                        message.error({
                            content: `Failed to removed ${
                                isSlackTab.value ? 'Slack thread' : 'resource'
                            } "${link.value.attributes.name}"`,
                            duration: 1.5,
                            key: 'error',
                        })
                }
            })

            return {
                isSlackTab,
                remove,
                removeStatus,
                visible,
                entityName,
            }
        },
    })
</script>
