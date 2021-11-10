<template>
    <div class="py-5 drawer-container">
        <div class="px-4 pb-5 font-bold border-b">
            {{ apiKeyDirty.id ? apiKeyDirty.displayName : 'Add new key' }}
        </div>
        <div class="px-4 py-3">
            <div class="mb-4">
                <div class="mb-2 mr-2 text-gray-500">
                    Name <sup class="text-error">*</sup>
                </div>
                <a-input
                    v-model:value="apiKeyDirty.displayName"
                    :placeholder="'Name the api key'"
                    :class="
                        nameEmptyOnSubmit && !apiKeyDirty.displayName.length
                            ? 'border border-error'
                            : ''
                    "
                ></a-input>
            </div>
            <div class="mb-4">
                <div class="mb-2 mr-2 text-gray-500">Description</div>
                <a-input
                    v-model:value="apiKeyDirty.description"
                    :placeholder="'Add description'"
                ></a-input>
            </div>
            <div class="mb-4">
                <div class="mb-2 mr-2 text-gray-500">Personas</div>
                <a-popover
                    v-model="addPersonaPopoverVisible"
                    :trigger="'click'"
                    placement="bottom"
                    overlay-class-name="persona-popover"
                >
                    <PillGroup
                        v-model:data="apiKeyDirty.personas"
                        label-key="name"
                        :read-only="true"
                    >
                        <template #suffix>
                            <Pill
                                class="group"
                                @click="toggleAddPersonaPopover"
                            >
                                <template #prefix>
                                    <div
                                        v-if="!apiKeyDirty.personas.length"
                                        class="flex items-center  text-primary group-hover:text-white"
                                    >
                                        <AtlanIcon
                                            icon="Add"
                                            class="h-4 mr-0.5"
                                        />
                                        Add personas
                                    </div>
                                    <div
                                        v-else
                                        class="text-gray group-hover:text-white"
                                    >
                                        <AtlanIcon
                                            icon="Add"
                                            class="h-4 mr-0.5"
                                        />
                                    </div>
                                </template>
                            </Pill>
                        </template>
                    </PillGroup>
                    <template #content>
                        <PersonaList
                            class="persona-list"
                            :selected-personas="apiKeyDirty.personas || []"
                        />
                    </template>
                </a-popover>
            </div>
            <a-button @click="handleSave">Save</a-button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, ref, watch } from 'vue'
import PillGroup from '@/UI/pill/pillGroup.vue'
import Pill from '@/UI/pill/pill.vue'
import PersonaList from '@/common/popover/persona/personaList.vue'

export default defineComponent({
    name: 'APIKeyDrawer',
    components: { PillGroup, PersonaList, Pill },
    props: {
        apiKey: {
            type: Object,
            default: () => {},
        },
    },
    emits: ['updateAPIKey', 'createAPIKey'],
    setup(props, { emit }) {
        const apiKeyDirty = ref({})
        const nameEmptyOnSubmit = ref(false)
        const addPersonaPopoverVisible = ref(false)
        const handleSave = () => {
            if (!apiKeyDirty.value.displayName) {
                nameEmptyOnSubmit.value = true
                return
            }
            if (props?.apiKey?.id) emit('updateAPIKey', apiKeyDirty)
            else
                emit('createAPIKey', {
                    ...apiKeyDirty.value,
                    personas: (apiKeyDirty?.value?.personas ?? []).map(
                        (p) => p.id
                    ),
                })
        }
        watch(
            () => props?.apiKey,
            () => {
                const personas = (props?.apiKey?.personas || []).map(
                    (persona) => ({ id: persona, name: 'ex' })
                )
                apiKeyDirty.value = { ...props.apiKey, personas }
            },
            { immediate: true, deep: true }
        )
        const toggleAddPersonaPopover = () => {
            addPersonaPopoverVisible.value = !addPersonaPopoverVisible.value
        }
        return {
            apiKeyDirty,
            handleSave,
            addPersonaPopoverVisible,
            toggleAddPersonaPopover,
            nameEmptyOnSubmit,
        }
    },
})
</script>
<style lang="less">
.persona-popover {
    .ant-popover-inner-content {
        padding-left: 0 !important;
        padding-right: 0 !important;
    }
}
</style>
<style lang="less" scoped>
.persona-list {
    width: 256px;
    height: 300px;
}
</style>