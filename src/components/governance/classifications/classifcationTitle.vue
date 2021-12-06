<template>

</template>

<script lang="ts">
    import { defineComponent, computed, PropType } from 'vue'
    import { useVModels } from '@vueuse/core'
    
    import { ClassificationInterface } from '~/types/classifications/classification.interface';



    export default defineComponent({
        name: 'ClassificationTitle',
        components: {
            classification: {
                type: Object as PropType<ClassificationInterface>
            }
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

