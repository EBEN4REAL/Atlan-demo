<template>
    <a-dropdown v-if="!menuMode" trigger="click">
        <template #overlay>
            <a-menu>
                <a-menu-item
                    v-for="option in options"
                    :key="option.color"
                    @click="selectedColor = option.color"
                >
                    <div>
                        <AtlanIcon
                            icon="Shield"
                            class="self-center"
                            :class="option.text"
                        />
                        {{ option.color }}
                    </div>
                </a-menu-item>
            </a-menu>
        </template>
        <div
            class="flex items-center py-1 pl-2 pr-1 space-x-1 rounded cursor-pointer"
        >
            <AtlanIcon
                icon="Shield"
                class="self-center"
                :class="selectedText"
            />
            <span class="self-center text-xs">{{ selectedColor }}</span>
            <AtlanIcon icon="CaretDown" />
        </div>
    </a-dropdown>
    <template v-else>
        <div
            class="flex flex-col bg-white cursor-pointer"
            style="max-width: 271px"
        >
            <template v-for="option in options" :key="option.color">
                <div
                    class="flex px-4 py-2 hover:bg-gray-light"
                    :class="
                        option.color === selectedColor ? 'bg-primary-light' : ''
                    "
                    @click="selectedColor = option.color"
                >
                    <div class="">
                        <AtlanIcon
                            icon="Shield"
                            class="self-center mr-1"
                            :class="option.text"
                        />
                    </div>
                    <div class="flex flex-col">
                        <span>{{ option.color }}</span>
                        <span class="text-xs text-gray-500">{{
                            option.desc
                        }}</span>
                    </div>
                    <div
                        v-if="selectedColor === option.color"
                        class="flex items-center"
                    >
                        <AtlanIcon icon="Check" class="text-primary" />
                    </div>
                </div>
            </template>
        </div>
    </template>
</template>

<script lang="ts">
    import { defineComponent, computed, PropType } from 'vue'
    import { useVModels } from '@vueuse/core'

    export default defineComponent({
        name: 'ClassificationColorSelector',
        components: {},
        props: {
            selectedColor: {
                type: String as PropType<'Blue' | 'Green' | 'Red' | 'Yellow'>,
                required: true,
                default: 'Blue',
            },
            menuMode: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        emits: ['update:selectedColor'],
        setup(props, { emit }) {
            const options = [
                // {
                //     color: 'Blue',
                //     background: 'bg-indigo-50',
                //     text: 'text-blue-600',
                // },
                {
                    color: 'Green',
                    background: 'bg-green-50',
                    text: 'text-green-600',
                    desc: 'Standard data that is non PII or less restricted PII',
                },
                {
                    color: 'Yellow',
                    background: 'bg-yellow-50',
                    text: 'text-yellow-600',
                    desc: 'Restricted data and may include personal information or PII',
                },
                {
                    color: 'Red',
                    background: 'bg-red-50',
                    text: 'text-red-600',
                    desc: 'Highly-restricted data, including personally identifiable information (PII)',
                },
            ]

            // const selectedColor = ref(options[0].color)
            const { selectedColor } = useVModels(props, emit)

            // const selectedBackground = computed(
            //     () =>
            //         options.find(
            //             (option) => option.color === selectedColor.value
            //         )?.background ?? options[0].background
            // )
            const selectedText = computed(
                () =>
                    options.find(
                        (option) => option.color === selectedColor.value
                    )?.text ?? options[0].text
            )

            return {
                selectedColor,
                options,
                // selectedBackground,
                selectedText,
            }
        },
    })
</script>

<style lang="less" module></style>
