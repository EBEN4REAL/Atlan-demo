<template>
    <a-button
        class="px-1 py-0 border-0 shadow-none"
        style="background: inherit"
        @click="copyAPI(name, 'Name Copied!')"
    >
        <AtlanIcon icon="CopyOutlined" />
    </a-button>
    <a-dropdown
        v-model:visible="dropdownVisible"
        :trigger="['click']"
        placement="bottomLeft"
    >
        <a-button
            class="border-0 rounded shadow-none"
            size="small"
            style="background: inherit"
            @click="dropdownVisible = true"
        >
            <AtlanIcon icon="KebabMenu"></AtlanIcon>
        </a-button>
        <template #overlay>
            <a-menu :class="$style.menu">
                <a-menu-item @click="copyAPI(name, 'Name Copied!')">
                    <AtlanIcon icon="CopyOutlined" class="mr-2" />Copy
                    Name</a-menu-item
                >
                <a-menu-item @click="copyAPI(guid, 'GUID Copied!')">
                    <AtlanIcon icon="CopyOutlined" class="mr-2" />Copy
                    GUID</a-menu-item
                >
                <DeleteProperty
                    v-if="!internal"
                    ref="deletePropertyRef"
                    :name="name"
                    @confirm="handleDelete"
                >
                    <a-menu-item @click="dropdownVisible = true">
                        <span class="text-red-500">
                            <AtlanIcon icon="Delete" class="mr-2" />
                            Delete
                        </span>
                    </a-menu-item>
                </DeleteProperty>
            </a-menu>
        </template>
    </a-dropdown>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import { message, Modal } from 'ant-design-vue'
    import { copyToClipboard } from '~/utils/clipboard'
    import DeleteProperty from '@/governance/custom-metadata/properties/deleteProperty.vue'

    const emit = defineEmits(['delete'])
    const props = defineProps(['guid', 'name', 'internal'])
    const dropdownVisible = ref(false)
    const deletePropertyRef = ref()

    const copyAPI = (text: string, theMessage: String) => {
        copyToClipboard(text)
        message.success({
            content: theMessage,
        } as any)
        dropdownVisible.value = false
    }

    const handleDelete = () => {
        emit('delete', props.guid)
        dropdownVisible.value = false
    }
</script>

<style scoped></style>

<style lang="less" module>
    .menu {
        @apply overflow-hidden !important;
    }
</style>
