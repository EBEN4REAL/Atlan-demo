<template>
    <div class="mx-4">
        <div
            v-for="(_, idx) in regexes"
            class="flex items-center justify-start my-2 gap-x-2"
        >
            <a-input
                v-model:value="regexes[idx]"
                class="flex-grow"
                placeholder="database/schema/table/column"
                @keyup.enter="addExpr"
            >
                <template #prefix>
                    <img
                        :src="getImage(connectionQfName.split('/')[1])"
                        class="w-auto h-3 mr-2"
                    />
                    <span class="text-sm text-gray">
                        {{ connectionQfName.split('/').slice(-1)[0] }}/
                    </span>
                </template>
            </a-input>
            <AtlanIcon
                icon="Cross"
                class="flex-none text-gray-500 cursor-pointer hover:text-gray"
                @click="removeExpr(idx)"
            />
        </div>
        <button class="text-sm text-primary" @click="addExpr">
            + Add expression
        </button>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref } from 'vue'
    import { useConnectionsStore } from '~/store/connections'
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

            const connStore = useConnectionsStore()
            const getImage = (id: string) => connStore.getImage(id)

            return { regexes, addExpr, removeExpr, getImage }
        },
    })
</script>
