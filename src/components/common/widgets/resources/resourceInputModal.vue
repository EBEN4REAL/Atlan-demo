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
                >{{ isEdit ? 'Edit' : 'New' }}
                {{ isSlackTab ? 'Slack Resource' : 'Resource' }}</span
            >
        </template>
        <template #footer>
            <div class="flex items-center justify-end w-full space-x-3">
                <AtlanButton2
                    color="secondary"
                    class="px-1"
                    label="Cancel"
                    @click="handleCancel"
                />

                <AtlanButton2
                    color="primary"
                    :disabled="buttonDisabled"
                    :loading="
                        addStatus === 'loading' || updateStatus === 'loading'
                    "
                    :label="isEdit ? 'Update' : 'Add'"
                    @click="handleSubmit"
                />
            </div>
        </template>
        <a-form
            ref="formRef"
            layout="vertical"
            :class="$style.form"
            :rules="formRules"
            :model="localResource"
            :validate-trigger="['click', 'submit']"
            @validate="formValidation"
        >
            <div class="px-4 pt-0 pb-4">
                <a-form-item
                    label="Link"
                    :name="['link']"
                    class="mb-0 font-bold"
                >
                    <a-input
                        id="link"
                        ref="titleBar"
                        v-model:value="localResource.link"
                        type="url"
                        placeholder="Paste resource link"
                        class="text-lg font-bold text-gray-700"
                        allow-clear
                        @change="handleUrlChange"
                    />
                </a-form-item>
                <div v-if="localResource.link" class="mt-3">
                    <a-form-item
                        label="Title"
                        :name="['title']"
                        class="mb-0 font-bold"
                    >
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
                    </a-form-item>
                </div>
            </div>
        </a-form>
    </a-modal>
</template>

<script setup lang="ts">
    import {
        ref,
        Ref,
        nextTick,
        computed,
        toRefs,
        inject,
        PropType,
        watch,
    } from 'vue'
    import { message } from 'ant-design-vue'
    import { useDebounceFn, useTimestamp } from '@vueuse/core'
    import type { Rule } from 'ant-design-vue/es/form'
    import { generateUUID } from '~/utils/helper/generator'
    import { getDomain } from '~/utils/url'
    import whoami from '~/composables/user/whoami'
    import { Link } from '~/types/resources.interface'
    import integrationStore from '~/store/integrations/index'

    const props = defineProps({
        isEdit: {
            type: Boolean,
            required: false,
            default: false,
        },
        link: {
            type: Object as PropType<Link>,
            required: false,
            default: () => null,
        },
    })

    const { isEdit, link } = toRefs(props)

    const visible = ref<boolean>(false)
    const titleBar: Ref<null | HTMLInputElement> = ref(null)
    const isValidUrl = ref(isEdit.value)
    const { username } = whoami()
    const localResource = ref({
        link: '',
        title: '',
    })

    const reset = () => {
        localResource.value = {
            link: '',
            title: '',
        }
    }

    const add = inject('add') as Function
    const addStatus: Ref = inject('addStatus') as Ref
    const update: Function = inject('update') as Function
    const updateStatus = inject('updateStatus') as Ref
    const tab = inject('tab') as Ref
    const isTab = computed(() => !!tab?.value?.component)

    const isSlackTab = computed(
        () => tab.value.component === 'SlackResourcesTab'
    )
    const isSlackLink = computed(
        () => getDomain(localResource.value.link) === 'slack.com'
    )

    const validateLink = async (_rule: Rule, value: string) => {
        if (value === '') {
            // eslint-disable-next-line prefer-promise-reject-errors
            return Promise.reject(
                `Please provide a ${
                    isSlackTab.value ? 'slack resource' : 'resource'
                } link`
            )
        }
        if (!isValidUrl.value) {
            // eslint-disable-next-line prefer-promise-reject-errors
            return Promise.reject(
                `Please provide a valid ${
                    isSlackTab.value ? 'slack resource' : 'resource'
                } link`
            )
        }
        if (isSlackTab.value && getDomain(value) !== 'slack.com') {
            // eslint-disable-next-line prefer-promise-reject-errors
            return Promise.reject('Resource link must be of slack domain')
        }

        return Promise.resolve()
    }

    const isLinkValid = ref(isEdit.value) // ? results of custom validation of link
    const formValidation = (name, status, errorMsgs) => {
        if (name[0] === 'link') isLinkValid.value = status
    }

    const formRules = {
        link: [
            {
                required: true,
                validator: validateLink,
                trigger: ['submit', 'change'],
            },
        ],
        title: [
            {
                required: true,
                message: 'Please provide a title for this resource',
                trigger: ['submit', 'change'],
            },
        ],
    }

    watch(addStatus, (v) => {
        if (v === 'success') {
            const store = integrationStore()
            const { tenantSlackStatus } = toRefs(store)
            // ! FIXME this watcher is running multiple times, ???!
            if (localResource.value.title)
                message.success({
                    content: `Successfully added new${
                        isSlackLink.value ? ' slack ' : ''
                    }resource "${localResource.value.title}"`,
                    duration: 1.5,
                    key: 'add',
                })
            if (
                isSlackLink.value &&
                isTab.value &&
                !isSlackTab.value &&
                tenantSlackStatus.value.configured
            ) {
                message.info({
                    content: `Looks like you’ve added a slack link, you can find it here`,
                    duration: 4,
                    key: 'slackAdd',
                })
            }
            reset()
            visible.value = false
        } else if (v === 'error') {
            // ! FIXME this watcher is running multiple times, ???!
            if (localResource.value.title)
                message.error({
                    content: `Failed to add new resource "${localResource.value.title}"`,
                    duration: 1.5,
                    key: 'errorAdd',
                })
        }
    })

    watch(updateStatus, (v, o) => {
        if (updateStatus.value === 'success') {
            // ! FIXME this watcher is running multiple times, ???!
            if (localResource.value.title)
                message.success({
                    content: `Successfully updated resource "${localResource.value.title}"`,
                    duration: 1.5,
                    key: 'update',
                })
            reset()
            visible.value = false
        } else if (updateStatus.value === 'error') {
            // ! FIXME this watcher is running multiple times, ???!
            if (localResource.value.title)
                message.error({
                    content: `Failed to update resource "${localResource.value.title}"`,
                    duration: 1.5,
                    key: 'errorUpdate',
                })
        }
    })

    const faviconLink = ref('')

    const fetchFaviconLink = useDebounceFn(() => {
        faviconLink.value = localResource.value.link
            ? `https://www.google.com/s2/favicons?domain=${getDomain(
                  localResource.value.link
              )}&sz=64`
            : ''
    }, 500)

    const setDefalt = () => {
        faviconLink.value = ''
        if (isEdit.value) {
            const { attributes } = link.value
            localResource.value.link = attributes.link
            localResource.value.title = attributes.name
            fetchFaviconLink()
        }
    }

    const showModal = async () => {
        visible.value = true
        await nextTick()
        titleBar.value?.focus()
        setDefalt()
    }

    const handleCancel = () => {
        reset()
        visible.value = false
    }

    const buttonDisabled = computed(
        () =>
            !localResource.value.link ||
            !localResource.value.title ||
            !isValidUrl.value ||
            !isLinkValid.value
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
        attributes: {
            name: r.title,
            link: r.link,
            __timestamp: timestamp.value,
            __createdBy: username.value,
        },
        uniqueAttributes: { qualifiedName: generateUUID() },
    })

    // The `generateResourceUpdateEntity` function takes a resource and returns a new resource with the
    // updatedAt and updatedBy fields set to the current timestamp and username.
    const generateResourceUpdateEntity = (r): Link => ({
        ...link.value,
        attributes: {
            ...link.value.attributes,
            name: r.title,
            link: r.link,
            __modificationTimestamp: timestamp.value,
            __modifiedBy: username.value,
        },
    })

    const handleSubmit = () => {
        if (!localResource.value.link.includes('http'))
            localResource.value.link = `https://${localResource.value.link}`

        if (isEdit.value)
            update(generateResourceUpdateEntity(localResource.value))
        else add(generateResourceEntity(localResource.value))
    }
</script>

<style lang="less" module>
    .input {
        :global(.ant-input:focus, .ant-input:hover, .ant-input::selection, .focus-visible) {
            @apply shadow-none outline-none border-0 border-transparent border-r-0 !important;
        }
        :global(.ant-input):focus,
        :global(.ant-input):hover {
            @apply shadow-none outline-none border-0 border-transparent border-r-0 !important;
        }
        :global(.ant-input) {
            @apply shadow-none outline-none px-0 border-0 !important;
        }
    }

    .form {
        :global(.ant-form-item-explain) {
            @apply font-normal text-xs  pt-1 !important;
        }
        :global(.ant-form-item-label
                > label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::after) {
            @apply hidden !important;
        }
    }
</style>
