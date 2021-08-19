<template>
    <a-select
        :value="modelValue"
        placeholder="Connections"
        :show-search="true"
        :auto-clear-search-value="true"
        :allow-clear="true"
        :filter-option="false"
        @search="handleSearch"
        @change="handleChange"
    >
        <template v-for="item in filteredList" :key="item.guid">
            <a-select-option :value="item.attributes.qualifiedName">
                <div class="flex items-center">
                    <img
                        :src="getImage(item?.attributes?.integrationName)"
                        class="w-auto h-3 mr-1"
                    />{{ item.attributes.displayName || item.attributes.name }}
                </div>
            </a-select-option>
        </template>
    </a-select>
</template>

<script lang="ts">
    import { computed, defineComponent, ref } from 'vue'
    import { useConnectionsStore } from '~/store/connections'

    export default defineComponent({
        props: {
            modelValue: {
                required: false,
            },
            connector: {
                type: String,
                required: false,
            },
            showAll: {
                type: Boolean,
                required: false,
            },
        },
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            const store = useConnectionsStore()
            const searchValue = ref('')
            const connectionsDropdown = ref(null)
            const localValue = ref()

            const filteredList = computed(() =>
                store.getList
                    ?.filter((item) => {
                        if (!props.showAll) {
                            if (props.connector) {
                                if (
                                    props.connector ===
                                    item.attributes.integrationName
                                ) {
                                    return item.attributes.displayName
                                        .toLowerCase()
                                        .includes(
                                            searchValue.value.toLowerCase()
                                        )
                                }
                            }
                            return false
                        }
                        return item.attributes.displayName
                            .toLowerCase()
                            .includes(searchValue.value.toLowerCase())
                    })
                    .sort((a, b) =>
                        a.attributes.displayName?.toLowerCase() >
                        b.attributes.displayName?.toLowerCase()
                            ? 1
                            : b.attributes.displayName?.toLowerCase() >
                              a.attributes.displayName?.toLowerCase()
                            ? -1
                            : 0
                    )
            )

            const getImage = (id: string) => store.getImage(id)

            const handleSearch = (inputValue: string) => {
                searchValue.value = inputValue
            }
            const handleChange = (checkedValues: any) => {
                emit('update:modelValue', checkedValues)
                emit('change', checkedValues)
            }

            return {
                filteredList,
                handleSearch,
                handleChange,
                connectionsDropdown,
                localValue,
                getImage,
            }
        },
    })
</script>
