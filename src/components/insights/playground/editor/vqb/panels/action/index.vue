<template>
    <div
        class="flex items-center w-full p-3 bg-gray-100 border-t rounded rounded-b "
    >
        <template v-for="item in items" :key="item.label">
            <AtlanBtn
                class="flex items-center px-4 mr-3 text-gray-700 bg-white border border-gray-300 rounded "
                size="sm"
                color="secondary"
                padding="compact"
            >
                <template #prefix>
                    <AtlanIcon
                        :icon="item.icon"
                        :class="['text-sm', item.class]"
                    />
                </template>
                <span>{{ item.label }}</span>
            </AtlanBtn>
        </template>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import AtlanBtn from '@/UI/button.vue'

    export default defineComponent({
        name: 'Columns',
        setup(props, { emit }) {
            const items = [
                {
                    icon: 'Trigger',
                    label: 'Aggregate',
                    class: 'mt-0.5',
                },
                {
                    icon: 'Filter',
                    label: 'Filter',
                    class: '',
                },
                {
                    icon: 'Sort',
                    label: 'Sort',
                    class: '',
                },
                {
                    icon: 'Union',
                    label: 'Join data',
                    class: '',
                },
                {
                    icon: 'BuilderGroup',
                    label: 'Group',
                    class: '',
                },
            ]
            return {
                items,
            }
        },
        components: { AtlanBtn },
    })
</script>
<style lang="less" scoped></style>
