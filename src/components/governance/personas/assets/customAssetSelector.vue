<template>
    <div class="mx-4">
        <div
            v-for="(_, idx) in regexes"
            :key="idx"
            class="flex items-center justify-start my-2 gap-x-2"
        >
            <a-input
                v-model:value="regexes[idx]"
                class="flex-grow"
                :placeholder="
                    connectionQfName.includes('tableau')
                        ? 'database/schema/table/column'
                        : 'Qualified name'
                "
                data-test-id="custom-asset-input"
                @change="updateAssets"
                @keyup.enter="addExpr"
            >
                <template #prefix>
                    <img
                        :src="getImage(connectionQfName.split('/')[1])"
                        class="w-auto h-4 mr-2"
                    />
                    <span class="text-sm text-gray"> {{ connName }}/ </span>
                </template>
            </a-input>
            <AtlanIcon
                v-if="regexes[idx]"
                icon="Cross"
                data-test-id="remove-expression"
                class="flex-none text-gray-500 cursor-pointer hover:text-gray"
                @click="removeExpr(idx)"
            />
        </div>
        <button
            v-if="!hideCTA"
            class="text-sm text-primary"
            data-test-id="add-expression"
            @click="addExpr"
        >
            + Add expression
        </button>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, toRefs, computed } from 'vue'
    import { useConnectionStore } from '~/store/connection'
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
            const { connectionQfName } = toRefs(props)
            const connStore = useConnectionStore()
            const connName = computed(() => {
                const found = connStore.getList.find(
                    (conn) =>
                        conn.attributes.qualifiedName === connectionQfName.value
                )
                return found?.attributes?.name || ''
            })
            const regexes = ref([''] as String[])
            const hideCTA = computed(() => regexes.value.some((el) => !el))
            function addExpr() {
                regexes.value = regexes.value.filter((val) => val.trim().length)
                regexes.value.push('')
            }

            function removeExpr(idx: number) {
                regexes.value.splice(idx, 1)
            }

            function updateAssets() {
                emit(
                    'update:assets',
                    regexes.value
                        .filter((val) => val.trim().length)
                        .map((val) => `${connectionQfName.value}/${val}`)
                )
            }
            const getImage = (id: string) => connStore.getImage(id)

            return {
                regexes,
                addExpr,
                removeExpr,
                getImage,
                updateAssets,
                connName,
                hideCTA,
            }
        },
    })
</script>
