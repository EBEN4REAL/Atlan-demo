<template>
    <div class="flex items-center">
        <a-input
            v-model:value="firstvalue"
            placeholder="Enter first value"
            class="w-full border-gray-300 rounded box-shadow focus:border-primary-focus"
            style="height: 32px !important"
            @change="(event) => onChange(event, 'first')"
        />
        <a-input
            v-model:value="secondValue"
            placeholder="Enter second value"
            class="w-full ml-3 border-gray-300 rounded box-shadow focus:border-primary-focus"
            style="height: 32px !important"
            @change="(event) => onChange(event, 'second')"
        />
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, watch, PropType, toRaw } from 'vue'
    import { useVModels } from '@vueuse/core'

    export default defineComponent({
        name: 'Sub panel',
        components: {},
        props: {
            inputValue: {
                type: Array,
                required: true,
            },
        },

        setup(props, { emit }) {
            const { inputValue } = useVModels(props)

            let firstvalue = ref(inputValue.value ? inputValue.value[0] : null)
            let secondValue = ref(inputValue.value ? inputValue.value[1] : null)

            const onChange = (event, type) => {
                console.log('value: ', event.target.value)
                if (type === 'first') {
                    inputValue.value = [event.target.value, secondValue.value]
                } else {
                    inputValue.value = [firstvalue.value, event.target.value]
                }
            }

            return {
                firstvalue,
                secondValue,
                onChange,
            }
        },
    })
</script>
<style lang="less" scoped>
    .box-shadow {
        box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.05);
    }
</style>
