<template>
    <div class="text-xs text-gray-500" :class="usingInInfo ? 'mb-3' : ''">
        <p v-if="usingInInfo" class="mb-1 text-xs">Description</p>
        <div v-if="showEditableDescription && !isLoading">
            <a-textarea
                id="description-sidebar"
                v-model:value="descriptionInput"
                class="inline-block w-full text-sm cursor-pointer  text-gray focus:bg-gray-100"
                autofocus
                placeholder="Add an asset description"
                show-count
                :maxlength="140"
                :rows="4"
                @blur="handleDescriptionEdit"
                @pressEnter="endEditDescription"
            >
            </a-textarea>
        </div>
        <span
            v-if="
                description &&
                description !== '' &&
                !showEditableDescription &&
                !isLoading
            "
            class="inline-block w-full p-2 text-sm rounded-sm cursor-pointer  text-gray hover:bg-gray-100"
            :style="usingInInfo ? 'margin-left: -8px' : ''"
            @click="handleAddDescriptionClick"
        >
            {{ description }}
        </span>
        <span
            v-if="
                (!description || description === '') &&
                !showEditableDescription &&
                !isLoading
            "
            class="text-xs cursor-pointer text-primary hover:underline"
            @click="handleAddDescriptionClick"
        >
            Add description
        </span>
        <div
            v-if="isLoading"
            class="flex items-center justify-center text-sm leading-none"
        >
            <a-spin size="small" class="leading-none"></a-spin>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        toRefs,
        ref,
        watch,
        nextTick,
    } from 'vue'
    import updateDescription from '~/composables/asset/updateDescription'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            usingInInfo: {
                type: Boolean,
                default: () => true,
            },
        },
        emits: ['update:selectedAsset'],
        setup(props, { emit }) {
            const { selectedAsset } = toRefs(props)
            const { update, description, isLoading } =
                updateDescription(selectedAsset)

            const showEditableDescription = ref<boolean>(false)

            const descriptionInput = ref()
            const handleDescriptionEdit = (e: any) => {
                if (description.value !== e.target.value) {
                    description.value = e.target.value
                    update()
                }
                showEditableDescription.value = false
            }

            const endEditDescription = () => {
                document.getElementById('description-sidebar').blur()
            }

            const handleAddDescriptionClick = () => {
                showEditableDescription.value = true
                nextTick(() => {
                    descriptionInput.value = description.value
                    document.getElementById('description-sidebar').focus()
                })
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
                descriptionInput,
                isLoading,
            }
        },
    })
</script>
