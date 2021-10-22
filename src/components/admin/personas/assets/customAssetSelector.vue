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
                @click="removeExpr(idx)"
                icon="Cross"
                class="flex-none text-gray-500 cursor-pointer hover:text-gray"
            />
        </div>
        <button @click="addExpr" class="text-sm text-primary">
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
