<template>
    <div class="h-full bg-white rounded">
        <div v-if="!isNew" class="flex flex-col px-4 py-3 border-b">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-xl">
                        {{ selectedEnum.name }}
                    </p>
                    <p class="text-gray-500">{{ selectedEnum.description }}</p>
                </div>
                <div>
                    <a-button
                        v-if="!isEditing"
                        v-auth="map.UPDATE_ENUM"
                        shape="circle"
                        class="flex items-center justify-center rounded-md ant-btn ant-btn-primary"
                        @click="() => (isEditing = true)"
                    >
                        <AtlanIcon icon="Edit" class="h-4"></AtlanIcon>
                    </a-button>
                    <a-button
                        v-if="isEditing"
                        class="mr-4 rounded-md ant-btn"
                        @click="discardChanges"
                    >
                        Cancel
                    </a-button>
                    <a-button
                        v-if="isEditing"
                        class="rounded-md ant-btn ant-btn-primary"
                        @click="saveChanges"
                    >
                        Save
                    </a-button>
                </div>
            </div>
            <div
                class="w-full h-1"
                :class="!isReady ? 'animate-pulse bg-primary400' : ''"
            />
        </div>
        <div class="flex items-start justify-between px-4 py-3 border-b">
            <CreateUpdateInfo
                :created-at="localEnum.createTime"
                :updated-at="localEnum.updateTime"
                :created-by="localEnum.createdBy"
                :updated-by="localEnum.updatedBy"
            />
        </div>
        <div class="px-4 pt-3 pb-8">
            <a-form layout="vertical">
                <!-- <a-form-item label="Name" :wrapper-col="{ span: 12 }">
                    <a-input
                        v-model:value="localEnum.name"
                        :disabled="!isNew"
                        placeholder="Enumeration Name"
                    />
                </a-form-item> -->
                <a-form-item label="Values">
                    <a-select
                        mode="tags"
                        placeholder="Enter enum values"
                        :disabled="!isEditing"
                        :value="enumValues"
                        :open="false"
                        @change="handleChange"
                    />
                    <!-- TODO: Can this be done using computed and v-modal -->
                </a-form-item>
            </a-form>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, reactive, ref, watch } from 'vue'
    import { useTimeAgo } from '@vueuse/core'
    import { message } from 'ant-design-vue'

    import { useUserPreview } from '~/composables/user/showUserPreview'
    import { useUpdateEnums } from './composables/useModifyEnums'
    // import { useAccessStore } from '~/services/access/accessStore'
    import CreateUpdateInfo from '@/common/info/createUpdateInfo.vue'
    import map from '~/constant/accessControl/map'
    import { useTypedefStore } from '~/store/typedef'

    export default defineComponent({
        components: {
            CreateUpdateInfo,
        },
        props: {
            // TODO: Let's define a dummy Enum object that can be used as placeholder
            // We can do it for all other types of object
            selectedEnum: { type: Object, required: true },
            isNew: { type: Boolean, default: false },
        },
        emits: ['update:selectedEnum'],
        setup(props, context) {
            // Component state essentials
            const localEnum = reactive({ ...props.selectedEnum })
            const isEditing = ref(props.isNew || false)
            // const accessStore = useAccessStore()
            // const editPermission = computed(() =>
            //     accessStore.checkPermission('UPDATE_BUSINESS_METADATA')
            // )
            const enumValues = computed((): string[] =>
                localEnum.elementDefs.map((e) => e.value)
            )

            function timeAgo(time: string) {
                return useTimeAgo(time).value
            }

            function discardChanges() {
                localEnum.elementDefs = props.selectedEnum.elementDefs
                isEditing.value = false
            }

            function handleChange(values: String[]) {
                localEnum.elementDefs = values.map((value, ordinal) => ({
                    value,
                    ordinal,
                }))
            }

            // Enum Updation flow
            const { updateEnums, updatedEnumDef, reset } = useUpdateEnums()
            const { error: updateError, isReady, state, execute } = updateEnums

            async function saveChanges() {
                const store = useTypedefStore()
                updatedEnumDef.value = localEnum
                await execute()
                const updatedEnum =
                    state?.value?.enumDefs?.length && state.value.enumDefs[0]
                store.updateEnum(updatedEnum)
            }

            // FIXME: May be simplified
            watch([updateError, isReady], () => {
                if (isReady && state.value.enumDefs.length) {
                    message.success('Enumeration updated.')
                    context.emit('update:selectedEnum', state.value.enumDefs[0])
                    isEditing.value = false
                }
                if (updateError.value) {
                    message.error('Failed to save your enum.')
                    console.error(updateError.value)
                    reset()
                }
            })
            // user preview drawer
            const { showUserPreview, setUserUniqueAttribute } = useUserPreview()
            const handleClickUser = (username: string) => {
                setUserUniqueAttribute(username, 'username')
                showUserPreview({ allowed: ['about'] })
            }
            return {
                isEditing,
                isReady,
                localEnum,
                enumValues,
                timeAgo,
                discardChanges,
                handleChange,
                saveChanges,
                handleClickUser,
                map,
                // editPermission,
            }
        },
    })
</script>
