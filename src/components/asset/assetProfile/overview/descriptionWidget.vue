<template>
    <!-- Description Component -->
    <div>
        <div class="mb-8">
            <div v-if="description" class="flex justify-between">
                <p>{{ description }}</p>
                <a-button type="link" @click="showModal">
                    Edit description
                </a-button>
            </div>
            <div v-else class="flex justify-between text-gray-400">
                No Description Found
                <span class="ml-2">.</span>
                <a-button type="link" @click="showModal">
                    Add description
                </a-button>
            </div>
        </div>

        <!-- Edit description modal -->
        <!-- eslint-disable-next-line vue/no-v-model-argument -->
        <a-modal v-model:visible="visible" @ok="handleOk">
            <template #title
                ><p v-if="description">Edit description</p>
                <p v-else>Add description</p></template
            >
            <template #footer>
                <a-button key="back" @click="handleCancelModal"
                    >Cancel</a-button
                >
                <a-button
                    key="submit"
                    type="primary"
                    :loading="isLoading"
                    @click="handleOk"
                    >Update</a-button
                >
            </template>
            <!-- eslint-disable-next-line vue/no-v-model-argument -->
            <a-textarea v-model:value="description" placeholder="Description">
            </a-textarea>
        </a-modal>
    </div>
</template>
<script lang="ts">
    // Vue
    import { defineComponent, ref, watch, toRefs } from 'vue'

    // composables

    import { useMagicKeys } from '@vueuse/core'
    import Tooltip from '@common/ellipsis/index.vue'
    import updateDescription from '~/composables/asset/updateDescription'

    export default defineComponent({
        components: {
            Tooltip,
        },
        props: ['asset'],

        setup(props) {
            const visible = ref<boolean>(false)

            const { asset } = toRefs(props)
            const {
                isLoading,
                update,
                handleCancel,
                isReady,
                state,
                description,
                isCompleted,
            } = updateDescription(asset)

            const showModal = () => {
                visible.value = true
            }

            const handleCancelModal = async () => {
                await handleCancel()
                visible.value = false
            }

            const handleOk = () => {
                update()
                visible.value = false
            }

            const keys = useMagicKeys()
            // eslint-disable-next-line dot-notation
            const esc = keys['Escape']

            watch(esc, (v) => {
                if (v) {
                    handleCancel()
                }
            })

            return {
                showModal,
                handleOk,
                visible,
                isLoading,
                handleCancel,
                isReady,
                state,
                description,
                isCompleted,
                handleCancelModal,
            }
        },
    })
</script>
