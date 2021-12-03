<template>
    <div
        class="flex items-center w-full p-3 bg-gray-100 border-t border-gray-300 rounded-b  group-hover:border-white"
    >
        <template v-for="item in items" :key="item.label">
            <AtlanBtn
                class="flex items-center px-4 mr-3 text-gray-700 bg-white border border-gray-300 rounded "
                size="sm"
                color="secondary"
                padding="compact"
                @click.stop="() => handleAdd(item.id)"
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
        name: 'Footer Panels',
        emits: ['add'],
        setup(props, { emit }) {
            const items = [
                {
                    id: 'aggregate',
                    icon: 'Trigger',
                    label: 'Aggregate',
                    class: 'mt-0.5 mr-2',
                },
                {
                    id: 'filter',
                    icon: 'Filter',
                    label: 'Filter',
                    class: 'mr-2',
                },
                {
                    id: 'sort',
                    icon: 'Sort',
                    label: 'Sort',
                    class: 'mr-2',
                },
                {
                    id: 'join',
                    icon: 'Union',
                    label: 'Join data',
                    class: 'mr-2',
                },
                {
                    id: 'group',
                    icon: 'BuilderGroup',
                    label: 'Group',
                    class: 'mr-2',
                },
            ]
            const handleAdd = (type) => {
                emit('add', type)
            }
            return {
                handleAdd,
                items,
            }
        },
        components: { AtlanBtn },
    })
</script>
<style lang="less" scoped></style>