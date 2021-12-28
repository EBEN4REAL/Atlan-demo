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
    <div v-else>
        <div class="flex flex-col gap-1">
            <span
                v-for="option in options"
                :key="option.color"
                class="flex items-center px-2 rounded h-7 hover:bg-gray-light"
                @click="selectedColor = option.color"
            >
                <AtlanIcon
                    icon="Shield"
                    class="self-center mr-1"
                    :class="option.text"
                />
                <span>{{ option.color }}</span>
            </span>
        </div>
    </div>
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
                {
                    color: 'Blue',
                    background: 'bg-indigo-50',
                    text: 'text-blue-600',
                },
                {
                    color: 'Green',
                    background: 'bg-green-50',
                    text: 'text-green-600',
                },
                {
                    color: 'Yellow',
                    background: 'bg-yellow-50',
                    text: 'text-yellow-600',
                },
                {
                    color: 'Red',
                    background: 'bg-red-50',
                    text: 'text-red-600',
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
