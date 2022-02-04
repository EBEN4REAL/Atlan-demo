<template>
    <div @click="showModal">
        <slot name="trigger" @click="showModal" />
    </div>
    <a-modal
        :closable="false"
        :visible="visible"
        :class="$style.input"
        :destroy-on-close="true"
    >
        <template #title>
            <span class="text-sm font-bold text-gray"
                >{{ isEdit ? 'Edit' : 'New' }} Resource</span
            >
        </template>
        <template #footer>
            <div class="flex items-center justify-end w-full space-x-3">
                <AtlanButton
                    color="minimal"
                    :size="'sm'"
                    class="px-1"
                    @click="handleCancel"
                >
                    Cancel
                </AtlanButton>
                <AtlanButton
                    color="primary"
                    :size="'sm'"
                    :disabled="buttonDisabled"
                    @click="handleAdd"
                >
                    {{ isEdit ? 'Update' : 'Add' }}
                </AtlanButton>
            </div>
        </template>
        <div class="px-4 pt-0 pb-4">
            <span class="font-bold">Link</span>
            <a-input
                id="linkURL"
                ref="titleBar"
                v-model:value="localResource.link"
                type="url"
                placeholder="Paste resource link"
                class="text-lg font-bold text-gray-700"
                allow-clear
                @change="handleUrlChange"
            />
            <div v-if="localResource.link" class="mt-3">
                <span class="font-bold">Title</span>
                <div class="flex items-center gap-x-2">
                    <a-input
                        v-model:value="localResource.title"
                        placeholder="Resource title"
                        class="text-lg font-bold text-gray-700"
                        allow-clear
                    >
                        <template v-if="faviconLink" #prefix>
                            <div class="relative flex w-5 h-5 mr-2">
                                <img :src="faviconLink" alt="" />
                            </div>
                        </template>
                    </a-input>
                </div>
            </div>
        </div>
    </a-modal>
</template>

<script setup lang="ts">
    import { ref, Ref, nextTick, computed, toRefs } from 'vue'
    import { useDebounceFn, useTimestamp } from '@vueuse/core'
    import { generateUUID } from '~/utils/helper/generator'
    import { getDomain } from '~/utils/url'
    import whoami from '~/composables/user/whoami'
    import { Link } from '~/types/resources.interface'

    const props = defineProps({
        isEdit: {
            type: Boolean,
            required: false,
            default: false,
        },
    })

    const emit = defineEmits(['add', 'update'])

    const { isEdit } = toRefs(props)

    const visible = ref<boolean>(false)
    const titleBar: Ref<null | HTMLInputElement> = ref(null)
    const isValidUrl = ref(isEdit.value)
    const { username } = whoami()

    const localResource = ref({
        link: 'https://',
        title: '',
    })

    const showModal = async () => {
        visible.value = true
        await nextTick()
        titleBar.value?.focus()
    }

    const faviconLink = ref('')

    const fetchFaviconLink = useDebounceFn(() => {
        faviconLink.value = localResource.value.link
            ? `https://www.google.com/s2/favicons?domain=${getDomain(
                  localResource.value.link
              )}&sz=64`
            : ''
    }, 500)

    const handleCancel = () => {
        visible.value = false
        localResource.value = {
            link: 'https://',
            title: '',
        }
    }

    const buttonDisabled = computed(
        () => !localResource.value.link || !isValidUrl.value
    )
    const handleUrlChange = (e) => {
        fetchFaviconLink()
        if (e.target.checkValidity()) {
            isValidUrl.value = true
        } else {
            isValidUrl.value = false
        }
    }

    const timestamp = useTimestamp({ offset: 0 })

    // Generate a resource object for each link in the list of links.
    const generateResourceEntity = (r): Link => ({
        typeName: 'Link',
        qualifiedName: generateUUID(),
        name: r.title,
        link: r.link,
        createdAt: timestamp.value,
        createdBy: username.value,
    })

    // The `generateResourceUpdateEntity` function takes a resource and returns a new resource with the
    // updatedAt and updatedBy fields set to the current timestamp and username.
    const generateResourceUpdateEntity = (r): Link => ({
        ...r,
        updatedAt: timestamp.value,
        updatedBy: username.value,
    })

    const handleAdd = () => {
        if (!localResource.value.link.includes('http'))
            localResource.value.link = `https://${localResource.value.link}`

        if (isEdit.value)
            emit('update', generateResourceUpdateEntity(localResource.value))
        else emit('add', generateResourceEntity(localResource.value))
        visible.value = false
    }
</script>

<style lang="less" module>
    // .input {
    //     :global(.ant-input:focus, .ant-input:hover, .ant-input::selection, .focus-visible) {
    //         @apply shadow-none outline-none border-0 border-transparent border-r-0 !important;
    //     }
    //     :global(.ant-input):focus,
    //     :global(.ant-input):hover {
    //         @apply shadow-none outline-none border-0 border-transparent border-r-0 !important;
    //     }
    //     :global(.ant-input) {
    //         @apply shadow-none outline-none px-0 border-0 !important;
    //     }
    // }
</style>
