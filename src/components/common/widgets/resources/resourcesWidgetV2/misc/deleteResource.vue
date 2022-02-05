<template>
    <div @click="visible = true">
        <slot name="trigger" @click="visible = true" />
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
                <b> {{ link.name }}</b> of
                <span class="font-bold">persona.name</span>?
            </p>
        </div>

        <div class="flex justify-end p-3 space-x-2 border-t border-gray-200">
            <a-button @click="visible = false">Cancel</a-button>
            <a-button type="danger" @click="handleDelete">Delete</a-button>
        </div>
    </a-modal>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs, ref, inject } from 'vue'
    import { Link } from '~/types/resources.interface'

    export default defineComponent({
        name: 'DeleteResourceModal',
        props: {
            link: {
                type: Object as PropType<Link>,
                required: true,
            },
        },
        setup(props) {
            const { link } = toRefs(props)

            const visible = ref<boolean>(false)

            const remove: Function = inject('delete')

            const handleDelete = async () => {
                await remove(link.value.qualifiedName)
                visible.value = false
            }

            return {
                // isLoading,
                visible,
                handleDelete,
            }
        },
    })
</script>
