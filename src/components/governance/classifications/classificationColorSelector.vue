<template>
    <a-dropdown trigger="click">
        <template #overlay>
            <a-menu>
                <a-menu-item v-for="option in options" :key="option.color" @click="selectedColor = option.color">
                    <div>
                        <AtlanIcon icon="ShieldFilled" class="self-center" :class="option.text" />
                        {{ option.color }}
                    </div>
                </a-menu-item>
            </a-menu>
        </template>
        <div class="flex space-x-1 p-1 rounded" :class="selectedBackground" >
            <AtlanIcon icon="ShieldFilled" class="self-center" :class="selectedText" />
            <span class="text-xs self-center">{{ selectedColor }}</span>
        </div>
    </a-dropdown>
</template>

<script lang="ts">
    import { defineComponent, computed, PropType } from 'vue'
    import { useVModels } from '@vueuse/core'



    export default defineComponent({
        name: 'ClassificationColorSelector',
        components: {
        },
        props: {
            selectedColor: {
                type: String as PropType<'Blue' | 'Green' | 'Red' | 'Yellow'>,
                required: true,
                default: 'Blue'
            }
        },
        emits:['update:selectedColor'],
        setup(props, { emit }) {
            const options = [
                {
                    color: 'Blue',
                    background: 'bg-indigo-50',
                    text: 'text-blue-600'
                },
                {
                    color: 'Green',
                    background: 'bg-green-50',
                    text: 'text-green-600'
                },
                {
                    color: 'Yellow',
                    background: 'bg-yellow-50',
                    text: 'text-yellow-600'
                },
                {
                    color: 'Red',
                    background: 'bg-red-50',
                    text: 'text-red-600'
                },

            ];

            // const selectedColor = ref(options[0].color)
            const { selectedColor } = useVModels(props, emit)


            const selectedBackground = computed(() => options.find((option) => option.color === selectedColor.value)?.background ?? options[0].background)
            const selectedText = computed(() => options.find((option) => option.color === selectedColor.value)?.text ?? options[0].text)

            return {
                options,
                selectedColor,
                selectedBackground,
                selectedText
            }
        },
    })
</script>


<style lang="less" module>

</style>

