<template>
    <CardWrapper title="Options" icon="Enum">
        <a-form
            ref="formRef"
            class="p-4"
            layout="vertical"
            :rules="rules"
            :model="form"
            :validate-trigger="['click', 'submit']"
        >
            <EnumForm
                :disable="editing || internal"
                :edit-access="!internal"
                @change="handleEnumSelect"
                @update="$emit('update')"
            />
        </a-form>
    </CardWrapper>
</template>

<script setup lang="ts">
    import { useVModels } from '@vueuse/core'
    import { ref } from 'vue'
    import EnumForm from '@/governance/custom-metadata/propertyDrawer/options/enumForm.vue'
    import CardWrapper from '@/governance/custom-metadata/propertyDrawer/misc/wrapper.vue'
    import { ATTRIBUTE_INPUT_VALIDATION_RULES } from '~/constant/businessMetadataTemplate'

    const props = defineProps({
        form: { type: Object, required: true },
        internal: { type: Boolean, default: false },
        editing: { type: Boolean, required: true },
    })

    const emit = defineEmits(['update'])

    const rules = ref(
        JSON.parse(JSON.stringify(ATTRIBUTE_INPUT_VALIDATION_RULES))
    )

    const { form } = useVModels(props, emit)

    const handleEnumSelect = (typeName, values) => {
        form.value.options.enumType = typeName
        form.value.typeName = typeName
        form.value.enumValues = values
    }
</script>

<style scoped></style>
