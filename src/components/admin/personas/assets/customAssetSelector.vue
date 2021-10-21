<template>
    <div class="mx-4">
        <div
            class="flex items-center justify-start my-2 gap-x-2"
            v-for="(_, idx) in regexes"
        >
            <a-input
                class="flex-grow"
                placeholder="database/schema/table/column"
                v-model:value="regexes[idx]"
                @keyup.enter="addExpr"
            >
                <template #prefix>
                    <span class="text-sm bg-gray-100 text-gray">
                        {{ connectionQfName.split('/').slice(-1)[0] }}/
                    </span>
                </template>
            </a-input>
            <AtlanIcon
                @click="removeExpr(idx)"
                icon="Decline"
                class="flex-none cursor-pointer"
            />
        </div>
        <button @click="addExpr" class="text-sm text-primary">
            + Add expression
        </button>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref } from 'vue'
    import AtlanBtn from '@/UI/button.vue'

    export default defineComponent({
        name: 'CustomAssetSelector',
        components: { AtlanBtn },
        props: {
            connectionQfName: {
                type: String,
                required: true,
            },
            assets: {
                type: Array as PropType<string[]>,
                required: true,
            },
        },
        emits: ['update:assets'],
        setup(props, { emit }) {
            const regexes = ref([] as String[])
            function addExpr() {
                regexes.value.push('')
            }
            function removeExpr(idx: number) {
                regexes.value.splice(idx, 1)
            }

            return { regexes, addExpr, removeExpr }
        },
    })
</script>
