<template>
    <div class="flex" :class="className">
        <template v-for="item in list" :key="item.id">
            <div
                class="
                    flex
                    items-center
                    justify-center
                    px-5
                    py-1
                    ml-2
                    text-xs
                    border
                    rounded
                    cursor-pointer
                    button
                    hover:text-primary hover:border-primary
                "
                :class="
                    item.id === data
                        ? 'active-btn border-primary'
                        : 'text-gray-500'
                "
                @click="() => handleClick(item)"
            >
                {{ item.label }}
            </div>
        </template>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs } from 'vue'
    import { CheckboxArray, Checkbox } from '~/types'

    export default defineComponent({
        props: {
            data: {
                type: String,
                required: true,
            },
            list: {
                type: Array as PropType<CheckboxArray>,
                required: true,
            },
            class: {
                type: String,
                required: false,
            },
        },
        emits: ['update:data', 'change'],
        setup(props, { emit }) {
            const { data, list, class: className } = toRefs(props)
            function handleClick(item: Checkbox) {
                emit('update:data', item.id)
                emit('change', item.id)
            }

            return {
                handleClick,
                className,
                data,
                list,
            }
        },
    })
</script>

<style lang="less" scoped>
    .active-btn {
        @apply text-primary bg-primary-light;
    }
    .button:first-child {
        @apply ml-0 !important;
    }
</style>
