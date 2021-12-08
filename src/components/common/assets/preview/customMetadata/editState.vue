<template>
    <div class="flex self-start flex-grow">
        <MultiInput
            v-if="
                [
                    'number',
                    'int',
                    'long',
                    'float',
                    'url',
                    'string',
                    'text',
                ].includes(getDatatypeOfAttribute(attribute).toLowerCase()) &&
                isMultivalued
            "
            v-model="localValue"
            class="flex-grow shadow-none"
            placeholder="Press Enter to add"
            :data-type="getDatatypeOfAttribute(attribute)"
            @change="handleChange"
        />

        <a-input
            v-else-if="getDatatypeOfAttribute(attribute) === 'number'"
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
            :placeholder="`Select ${isMultivalued ? 'users' : 'a user'}`"
            :mode="isMultivalued ? 'multiple' : null"
            style="width: 100%"
            :show-arrow="true"
            @focus="userSearch"
            @change="handleChange"
        >
            <a-select-option
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
            :placeholder="`Select ${isMultivalued ? 'groups' : 'a group'}`"
            :mode="isMultivalued ? 'multiple' : null"
            style="width: 100%"
            :show-arrow="true"
            @focus="groupSearch"
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
            :placeholder="`Select ${isMultivalued ? 'enums' : 'an enum'}`"
            :mode="isMultivalued ? 'multiple' : null"
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
    import MultiInput from '@/common/input/customizedTagInput.vue'

    export default defineComponent({
        name: 'EditCustomMetadata',
        components: { MultiInput },
        props: {
            attribute: {
                type: Object,
                required: true,
            },
            modelValue: {
                type: String,
                required: false,
                default: () => undefined,
            },
        },

        emits: ['change', 'update:modelValue'],

        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)

            const localValue: any = ref(modelValue.value)

            const {
                getDatatypeOfAttribute,
                isLink,
                formatDisplayValue,
                getEnumOptions,
            } = useCustomMetadataHelpers()

            const { list: userList, handleSearch: handleUserSearch } =
                useFacetUsers(false)

            const userSearch = (val) => {
                handleUserSearch(val)
            }

            const { list: groupList, handleSearch: handleGroupSearch } =
                useFacetGroups(false)
            const groupSearch = (val) => {
                handleGroupSearch(val)
            }

            const isMultivalued = ref(
                props.attribute.options.multiValueSelect === 'true'
            )

            // set proper default value
            if (isMultivalued.value && !localValue.value) localValue.value = []
            else if (!localValue.value) localValue.value = ''

            const handleChange = () => {
                modelValue.value = localValue.value
                emit('change')
            }

            return {
                isMultivalued,
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
