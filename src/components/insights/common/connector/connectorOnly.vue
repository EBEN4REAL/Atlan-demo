<template>
    <div class="w-full">
        <a-select
            :value="selectedValue"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :class="$style.connector"
            placeholder="Select a connector"
            dropdownClassName="connectorDropdown"
            :allowClear="true"
            :showSearch="true"
            @select="handleNodeSelect"
        >
            <a-select-option v-for="node in filteredList" :key="node.id" :value="node.id" >
                <div class="flex items-center">
                    <img v-if="node?.image" :src="node.image" class="w-auto h-3 mr-2" />
                    <span class="">{{
                        capitalizeFirstLetter(node.label)
                    }}
                {{ node.img}}
                    
                    </span>
                </div>

            </a-select-option>

            <template #suffixIcon>
                <AtlanIcon icon="ChevronDown" class="h-4 -mt-0.5 -ml-0.5" />
            </template>
        </a-select>

    </div>
</template>

<script lang="ts">
    import { capitalizeFirstLetter } from '~/utils/string'
    import {
        computed,
        defineComponent,
        ref,
        Ref,
        toRefs,
    } from 'vue'
    import { List } from '~/constant/status'
    import { useConnectionsStore } from '~/store/connections'
    import AssetDropdown from './assetDropdown.vue'

    export default defineComponent({
        props: {
            connector: {
                type: String,
                required: true,
            },
        },
        components: {
            AssetDropdown,
        },
        emits: ['change', 'update:data'],
        setup(props, { emit }) {
            
            const { connector: selectedValue } = toRefs(props)
            const store = useConnectionsStore()

            const filteredList = computed(() => store.getSourceList)
            const getImage = (id: string) => store.getImage(id)
            
            const list = computed(() => List)
            const placeholderLabel: Ref<Record<string, string>> = ref({})



            const handleNodeSelect = (value) => {
                emit('update:data', value)
            }

            function setPlaceholder(label: string, type: string) {
                placeholderLabel.value[type] = label
                if (type === 'connector') placeholderLabel.value.asset = ''
            }


            return {
                setPlaceholder,
                selectedValue,
                handleNodeSelect,
                getImage,
                filteredList,
                list,
                capitalizeFirstLetter,
            }
        },
    })
</script>
<style lang="less">
    .connectorDropdown {
        .ant-select-tree-switcher {
            width: 18px !important;
            height: 24px !important;
            line-height: 24px !important;
            margin-top: -4px !important;
        }
        .ant-select-switcher-icon {
            font-weight: normal !important;
        }
    }
</style>
<style lang="less" module>
    .connector {
        :global(.ant-select-selector) {
            box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
        }
    }
</style>