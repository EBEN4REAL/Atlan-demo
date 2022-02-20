<template>
    <CardWrapper title="Options" icon="Enum">
        <template #action>
            <div v-auth="access.CREATE_ENUM" class="">
                <span
                    v-if="
                        $refs.enumForm?.createEnum === false &&
                        !internal &&
                        !editing
                    "
                    class="ml-2 cursor-pointer hover:underline text-primary"
                    @click="$refs.enumForm?.handleCreateEnum()"
                >
                    <AtlanIcon icon="Add" />
                    Create New</span
                >
            </div>
        </template>
        <!-- internal BM will only have internal enum, stil double check if internal enum?, -->
        <EnumForm
            ref="enumForm"
            :disable="editing || internal"
            :edit-access="!internal"
            :default="form.options.enumType"
            @change="handleEnumSelect"
        />
    </CardWrapper>
</template>

<script setup lang="ts">
    import { useVModels } from '@vueuse/core'
    import { ref } from 'vue'
    import EnumForm from '@/governance/custom-metadata/propertyDrawer/options/enumForm.vue'
    import CardWrapper from '@/governance/custom-metadata/propertyDrawer/misc/wrapper.vue'
    import access from '~/constant/accessControl/map'

    const props = defineProps({
        form: { type: Object, required: true },
        internal: { type: Boolean, default: false },
        editing: { type: Boolean, required: true },
    })

    const emit = defineEmits([''])

    const { form } = useVModels(props, emit)

    const handleEnumSelect = (typeName, values) => {
        form.value.options.enumType = typeName
        form.value.typeName = typeName
        form.value.enumValues = values
    }
</script>

<style scoped></style>
