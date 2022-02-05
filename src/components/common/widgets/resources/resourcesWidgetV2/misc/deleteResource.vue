<template>
    <div @click="visible = true">
        <slot name="trigger" />
    </div>

    <a-modal
        v-model:visible="visible"
        width="25%"
        :closable="false"
        :footer="null"
    >
        <div class="p-3">
            <p class="mb-1 font-bold text-md">Delete Resource</p>
            <p class="text-md">
                Are you sure you want to delete the resource
                {{ link.name }} of
                <span class="font-bold">entity.name</span>
            </p>
        </div>

        <div class="flex justify-end p-3 space-x-2 border-t border-gray-200">
            <AtlanButton
                color="minimal"
                padding="compact"
                size="sm"
                @click="visible = false"
            >
                Cancel
            </AtlanButton>
            <AtlanButton
                color="danger"
                padding="compact"
                size="sm"
                :loading="removeStatus === 'loading'"
                @click="() => remove(link.qualifiedName)"
            >
                Delete
            </AtlanButton>
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
    } from 'vue'
    import { message } from 'ant-design-vue'
    import { Link } from '~/types/resources.interface'

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

            const remove: Function = inject('remove')
            const removeStatus: Ref = inject('removeStatus')

            watch(removeStatus, (v) => {
                // FIXME this watcher is running multiple times, ???!
                if (v === 'success') {
                    message.success({
                        content: `Successfully removed resource "${link.value.name}"`,
                        duration: 1.5,
                        key: 'update',
                    })
                    visible.value = false
                } else if (v === 'error') {
                    message.error({
                        content: `Failed to removed resource "${link.value.name}"`,
                        duration: 1.5,
                        key: 'error',
                    })
                }
            })

            return {
                remove,
                removeStatus,
                visible,
            }
        },
    })
</script>
