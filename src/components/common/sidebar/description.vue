<template>
    <div class="mb-3 text-xs text-gray-500">
        <p class="mb-1 text-xs">Description</p>
        <div
            v-if="
                (description && description !== '') || showEditableDescription
            "
        >
            <div
                id="description-sidebar"
                class="inline-block p-2 text-sm cursor-pointer  text-gray focus:bg-gray-100 hover:bg-gray-100 focus:border-gray-light"
                contenteditable
                @blur="handleDescriptionEdit"
                @keydown.enter="endEditDescription"
                v-text="description"
            ></div>
        </div>

        <span
            v-if="
                (!description || description === '') && !showEditableDescription
            "
            class="text-xs cursor-pointer text-primary hover:underline"
            @click="handleAddDescriptionClick"
        >
            Add description
        </span>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs, ref, watch } from 'vue'
    import updateDescription from '~/composables/asset/updateDescription'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        emits: ['update:selectedAsset'],
        setup(props, { emit }) {
            const { selectedAsset } = toRefs(props)
            const { update, description } = updateDescription(selectedAsset)

            const showEditableDescription = ref<boolean>(false)

            const handleDescriptionEdit = (e: any) => {
                description.value = e.target.innerText
                update()
                showEditableDescription.value = false
            }

            const endEditDescription = () => {
                document.getElementById('description-sidebar').blur()
            }

            const handleAddDescriptionClick = () => {
                showEditableDescription.value = true
                document.getElementById('description-sidebar').focus()
            }

            watch(description, () => {
                emit('update:selectedAsset', selectedAsset.value)
            })

            return {
                description,
                handleDescriptionEdit,
                endEditDescription,
                showEditableDescription,
                handleAddDescriptionClick,
            }
        },
    })
</script>

<style lang="less" scoped>
    #description-sidebar {
        margin-left: -8px;
    }
</style>
