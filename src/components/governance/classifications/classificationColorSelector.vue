<template>
    <a-dropdown v-if="!menuMode" trigger="click">
        <!-- Improve this, DRY  -->
        <template #overlay>
            <div class="bg-white rounded" style="max-width: 271px">
                <template v-for="option in options" :key="option.color">
                    <div
                        class="flex px-4 py-2 rounded cursor-pointer hover:bg-gray-light"
                        :class="
                            option.color === selectedColor
                                ? 'bg-primary-light'
                                : ''
                        "
                        @click="selectedColor = option.color"
                    >
                        <div class="text-center">
                            <ClassificationIcon :color='option.color' :class-names='"self-center mx-1"' />
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
        <div
            class="flex items-center py-1 pl-2 pr-1 space-x-1 rounded cursor-pointer"
        >
            <AtlanIcon
                icon="ClassificationShield"
                class="self-center"
                :class="selectedText"
            />
            <span class="self-center text-xs">{{ selectedColor }}</span>
            <AtlanIcon icon="CaretDown" />
        </div>
    </a-dropdown>
    <template v-else>
        <div
            class="flex flex-col bg-white rounded cursor-pointer"
            style="max-width: 271px"
        >
            <template v-for="option in options" :key="option.color">
                <div
                    class="flex px-4 py-2 rounded hover:bg-gray-light"
                    :class="
                        option.color === selectedColor ? 'bg-primary-light' : ''
                    "
                    @click="selectedColor = option.color"
                >
                    <div class="text-center">
                        <ClassificationIcon :color='option.color' :class-names='"self-center mx-1"' />
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
    import ClassificationIcon from './classificationIcon.vue'

    export default defineComponent({
        name: 'ClassificationColorSelector',
        components: { ClassificationIcon },
        props: {
            selectedColor: {
                type: String as PropType<'Green' | 'Red' | 'Yellow'>,
                required: true,
                default: 'Green',
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
