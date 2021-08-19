<template>
    <chips :data="data">
        <template #header
            ><span
                >Say 👋 Hello, to the newly added
                <b>{{ data.value.length > 1 ? 'Owners' : 'Owner' }}</b></span
            ></template
        >
        <template #chip-content="user">
            <div
                class="
                    flex
                    items-center
                    px-3
                    py-1.5
                    mb-3
                    mr-3
                    font-bold
                    rounded-full
                    bg-gray-light
                    text-gray-700
                    group
                    hover:bg-primary hover:text-white
                    cursor-pointer
                "
                @click.stop="() => handleClickUser(user.item)"
            >
                <img
                    src="https://picsum.photos/id/237/50/50"
                    alt="view"
                    class="w-4 h-4 mr-2 rounded-full"
                />
                <div
                    class="mb-0 text-sm font-bold capitalize truncate  max-owner-name-width"
                >
                    {{ user.item }}
                </div>
            </div></template
        >
    </chips>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import { activityInterface } from '~/types/activitylogs/activitylog.interface'
    import { useUserPreview } from '~/composables/user/showUserPreview'
    import Chips from '../chips/index.vue'

    export default defineComponent({
        components: { Chips },
        props: {
            data: {
                type: Object as PropType<activityInterface>,
                default() {
                    return { displayValue: '', value: [] }
                },
            },
        },
        setup() {
            const { showUserPreview, setUserUniqueAttribute } = useUserPreview()
            const handleClickUser = (username: string) => {
                setUserUniqueAttribute(username, 'username')
                showUserPreview({ allowed: ['about'] })
            }

            return { handleClickUser }
        },
    })
</script>

<style lang="less" scoped>
    .max-owner-name-width {
        max-width: 10rem;
    }
</style>
