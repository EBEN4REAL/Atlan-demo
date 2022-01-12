<template>
    <a-form-item name="slack">
        <template #label>
            Slack
            <a-popover v-if="popOverContent">
                <template #content>
                    <div class="p-3 text-gray-500 w-52">
                        <PopOverContent :content="popOverContent" />
                    </div>
                </template>
                <AtlanIcon icon="Info" class="w-3 h-3 ml-1" />
            </a-popover>
        </template>
        <a-input
            v-model:value="modelValue"
            class="mt-2"
            :placeholder="placeholder"
            @blur="handleSlackInputBlur"
        >
            <template #prefix>
                <span class="pr-2 border-r border-gray-300 border-solid">
                    <AtlanIcon icon="Slack" />
                </span>
            </template>
        </a-input>
    </a-form-item>
    <div
        class="mb-4 -mt-6 transition-opacity"
        :class="
            showSlackTestLink && modelValue
                ? 'opacity-100 cursor-pointer'
                : 'opacity-0 cursor-default'
        "
    >
        <span
            class="text-alert hover:underline"
            @click="handleTestSlackLink(modelValue)"
            >{{ warningText }}</span
        >
    </div>
</template>
<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import { useVModels } from '@vueuse/core'
    import { getDeepLinkFromUserDmLink } from '~/composables/integrations/useSlack'
    import PopOverContent from '~/components/common/formGenerator/popOverContent.vue'

    export default defineComponent({
        name: 'SlackInput',
        components: {
            PopOverContent,
        },
        props: {
            modelValue: {
                type: String,
                default: '',
            },
            placeholder: {
                type: String,
                default: '',
            },
            popOverContent: {
                type: String,
                default: '',
            },
            warningText: {
                type: String,
                default: 'See if people can reach this channel',
            },
        },
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const showSlackTestLink = ref(false)
            const handleTestSlackLink = (slackId) => {
                window.open(getDeepLinkFromUserDmLink(slackId))
            }
            const handleSlackInputBlur = () => {
                if (modelValue.value) showSlackTestLink.value = true
                else showSlackTestLink.value = false
            }
            return {
                modelValue,
                showSlackTestLink,
                handleSlackInputBlur,
                handleTestSlackLink,
            }
        },
    })
</script>
