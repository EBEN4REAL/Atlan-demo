<template>
    <CardWrapper title="Configurations" icon="SettingsOutlined">
        <a-form-item v-if="isMultiValuedSupport" class="mb-2">
            <div class="flex justify-between">
                <label :for="`${form.name}-isFacet`">
                    <span class="flex items-center">
                        Allow multiple values
                        <a-popover>
                            <template #content>
                                <div class="px-4 py-2 w-60">
                                    Users will be able to add multiple values
                                    while filling
                                    <b>
                                        {{
                                            form.displayName ?? 'this property.'
                                        }}
                                    </b>
                                </div>
                            </template>
                            <AtlanIcon icon="Info" class="h-3 ml-1" />
                        </a-popover>
                    </span>
                </label>
                <a-switch
                    :id="`${form.name}-isFacet`"
                    v-model:checked="form.options.multiValueSelect"
                    :disabled="editing"
                    class=""
                    :name="`${form.name}-isFacet`"
                    size="small"
                />
            </div>
        </a-form-item>
        <a-form-item class="mb-2">
            <div class="flex justify-between">
                <label :for="`${form.name}-isBadge`">
                    <span class="flex items-center">
                        Allow filtering
                        <a-popover>
                            <template #content>
                                <div class="px-4 py-2 w-60">
                                    <b>
                                        {{
                                            form.displayName ?? 'This property '
                                        }}
                                    </b>
                                    will be available in asset filtering
                                </div>
                            </template>
                            <AtlanIcon icon="Info" class="h-3 ml-1" />
                        </a-popover>
                    </span>
                </label>

                <a-switch
                    :id="`${form.name}-isBadge`"
                    v-model:checked="form.options.allowFiltering"
                    class=""
                    :name="`${form.name}-isBadge`"
                    size="small"
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
    })

    const emit = defineEmits([''])

    const { form } = useVModels(props, emit)

    const isMultiValuedSupport = computed(() => {
        const blackList = ['boolean', 'date', 'SQL']
        return !blackList.includes(form.value.options.primitiveType)
    })
</script>

<style scoped></style>
