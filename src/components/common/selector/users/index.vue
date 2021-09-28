<template>
    <a-select
        :value="modelValue"
        :show-search="true"
        style="width: 100%"
        :allow-clear="true"
        @change="handleChange"
        @search="handleSearch"
        placeholder="Search users"
    >
        <a-select-opt-group key="me" label="Me">
            <a-select-option :value="username" :key="username">
                <span class="text-xs text-gray">{{ username }}</span>
            </a-select-option>
        </a-select-opt-group>
        <a-select-opt-group key="others" label="Users">
            <a-select-option
                v-for="(options, index) in list"
                :key="options.username + index"
                :value="options.username"
            >
                <span class="text-xs text-gray">
                    {{ options.username }}
                </span>
            </a-select-option>
        </a-select-opt-group>
    </a-select>
</template>

<script lang="ts">
    import { defineComponent, computed } from 'vue'
    import fetchUserList from '~/composables/user/fetchUserList'
    import whoami from '~/composables/user/whoami'

    export default defineComponent({
        props: {
            modelValue: {
                type: String,
                required: false,
                default: () => undefined,
            },
        },
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            // this is needed as there are multiple keys with the same param name
            const { list: rawList, handleSearch } = fetchUserList()
            const { username, name } = whoami()

            const handleChange = (checkedValues: string) => {
                emit('update:modelValue', checkedValues)
                emit('change', checkedValues)
            }

            const list = computed(() =>
                rawList.value.filter((ls) => ls.username != username.value)
            )

            return {
                list,
                username,
                name,
                handleSearch,
                handleChange,
            }
        },
    })
</script>

<style lang="less" module></style>
