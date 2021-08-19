<template>
    <slot name="header"> </slot>
    <div class="flex flex-wrap mt-3 text-sm border border-transparent rounded">
        <template v-for="item in splittedItems.a" :key="item">
            <slot name="chip-content" :item="item"> {{ item }}</slot> </template
        ><template v-if="showAll"
            ><template v-for="item in splittedItems.b" :key="item">
                <slot name="chip-content" :item="item"> {{ item }}</slot>
            </template></template
        >
        <div
            v-if="splittedItems.b.length > 0 && !showAll"
            class="flex items-center mb-3 mr-3 cursor-pointer"
            @click="() => toggleAllItems(true)"
        >
            <span class="px-1 py-0.5 text-sm font-bold rounded text-primary">
                and {{ splittedItems.b.length }} more
            </span>
        </div>
        <div
            v-if="splittedItems.b.length > 0 && showAll"
            class="flex items-center justify-center mb-3 mr-3 cursor-pointer"
            @click="() => toggleAllItems(false)"
        >
            <span class="px-1 py-0.5 text-sm font-bold rounded text-primary">
                show less
            </span>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref } from 'vue'
    import { activityInterface } from '~/types/activitylogs/activitylog.interface'

    export default defineComponent({
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

            const toggleAllItems = (state: boolean) => {
                showAll.value = state
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

            return { splittedItems, showAll, toggleAllItems }
        },
    })
</script>
