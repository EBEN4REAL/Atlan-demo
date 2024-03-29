<template>
    <a-form-item name="slack">
        <template #label>
            {{ label }}
            <a-popover v-if="popOverContent || $slots?.popupContent">
                <template #content>
                    <slot v-if="$slots?.popupContent" name="popupContent" />
                    <div v-else class="p-3 text-gray-500 w-52">
                        <PopOverContent :content="popOverContent" />
                    </div>
                </template>
                <AtlanIcon icon="Info" class="w-3 h-3 ml-1" />
            </a-popover>
        </template>
        <a-input
            v-model:value="modelValue"
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
        class="pt-1 -mt-6 transition-opacity"
        :class="
            showSlackTestLink && modelValue
                ? 'opacity-100 cursor-pointer mb-4'
                : 'opacity-0 cursor-default pointer-events-none '
        "
    >
        <div
            class="flex items-center hover:underline text-primary"
            @click="handleTestSlackLink(modelValue)"
        >
            <span class="mr-1.5">👋</span>
            Test your slack link
            <AtlanIcon icon="ArrowRight"></AtlanIcon>
        </div>
    </div>
</template>
<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import { useVModels } from '@vueuse/core'
    import { getDeepLinkFromUserDmLink } from '~/composables/integrations/slack/useSlack'
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
            label: {
                type: String,
                default: 'Slack',
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
