<template>
    <div class="h-full bg-white rounded">
        <div v-if="!isNew" class="flex flex-col px-4 py-3 border-b">
            <div class="flex items-center gap-x-10">
                <div class="flex-grow overflow-hidden">
                    <p class="text-xl">
                        <SimpleEllipsis :text="selectedEnum.name" />
                    </p>
                    <!-- <p class="text-gray-500">{{ selectedEnum.description }}</p> -->
                </div>
                <div class="justify-end">
                    <a-button
                        v-if="!isEditing && !viewOnly"
                        v-auth="map.UPDATE_ENUM"
                        shape="circle"
                        class="flex items-center justify-center rounded-md ant-btn ant-btn-primary"
                        @click="() => (isEditing = true)"
                    >
                        <AtlanIcon icon="Edit" class="h-4"></AtlanIcon>
                    </a-button>
                    <div v-if="isEditing" class="w-40">
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
                    <MultiInput
                        :key="dirtyKey"
                        placeholder='Enter values separated by a  ";" or "↵"'
                        :disabled="!isEditing"
                        :value="enumValues"
                        delimiter=";"
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
    import MultiInput from '@/common/input/customizedTagInput.vue'
    import SimpleEllipsis from '@/common/ellipsis/simpleEllipsis.vue'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    export default defineComponent({
        components: {
            SimpleEllipsis,
            MultiInput,
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
            const dirtyKey = ref(new Date().getTime())
            const viewOnly = ref(
                props.selectedEnum.options?.isLocked === 'true'
            )
            // const accessStore = useAccessStore()
            // const editPermission = computed(() =>
            //     accessStore.checkPermission('UPDATE_BUSINESS_METADATA')
            // )
            const enumValues = computed((): string[] =>
                localEnum.elementDefs.map((e) => e.value).sort()
            )

            function timeAgo(time: string) {
                return useTimeAgo(time).value
            }

            function discardChanges() {
                localEnum.elementDefs = props.selectedEnum.elementDefs
                isEditing.value = false
            }

            function handleChange(values: String[]) {
                localEnum.elementDefs = JSON.parse(JSON.stringify(values))
                    .sort() // save in sorted order
                    .map((value, ordinal) => ({
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
                useAddEvent('governance', 'options', 'updated', {
                    title: updatedEnum.name,
                })
                dirtyKey.value = new Date().getTime()
            }

            // FIXME: May be simplified
            watch([updateError, isReady], () => {
                if (isReady && state.value.enumDefs.length) {
                    message.success('Option updated.')
                    context.emit('update:selectedEnum', state.value.enumDefs[0])
                    isEditing.value = false
                }
                if (updateError.value) {
                    message.error('Failed to save your Option.')
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
                dirtyKey,
                viewOnly,
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
