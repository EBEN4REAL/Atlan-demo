<template>
    <a-select
        :value="modelValue"
        placeholder="Connections"
        :show-search="true"
        :autoClearSearchValue="true"
        @search="handleSearch"
        :allowClear="true"
        :filterOption="false"
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
    import { computed, defineComponent, ref } from 'vue';
    import { useConnectionsStore } from '~/store/connections';

    export default defineComponent({
        props: {
            modelValue: {
                required: false,
            },
            connector: {
                type: String,
                required: false,
            },
        },
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            const store = useConnectionsStore();
            let searchValue = ref('');
            let connectionsDropdown = ref(null);
            let localValue = ref();

            const filteredList = computed(() => {
                return store.getList?.filter((item) => {
                    if (props.connector) {
                        if (
                            props.connector === item.attributes.integrationName
                        ) {
                            return true;
                        }
                    }
                    return false;
                });
            });

            const getImage = (id: string) => {
                return store.getImage(id);
            };

            const handleSearch = (inputValue: string) => {
                searchValue.value = inputValue;
            };
            const handleChange = (checkedValues: any) => {
                emit('update:modelValue', checkedValues);
                emit('change', checkedValues);
            };

            return {
                filteredList,
                handleSearch,
                handleChange,
                connectionsDropdown,
                localValue,
                getImage,
            };
        },
    });
</script>
