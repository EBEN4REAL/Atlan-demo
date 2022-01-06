<template>
    <div
        class="flex items-center self-start flex-grow break-all whitespace-pre-line"
    >
        <div
            v-if="getDatatypeOfAttribute(attribute) === 'url' && isMultivalued"
            class="flex flex-wrap gap-2"
        >
            <span v-if="!attribute.value?.length">-</span>
            <template v-else>
                <template v-for="v in attribute.value" :key="v">
                    <span v-linkified class="space-x-1">
                        <img
                            :src="`https://www.google.com/s2/favicons?domain=${v}`"
                            :alt="v"
                            class="inline-block w-4 h-4"
                        />{{ v }}</span
                    >
                </template>
            </template>
        </div>
        <a
            v-else-if="getDatatypeOfAttribute(attribute) === 'url'"
            target="_blank"
            :href="`//${attribute.value}`"
        >
            <div
                v-if="attribute.value"
                class="flex items-center text-primary gap-x-1"
            >
                <img
                    :src="`https://www.google.com/s2/favicons?domain=${attribute.value}`"
                    :alt="attribute.value"
                    class="w-4 h-4"
                />
                {{ attribute.value }}
            </div>
            <span v-else>-</span>
        </a>
        <template
            v-else-if="
                ['text', 'int', 'float', 'number', 'decimal'].includes(
                    getDatatypeOfAttribute(attribute)
                ) && isMultivalued
            "
        >
            <span v-if="!attribute.value?.length">-</span>

            <div v-else class="flex flex-wrap gap-1">
                <span
                    v-for="v in attribute.value"
                    :key="v"
                    class="px-2 bg-gray-200 rounded-full"
                    >{{ v }}
                </span>
            </div>
        </template>
        <a-typography-paragraph
            v-else-if="getDatatypeOfAttribute(attribute) === 'text'"
            class="text-gray-700"
            :ellipsis="{
                rows: 5,
                expandable: true,
                symbol: 'more',
            }"
            :content="attribute.value || '-'"
        >
        </a-typography-paragraph>

        <div
            v-else-if="getDatatypeOfAttribute(attribute) === 'users'"
            class="flex flex-wrap gap-1"
        >
            <template v-if="!isMultivalued && attribute.value">
                <PopOverUser :item="attribute.value">
                    <UserPill
                        :username="attribute.value"
                        @click="handleClickUser(attribute.value)"
                    ></UserPill>
                </PopOverUser>
            </template>
            <template v-else-if="isMultivalued && attribute.value?.length"
                ><div v-for="username in attribute.value" :key="username">
                    <PopOverUser :item="username">
                        <UserPill
                            :username="username"
                            @click="handleClickUser(username)"
                        ></UserPill>
                    </PopOverUser>
                </div>
            </template>
            <template v-else>-</template>
        </div>
        <div
            v-else-if="getDatatypeOfAttribute(attribute) === 'groups'"
            class="flex flex-wrap gap-1"
        >
            <template v-if="!isMultivalued && attribute.value">
                <PopOverGroup :item="attribute.value">
                    <GroupPill
                        :name="attribute.value"
                        @click="handleClickGroup(attribute.value)"
                    ></GroupPill>
                </PopOverGroup>
            </template>
            <template v-else-if="isMultivalued && attribute.value?.length">
                <div v-for="name in attribute.value" :key="name">
                    <PopOverGroup :item="name">
                        <GroupPill
                            :name="name"
                            @click="handleClickGroup(name)"
                        ></GroupPill>
                    </PopOverGroup>
                </div>
            </template>
            <template v-else>-</template>
        </div>
        <div
            v-else-if="getDatatypeOfAttribute(attribute) === 'enum'"
            class="flex flex-wrap gap-1"
        >
            <template v-if="!isMultivalued && attribute.value">
                <EnumPill :label="attribute.value" />
            </template>
            <template v-else-if="isMultivalued && attribute.value?.length">
                <div v-for="e in attribute.value" :key="e">
                    <EnumPill :label="e" />
                </div>
            </template>
            <template v-else>-</template>
        </div>

        <span v-else class="text-gray-700">
            {{
                formatDisplayValue(
                    attribute.value?.toString() || '',
                    getDatatypeOfAttribute(attribute)
                ) || '-'
            }}</span
        >
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, PropType, Ref } from 'vue'

    // Components
    import UserPill from '@/common/pills/user.vue'
    import GroupPill from '@/common/pills/group.vue'
    import PopOverUser from '@/common/popover/user/user.vue'
    import PopOverGroup from '@/common/popover/user/groups.vue'
    import EnumPill from '@/UI/pill/pill.vue'

    // Composables
    import useCustomMetadataHelpers from '~/composables/custommetadata/useCustomMetadataHelpers'
    import { useUserPreview } from '~/composables/user/showUserPreview'
    import { useGroupPreview } from '~/composables/group/showGroupPreview'
    import { CUSTOM_METADATA_ATTRIBUTE as CMA } from '~/types/typedefs/customMetadata.interface'

    export default defineComponent({
        name: 'CustomMetadataReadOnly',
        components: {
            UserPill,
            GroupPill,
            PopOverUser,
            PopOverGroup,
            EnumPill,
        },
        props: {
            attribute: {
                type: Object,
                required: true,
            },
        },
        setup(props) {
            const { getDatatypeOfAttribute, formatDisplayValue } =
                useCustomMetadataHelpers()

            const { showUserPreview, setUserUniqueAttribute } = useUserPreview()
            const { showGroupPreview, setGroupUniqueAttribute } =
                useGroupPreview()

            const handleClickUser = (username: string) => {
                setUserUniqueAttribute(username, 'username')
                showUserPreview({ allowed: ['about', 'assets', 'groups'] })
            }

            const handleClickGroup = (groupAlias: string) => {
                setGroupUniqueAttribute(groupAlias, 'groupAlias')
                showGroupPreview({ allowed: ['about', 'assets', 'members'] })
            }

            const isMultivalued = ref(
                props.attribute.options.multiValueSelect === 'true' ||
                    props.attribute.options.multiValueSelect === true
            )

            return {
                isMultivalued,
                getDatatypeOfAttribute,
                formatDisplayValue,
                handleClickUser,
                handleClickGroup,
            }
        },
    })
</script>
