<template>
    <CardWrapper title="Options" icon="Enum">
        <template #action>
            <div v-auth="access.CREATE_ENUM" class="">
                <span
                    class="ml-2 cursor-pointer hover:underline text-primary"
                    @click="$refs.enumForm.handleCreateEnum()"
                >
                    <AtlanIcon icon="Add" />
                    Create New</span
                >
            </div>
        </template>
        <EnumForm
            ref="enumForm"
            :disable="editing || internal"
            :edit-access="!internal"
            @change="handleEnumSelect"
        />
    </CardWrapper>
</template>

<script setup lang="ts">
    import { useVModels } from '@vueuse/core'
    import { ref } from 'vue'
    import EnumForm from '@/governance/custom-metadata/propertyDrawer/options/enumForm.vue'
    import CardWrapper from '@/governance/custom-metadata/propertyDrawer/misc/wrapper.vue'
    import { ATTRIBUTE_INPUT_VALIDATION_RULES } from '~/constant/businessMetadataTemplate'
    import access from '~/constant/accessControl/map'

    const props = defineProps({
        form: { type: Object, required: true },
        internal: { type: Boolean, default: false },
        editing: { type: Boolean, required: true },
    })

    const emit = defineEmits([''])

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
