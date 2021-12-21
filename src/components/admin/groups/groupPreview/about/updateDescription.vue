<template>
    <div class>
        <div>
            <div class="flex flex-row items-center cursor-pointer group">
                <p class="flex items-center mb-0 text-gray-500">
                    Description
                    <AtlanIcon
                        v-if="updateSuccess"
                        icon="Approve"
                        class="inline-block h-3 mb-1 ml-1 text-success"
                    />
                </p>
                <p
                    v-if="!isUpdate"
                    v-auth="map.UPDATE_GROUP"
                    class="mb-0 ml-2 text-xs leading-none transition duration-300 ease-in-out delay-100 opacity-0 text-primary group-hover:opacity-100"
                    @click="onUpdate"
                >
                    edit
                </p>
            </div>
            <div v-if="isUpdate" class="flex flex-col">
                <a-textarea
                    v-model:value="groupDescriptionLocal"
                    placeholder="Group Name"
                    :disabled="updateLoading"
                    :auto-size="{ minRows: 1, maxRows: 3 }"
                />
                <div class="flex justify-between max-w-full mt-1">
                    <div>
                        <a-button
                            type="primary"
                            size="small"
                            class="px-2 mr-1"
                            :disabled="updateLoading"
                            @click="handleUpdate"
                            >update</a-button
                        >
                        <a-button
                            type="link"
                            size="small"
                            class="p-0"
                            @click="onCancel"
                            >cancel</a-button
                        >
                    </div>
                    <div class="flex">
                        <AtlanIcon
                            v-if="updateLoading"
                            icon="CircleLoader"
                            class="flex h-4 animate-spin"
                        />
                        <a-popover
                            v-else-if="updateErrorMessage"
                            placement="top"
                        >
                            <template #content>
                                <div class="p-4">{{ updateErrorMessage }}</div>
                            </template>
                            <AtlanIcon
                                icon="ExclaimCircle"
                                class="cursor-pointer text-error"
                            />
                        </a-popover>
                    </div>
                </div>
            </div>
            <div v-else-if="group.description" class="text-gray">
                {{ group.description }}
            </div>
            <div v-else>
                <span class="mb-0 cursor-pointer text-primary" @click="onUpdate"
                    >Add a description</span
                >
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, watch } from 'vue'

    import map from '~/constant/accessControl/map'
    import { Groups } from '~/services/service/groups'

    export default defineComponent({
        name: 'UpdateDescription',
        props: {
            group: {
                type: Object,
                default: () => {},
            },
        },
        emits: ['refreshTable'],
        setup(props, context) {
            const isUpdate = ref(false)
            const updateLoading = ref(false)
            const groupDescriptionLocal = ref('')
            const updateErrorMessage = ref('')
            const updateSuccess = ref(false)
            const onUpdate = () => {
                groupDescriptionLocal.value = props.group.description
                isUpdate.value = true
            }
            const onCancel = () => {
                groupDescriptionLocal.value = ''
                isUpdate.value = false
            }
            const handleUpdate = () => {
                const requestPayload = ref()
                requestPayload.value = {
                    attributes: {
                        description: [groupDescriptionLocal.value],
                    },
                }
                const { data, isReady, error, isLoading } = Groups.UpdateGroup(
                    props.group.id,
                    requestPayload
                )
                watch(
                    [data, isReady, error, isLoading],
                    () => {
                        updateLoading.value = isLoading.value
                        if (isReady && !error.value && !isLoading.value) {
                            context.emit('refreshTable')
                            updateSuccess.value = true
                            updateErrorMessage.value = ''
                            isUpdate.value = false
                            setTimeout(() => {
                                updateSuccess.value = false
                            }, 2000)
                        } else if (error && error.value) {
                            updateErrorMessage.value =
                                'Unable to update group description, please try again.'
                        }
                    },
                    { immediate: true }
                )
            }
            return {
                map,

                updateLoading,
                isUpdate,
                groupDescriptionLocal,
                updateErrorMessage,
                updateSuccess,
                onUpdate,
                onCancel,
                handleUpdate,
            }
        },
    })
</script>

<style></style>
