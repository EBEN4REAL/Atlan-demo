<template>
    <div class="mb-3 text-xs text-gray-500">
        <p class="mb-1 text-xs">Description</p>
        <div
            v-if="
                (description && description !== '') || showEditableDescription
            "
        >
            <div
                id="description-sideabr"
                class="inline-block text-sm cursor-pointer text-gray"
                contenteditable
                @blur="handleDescriptionEdit"
                @keydown.enter="endEditDescription"
                @keydown.esc="cancelEditDescription"
                v-text="description"
            ></div>
        </div>
        <!-- <span v-if="description" class="mb-0">
                {{ description }}
            </span>-->

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
            const { update, handleCancel, description } =
                updateDescription(selectedAsset)

            const showEditableDescription = ref<boolean>(false)

            const handleDescriptionEdit = (e: any) => {
                description.value = e.target.innerText
                showEditableDescription.value = false
                update()
            }

            const endEditDescription = () => {
                document.getElementById('description-sidebar').blur()
            }

            const cancelEditDescription = () => {
                handleCancel()
            }

            const handleAddDescriptionClick = () => {
                showEditableDescription.value = true
            }

            watch(description, () => {
                emit('update:selectedAsset', selectedAsset.value)
            })

            return {
                description,
                handleDescriptionEdit,
                endEditDescription,
                cancelEditDescription,
                showEditableDescription,
                handleAddDescriptionClick,
            }
        },
    })
</script>
