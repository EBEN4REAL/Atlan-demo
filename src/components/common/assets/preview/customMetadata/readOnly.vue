<template>
    <div class="flex items-center self-start flex-grow break-all">
        <a
            v-if="attribute?.options?.customType === 'url'"
            class="font-bold text-primary"
            target="_blank"
            :href="`//${attribute.value}`"
        >
            {{ attribute.value || '-' }}</a
        >

        <a-typography-paragraph
            v-else-if="getDatatypeOfAttribute(attribute) === 'text'"
            class="font-bold text-gray-700"
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
            <template v-if="attribute.options.multiValueSelect === 'false'">
                <PopOverUser :item="attribute.value">
                    <UserPill :username="attribute.value"></UserPill>
                </PopOverUser>
            </template>
            <template
                v-for="username in formatDisplayValue(
                    attribute.value || '',
                    getDatatypeOfAttribute(attribute)
                )"
                v-else
                :key="username"
            >
                <PopOverUser :item="username">
                    <UserPill :username="username"></UserPill>
                </PopOverUser>
            </template>
        </div>
        <div
            v-else-if="getDatatypeOfAttribute(attribute) === 'groups'"
            class="flex flex-wrap gap-1"
        >
            <template v-if="attribute.options.multiValueSelect === 'false'">
                <PopOverGroup>
                    <GroupPill :name="attribute.value"></GroupPill>
                </PopOverGroup>
            </template>
            <template v-for="name in attribute.value" v-else :key="name">
                <PopOverGroup>
                    <GroupPill :name="name"></GroupPill>
                </PopOverGroup>
            </template>
        </div>

        <span v-else class="font-bold text-gray-700">
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
    import { defineComponent, ref, toRefs, watch, PropType, inject } from 'vue'

    import useCustomMetadataHelpers from '~/composables/custommetadata/useCustomMetadataHelpers'
    import UserPill from '@/common/pills/user.vue'
    import GroupPill from '@/common/pills/group.vue'
    import PopOverUser from '@/common/popover/user/user.vue'
    import PopOverGroup from '@/common/popover/user/groups.vue'

    export default defineComponent({
        name: 'CustomMetadataReadOnly',
        components: { UserPill, GroupPill, PopOverUser, PopOverGroup },
        props: {
            attribute: {
                type: Object,
                required: true,
            },
        },
        setup() {
            const { getDatatypeOfAttribute, formatDisplayValue } =
                useCustomMetadataHelpers()

            return {
                getDatatypeOfAttribute,
                formatDisplayValue,
            }
        },
    })
</script>
