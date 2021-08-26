<template>
    <a-select
        :value="modelValue"
        :show-search="true"
        :filter-option="true"
        style="width: 100%"
        :allow-clear="true"
        @change="handleChange"
        @search="handleSearch"
    >
        <a-select-opt-group key="me" label="Me">
            <a-select-option :value="username">
                <div class="flex flex-col">
                    <div>{{ name }}</div>
                    <div class="text-xs text-gray-500">{{ username }}</div>
                </div>
            </a-select-option>
        </a-select-opt-group>
        <a-select-opt-group key="Users" label="Users">
            <template v-for="options in list" :key="options.username">
                <a-select-option :value="options.username">
                    <div class="flex flex-col">
                        <div>
                            {{ options.first_name }} {{ options.last_name }}
                        </div>
                        <div class="text-xs text-gray-500">
                            {{ options.username }}
                        </div>
                    </div>
                </a-select-option>
            </template>
        </a-select-opt-group>
    </a-select>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import fetchUserList from '~/composables/user/fetchUserList'
    import whoami from '~/composables/user/whoami'

    export default defineComponent({
        props: {
            modelValue: {
                type: String,
                required: false,
            },
        },
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            // this is needed as there are multiple keys with the same param name
            const { list, handleSearch } = fetchUserList()
            const { username, name } = whoami()

            const handleChange = (checkedValues: string) => {
                emit('update:modelValue', checkedValues)
                emit('change', checkedValues)
            }

            return {
                list,
                username,
                name,
                handleSearch,
                handleChange,
            }
        },
        data() {
            return {}
        },
        computed: {},
    })
</script>

<style lang="less" module></style>
