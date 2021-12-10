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
            <a-select-option
                v-for="node in filteredList"
                :key="node.id"
                :value="node.id"
            >
                <div class="flex items-center">
                    <img
                        v-if="node?.image"
                        :src="node.image"
                        class="w-auto h-3 mr-2"
                    />
                    <span class=""
                        >{{ capitalizeFirstLetter(node.label) }}
                        {{ node.img }}
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
import { computed, defineComponent, ref, Ref, toRefs, PropType } from 'vue'
import { List } from '~/constant/status'
import { useConnectionStore } from '~/store/connection'

export default defineComponent({
    props: {
        connector: {
            type: String,
            required: true,
        },
        filterSourceIds: {
            type: Object as PropType<string[]>,
            required: false,
            default: [],
        },
    },
    components: {},
    emits: ['change', 'update:data'],
    setup(props, { emit }) {
        const { connector: selectedValue, filterSourceIds } = toRefs(props)
        const store = useConnectionStore()
        /* Remove the sources mentioned in filterIds array */
        const filterSourceList = (filterSourceIds: string[]) => {
            return store.getSourceList.filter(
                (item) => !filterSourceIds.includes(item.id)
            )
        }
        const filteredList = computed(() =>
            filterSourceIds.value.length > 0
                ? filterSourceList(filterSourceIds.value)
                : store.getSourceList
        )
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
        box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05) !important;
        background-color: #fbfbfb !important;
        border: 1px solid #e9ebf1 !important;
        color: #6f7590 !important;
        border-radius: 8px !important;
    }
}
</style>
