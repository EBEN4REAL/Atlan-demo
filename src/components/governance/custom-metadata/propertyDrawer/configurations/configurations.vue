<template>
    <CardWrapper title="Configurations" icon="SettingsOutlined">
        <a-form-item v-if="isMultiValuedSupport" class="mb-2">
            <div class="flex justify-between">
                <label :for="`${form.name}-isFacet`">
                    <span class="flex items-center gap-x-2">
                        Allow multiple values
                        <a-popover>
                            <template #content>
                                <div class="px-4 py-2 w-60">
                                    Users will be able to add multiple values
                                    while filling
                                    <b>
                                        {{
                                            form.displayName || 'this property.'
                                        }}
                                    </b>
                                </div>
                            </template>
                            <AtlanIcon icon="Info" class="h-4 text-gray-500" />
                        </a-popover>
                        <a-tooltip
                            title="This configuration cannot be modified
once property is created"
                            placement="top"
                            overlayClassName="text-xs"
                        >
                            <div
                                v-if="editing"
                                class="px-2 py-1 text-xs rounded text-new-yellow-700 bg-new-yellow-100"
                            >
                                Editing restricted
                            </div>
                        </a-tooltip>
                    </span>
                </label>
                <a-switch
                    :id="`${form.name}-isFacet`"
                    v-model:checked="form.options.multiValueSelect"
                    :disabled="editing || readOnly"
                    :class="
                        form.options.multiValueSelect
                            ? 'bg-primary'
                            : 'bg-gray-300'
                    "
                    :name="`${form.name}-isFacet`"
                    size="small"
                />
            </div>
        </a-form-item>
        <a-form-item class="mb-2">
            <div class="flex justify-between">
                <label :for="`${form.name}-isBadge`">
                    <span class="flex items-center">
                        Show in filter
                        <a-popover>
                            <template #content>
                                <div class="px-4 py-2 w-60">
                                    <b>
                                        {{
                                            form.displayName || 'This property '
                                        }}
                                    </b>
                                    will be available in asset filtering.
                                </div>
                            </template>
                            <AtlanIcon
                                icon="Info"
                                class="h-4 ml-2 text-gray-500"
                            />
                        </a-popover>
                    </span>
                </label>

                <a-switch
                    :disabled="readOnly"
                    :id="`${form.name}-isBadge`"
                    v-model:checked="form.options.allowFiltering"
                    class=""
                    :name="`${form.name}-isBadge`"
                    size="small"
                    :class="
                        form.options.allowFiltering
                            ? 'bg-primary'
                            : 'bg-gray-300'
                    "
                />
            </div>
        </a-form-item>
        <a-form-item class="mb-2">
            <div class="flex justify-between">
                <label :for="`${form.name}-isPresent`">
                    <span class="flex items-center">
                        Show in overview
                        <a-popover>
                            <template #content>
                                <div class="px-4 py-2 w-60">
                                    Users will be able to see
                                    <b>
                                        {{
                                            form.displayName || 'this property '
                                        }}
                                    </b>
                                    in the overview tab in the asset sidebar.
                                </div>
                            </template>
                            <AtlanIcon
                                icon="Info"
                                class="h-4 ml-2 text-gray-500"
                            />
                        </a-popover>
                    </span>
                </label>

                <a-switch
                    :disabled="readOnly"
                    :id="`${form.name}-isPresent`"
                    v-model:checked="form.options.showInOverview"
                    class=""
                    :name="`${form.name}-isPresent`"
                    size="small"
                    :class="
                        form.options.showInOverview
                            ? 'bg-primary'
                            : 'bg-gray-300'
                    "
                />
            </div>
        </a-form-item>
    </CardWrapper>
</template>

<script setup lang="ts">
    import { useVModels } from '@vueuse/core'
    import { computed, ref } from 'vue'
    import CardWrapper from '@/governance/custom-metadata/propertyDrawer/misc/wrapper.vue'

    const props = defineProps({
        form: { type: Object, required: true },
        internal: { type: Boolean, default: false },
        editing: { type: Boolean, required: true },
        readOnly: { type: Boolean, default: false },
    })

    const emit = defineEmits([''])

    const { form } = useVModels(props, emit)

    const isMultiValuedSupport = computed(() => {
        const blackList = ['boolean', 'date', 'SQL']
        return !blackList.includes(form.value.options.primitiveType)
    })
</script>

<style scoped></style>
