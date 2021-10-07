<template>
    <a-select
        v-model:value="warehouse"
        @change="handleWarehouseChange"
        class="text-sm"
        :class="$style.warehouse"
        :bordered="false"
        style="min-width: 120px"
    >
        <a-select-option value="snowflake" class="text-sm">
            <div class="flex items-center">
                <img
                    src="/src/assets/images/source/snowflake.png"
                    class="w-3 h-3 mr-2"
                /><span class="mr-1 text-gray-500">Snowflake</span>
            </div>
        </a-select-option>
        <a-select-option value="snowflake_mac1" class="text-sm"
            ><div class="flex items-center">
                <img
                    src="/src/assets/images/source/snowflake.png"
                    class="w-auto h-3 mr-2"
                />
                <span class="mr-1 text-gray-500">Snowflake_mac1</span>
            </div>
        </a-select-option>
        <a-select-option value="snowflake_mac2" class="text-sm"
            ><div class="flex items-center">
                <img
                    src="/src/assets/images/source/snowflake.png"
                    class="w-auto h-3 mr-2"
                />
                <span class="mr-1 text-gray-500">Snowflake_mac2</span>
            </div>
        </a-select-option>
    </a-select>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs, ref, Ref } from 'vue'

    export default defineComponent({
        components: {},
        props: {},
        setup(props) {
            const warehouse: Ref<string> = ref('snowflake')
            const handleWarehouseChange = (warehouse: string) => {}
            return {
                handleWarehouseChange,
                warehouse,
            }
        },
    })
</script>
<style lang="less" scoped>
    .placeholder {
        background-color: #f4f4f4;
    }
</style>
<style lang="less" module>
    .warehouse {
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
