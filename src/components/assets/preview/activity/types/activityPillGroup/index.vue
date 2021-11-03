<template>
    <slot name="header"> </slot>
    <div class="flex flex-wrap text-sm">
        <div
            class="
                flex flex-wrap
                items-center
                flex-grow
                w-10
                my-3
                gap-x-1 gap-y-1.5
            "
        >
            <template v-for="item in itemList" :key="item">
                <slot name="pill-content" :item="item"></slot>
            </template>
            <span
                v-if="splittedItems.b.length > 0"
                class="
                    px-1
                    py-0.5
                    text-sm
                    rounded
                    text-primary
                    mr-3
                    cursor-pointer
                "
                @click="() => toggleAllItems()"
            >
                {{
                    showAll ? 'Show less' : `and ${splittedItems.b.length} more`
                }}
            </span>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, computed } from 'vue'
    import { activityInterface } from '~/types/activitylogs/activitylog.interface'

    export default defineComponent({
        name: 'ActivityPillGroup',
        props: {
            data: {
                type: Object as PropType<activityInterface>,
                default() {
                    return { displayValue: '', value: [] }
                },
            },
        },
        setup(props) {
            const showAll = ref<boolean>(false)

            const toggleAllItems = () => {
                showAll.value = !showAll.value
            }

            const splitArray = (sizeofSplit: number, arr: any[]) => {
                if (sizeofSplit >= arr.length) {
                    return {
                        a: [...arr],
                        b: [],
                    }
                }
                const a: any[] = arr.slice(0, sizeofSplit)
                const b: any[] = arr.slice(sizeofSplit, arr.length)
                return {
                    a,
                    b,
                }
            }
            const splittedItems = ref(splitArray(5, props.data.value))
            const itemList = computed(() =>
                showAll.value
                    ? [...splittedItems.value.a, ...splittedItems.value.b]
                    : splittedItems.value.a
            )

            return { splittedItems, showAll, toggleAllItems, itemList }
        },
    })
</script>
