<template>
    <chips :data="data">
        <template #header
            ><span
                >Say 👋 Hello, to the new
                <b>{{ data.value.length > 1 ? 'Owners' : 'Owner' }}</b></span
            ></template
        >
        <template #chip-content="user">
            <Pill
                :label="user.item"
                @click.stop="() => handleClickUser(user.item)"
                ><template #prefix>
                    <avatar
                        v-if="user.item"
                        class="-ml-2.5"
                        :image-url="
                            KeyMaps.auth.avatar.GET_AVATAR({
                                username: user.item,
                            })
                        "
                        :allow-upload="false"
                        :avatar-name="user.item"
                        avatar-size="small"
                        :avatar-shape="'circle'"
                    /> </template></Pill
        ></template>
    </chips>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import { activityInterface } from '~/types/activitylogs/activitylog.interface'
    import { useUserPreview } from '~/composables/user/showUserPreview'
    import Chips from '../chips/index.vue'
    import Pill from '~/components/UI/pill/pill.vue'
    import { KeyMaps } from '~/api/keyMap'

    import Avatar from '~/components/common/avatar.vue'

    export default defineComponent({
        components: { Chips, Pill, Avatar },
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

            return { handleClickUser, KeyMaps }
        },
    })
</script>

<style lang="less" scoped>
    .max-owner-name-width {
        max-width: 10rem;
    }
</style>
