<template>
    <a-input
        ref="searchBar"
        :placeholder="placeholder"
        v-model="value"
        type="text"
        :size="size"
        class="flex-1 w-full text-sm bg-transparent shadow-md  focus:outline-none"
        @keyup.esc="$event.target.blur()"
    >
        <template #prefix>
            <AtlanIcon icon="Search" class="flex-none text-gray-500" />
        </template>

        <template #suffix>
            <a-popover
                v-if="$slots.postFilter"
                trigger="click"
                placement="bottomRight"
            >
                <template #content>
                    <slot name="postFilter" />
                </template>

                <button
                    class="p-1 transition-colors rounded hover:bg-gray-light"
                >
                    <AtlanIcon
                        :icon="dot ? 'FilterDot' : 'Filter'"
                        class="w-4 h-4"
                    />
                    <slot name="buttonAggregation" />
                </button>
            </a-popover>
        </template>
    </a-input>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        nextTick,
        onMounted,
        Ref,
        ref,
        toRefs,
        PropType,
    } from 'vue'

    export default defineComponent({
        name: 'SearchAndFilter',
        props: {
            autofocus: { type: Boolean, default: () => false },
            dot: { type: Boolean, default: () => false },
            placeholder: { type: String, default: () => 'Search' },
            size: {
                type: String as PropType<'default' | 'minimal'>,
                default: () => 'default',
            },
            value: { type: String },
        },
        emits: ['update:value', 'change'],
        setup(props, { emit }) {
            const { autofocus, value: val } = toRefs(props)
            const searchBar: Ref<null | HTMLInputElement> = ref(null)
            const value = computed({
                get: () => val.value,
                set: (newVal) => {
                    emit('update:value', newVal)
                    emit('change', newVal)
                },
            })

            function clearInput() {
                emit('update:value', '')
                emit('change', '')
            }

            onMounted(async () => {
                if (autofocus.value) {
                    await nextTick()
                    searchBar.value?.focus()
                }
            })

            return {
                value,
                searchBar,
                clearInput,
            }
        },
    })
</script>
<style lang="less" scoped></style>
