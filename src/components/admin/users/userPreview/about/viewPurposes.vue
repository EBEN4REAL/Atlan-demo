<template>
    <span class="text-sm text-gray-500">Purposes</span>
    <div v-if="purposes.length > 0" class="flex flex-wrap mt-1">
        <Tags
            :allow-update="false"
            :tags="purposes"
            icon="Group"
            custom-classes="flex content-center items-center bg-white border border-gray-300 py-0.5 px-2 font-normal text-center text-sm rounded-3xl"
        >
            <template #label="{ tag }">
                {{ tag }}
            </template>
        </Tags>
    </div>
    <div v-else class="mt-1">
        <span v-if="type === 'user'"
            >{{
                isCurrentUser ? `You don't` : `${entity.firstName} doesn't`
            }}
            have any linked purposes.</span
        >
        <span v-if="type === 'group'"
            >{{ `${entity.name} doesn't` }} have any linked purposes.</span
        >
    </div>
</template>

<script lang="ts">
    import { toRefs, defineComponent, ref } from 'vue'
    import Tags from '~/components/common/badge/tags/index.vue'

    export default defineComponent({
        name: 'ViewPurposes',
        components: {
            Tags,
        },
        props: {
            entity: {
                type: Object,
                default: () => {},
                required: true,
            },
            isCurrentUser: {
                type: Boolean,
                default: false,
            },
        },
        setup(props) {
            const { entity } = toRefs(props)
            const type = ref('')
            if (entity.value.username) type.value = 'user'
            else if (entity.value.alias) type.value = 'group'
            const { purposes } = entity.value
            const purposeList = (purposes || []).map(
                (purpose) => purpose?.displayName || purpose?.name || ''
            )
            return {
                purposes: purposeList,
                type,
            }
        },
    })
</script>

<style scoped></style>
