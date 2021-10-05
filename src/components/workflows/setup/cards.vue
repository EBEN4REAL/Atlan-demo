<template>
    <div class="flex justify-between gap-y-5">
        <div
            v-for="(i, x) in list"
            :key="x"
            class="flex items-center justify-center w-40 h-24 border rounded cursor-pointer "
            :class="
                selectedItemId === i.metadata.uid
                    ? 'border-primary  bg-primary-light'
                    : 'bg-white'
            "
            @click="handlePreview(i)"
        >
            {{ i.metadata.name }}
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, toRefs, watch } from 'vue'

    export default defineComponent({
        name: 'WorkflowCards',
        props: {
            list: {
                type: Array,
                required: true,
            },
            selectedItemId: {
                type: String,
                required: true,
                default: () => null,
            },
            autoSelect: {
                type: Boolean,
                required: false,
                default: () => false,
            },
        },
        emits: ['preview', 'update:autoSelect'],

        setup(props, { emit }) {
            const { list } = toRefs(props)

            function handlePreview(item: any) {
                emit('preview', item)
            }

            // watch(
            //     list,
            //     () => {
            //         if (autoSelect.value) {
            //             if (list.value.length) handlePreview(list.value[0])
            //         } else emit('update:autoSelect', true)
            //     },
            //     { immediate: true }
            // )
            return {
                handlePreview,
            }
        },
    })
</script>

<style scoped></style>
