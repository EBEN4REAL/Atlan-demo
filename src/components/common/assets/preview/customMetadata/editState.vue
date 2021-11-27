<template>
    <div class="flex self-start flex-grow">
        <a-input
            v-if="getDatatypeOfAttribute(attribute) === 'number'"
            v-model:value="localValue"
            :allow-clear="true"
            class="flex-grow border shadow-none"
            type="number"
            placeholder="Enter an integer..."
            @change="handleChange"
        />
        <a-input
            v-else-if="getDatatypeOfAttribute(attribute) === 'float'"
            v-model:value="localValue"
            :allow-clear="true"
            class="flex-grow border shadow-none"
            type="number"
            step="0.01"
            min="0"
            max="10"
            placeholder="Enter decimal value..."
            @change="handleChange"
        />
        <a-input
            v-else-if="getDatatypeOfAttribute(attribute) === 'url'"
            v-model:value="localValue"
            :allow-clear="true"
            class="flex-grow border shadow-none"
            type="url"
            placeholder="Enter a URL..."
            @change="handleChange"
        />
        <a-radio-group
            v-else-if="getDatatypeOfAttribute(attribute) === 'boolean'"
            v-model:value="localValue"
            :allow-clear="true"
            class="flex-grow"
            @change="handleChange"
        >
            <a-radio :value="true">Yes</a-radio>
            <a-radio :value="false">No</a-radio>
        </a-radio-group>
        <a-date-picker
            v-else-if="getDatatypeOfAttribute(attribute) === 'date'"
            v-model:value="localValue"
            :allow-clear="true"
            class="flex-grow w-100"
            value-format="x"
            @change="handleChange"
        />
        <a-textarea
            v-else-if="getDatatypeOfAttribute(attribute) === 'text'"
            v-model:value="localValue"
            :allow-clear="true"
            :auto-size="true"
            :show-count="parseInt(attribute.options.maxStrLength) < 1000"
            :maxlength="parseInt(attribute.options.maxStrLength)"
            placeholder="Type..."
            type="text"
            class="flex-grow shadow-none"
            @change="handleChange"
        />
        <a-select
            v-else-if="getDatatypeOfAttribute(attribute) === 'users'"
            v-model:value="localValue"
            class="flex-grow shadow-none border-1"
            :allow-clear="true"
            :placeholder="`Select ${
                attribute.options.multiValueSelect === 'true'
                    ? 'users'
                    : 'a user'
            }`"
            :mode="
                attribute.options.multiValueSelect === 'true'
                    ? 'multiple'
                    : null
            "
            style="width: 100%"
            :show-arrow="true"
            @search="userSearch"
            @change="handleChange"
            ><a-select-option
                v-for="(item, index) in userList"
                :key="index"
                :value="item.username"
                :label="item.username"
                >{{ item.username }}
            </a-select-option>
        </a-select>
        <a-select
            v-else-if="getDatatypeOfAttribute(attribute) === 'groups'"
            v-model:value="localValue"
            class="flex-grow shadow-none border-1"
            :allow-clear="true"
            :placeholder="`Select ${
                attribute.options.multiValueSelect === 'true'
                    ? 'groups'
                    : 'a group'
            }`"
            :mode="
                attribute.options.multiValueSelect === 'true'
                    ? 'multiple'
                    : null
            "
            style="width: 100%"
            :show-arrow="true"
            @search="groupSearch"
            @change="handleChange"
            ><a-select-option
                v-for="(item, index) in groupList"
                :key="index"
                :value="item.alias"
                :label="item.alias"
                >{{ item.alias }}
            </a-select-option>
        </a-select>
        <a-select
            v-else-if="getDatatypeOfAttribute(attribute) === 'enum'"
            v-model:value="localValue"
            class="flex-grow shadow-none border-1"
            :allow-clear="true"
            :placeholder="`Select ${
                attribute.options.multiValueSelect === 'true'
                    ? 'enums'
                    : 'an enum'
            }`"
            :mode="
                attribute.options.multiValueSelect === 'true'
                    ? 'multiple'
                    : null
            "
            style="width: 100%"
            :show-arrow="true"
            :options="getEnumOptions(attribute.typeName)"
            @change="handleChange"
        />
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs } from 'vue'
    import { useVModels } from '@vueuse/core'
    import useCustomMetadataHelpers from '~/composables/custommetadata/useCustomMetadataHelpers'

    import useFacetUsers from '~/composables/user/useFacetUsers'
    import useFacetGroups from '~/composables/group/useFacetGroups'

    export default defineComponent({
        name: 'EditCustomMetadata',

        props: {
            attribute: {
                type: Object,
                required: true,
            },
            modelValue: {
                type: Object,
                required: false,
                default: () => {},
            },
        },

        emits: ['change', 'update:modelValue'],

        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)

            const localValue = ref(modelValue.value)

            const {
                getDatatypeOfAttribute,
                isLink,
                formatDisplayValue,
                getEnumOptions,
            } = useCustomMetadataHelpers()

            const { list: userList, handleSearch: handleUserSearch } =
                useFacetUsers()

            const userSearch = (val) => {
                handleUserSearch(val)
            }

            const { list: groupList, handleSearch: handleGroupSearch } =
                useFacetGroups()
            const groupSearch = (val) => {
                handleGroupSearch(val)
            }

            const handleChange = () => {
                modelValue.value = localValue.value
                emit('change')
            }

            return {
                getDatatypeOfAttribute,
                isLink,
                formatDisplayValue,
                localValue,
                getEnumOptions,
                handleChange,
                userSearch,
                userList,
                groupSearch,
                groupList,
            }
        },
    })
</script>
