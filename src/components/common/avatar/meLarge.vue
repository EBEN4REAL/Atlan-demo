<template>
    <a-dropdown trigger="click">
        <div v-if="$slots?.dropdownIcon" class="footer">
            <slot name="dropdownIcon" />
        </div>

        <div v-else class="flex items-center justify-between w-full">
            <div class="flex">
                <avatar
                    :image-url="avatar"
                    :allow-upload="false"
                    :avatar-name="username"
                    avatar-size="large"
                    :avatar-shape="'circle'"
                />
                <div class="flex flex-col ml-2">
                    <div class="text-sm text-gray-700 capitalize">
                        {{ name }}
                    </div>
                    <div class="text-sm text-gray-500">@{{ username }}</div>
                </div>
            </div>
            <div><AtlanIcon class="h-3 ml-1" icon="ChevronDown" /></div>
        </div>
        <!-- <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
              Hover me <a-icon type="down" />
    </a>-->
        <template #overlay>
            <a-menu>
                <a-menu-item>
                    <a
                        class="font-bold text-red-500"
                        @click.stop="handleLogout"
                    >
                        Logout</a
                    >
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item>
                    <a
                        @click="() => handleClickUser(username)"
                        class="flex items-center"
                        ><AtlanIcon icon="User" class="mr-1"></AtlanIcon>View
                        Profile</a
                    >
                </a-menu-item>
                <!--       <a-menu-item>
                    <a href="javascript:;">Admin Centre</a>
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item>
                    <a href="javascript:;">Help & Support</a>
                </a-menu-item>
                <a-menu-item>
                    <a href="javascript:;">Releases</a>
                </a-menu-item>
                <a-menu-item>
                    <a href="javascript:;">Keyboard Shortcuts</a>
                </a-menu-item> -->
            </a-menu>
        </template>
    </a-dropdown>
</template>

<script lang="ts">
    import { defineComponent, inject } from 'vue'
    // import { useUserPreview } from '~/composables/user/showUserPreview'
    // import whoami from '~/composables/user/whoami'
    import useUserData from '~/composables/user/useUserData'
    import Avatar from '~/components/common/avatar/index.vue'
    import { useUserPreview } from '~/composables/user/showUserPreview'

    export default defineComponent({
        name: 'UserPersonalAvatar',
        components: {
            Avatar,
        },
        props: {},
        setup() {
            const keycloak = inject('$keycloak')
            const handleLogout = () => {
                console.log('sadasd')
                keycloak.logout({
                    redirectUri: window.location.origin,
                })
            }

            const { name, username, avatar } = useUserData()
            // user preview drawer
            // // const { showUserPreview, setUserUniqueAttribute } = useUserPreview()
            // const handleClickUser = (username: string) => {
            //     // setUserUniqueAttribute(username, 'username')
            //     // showUserPreview()
            // }

            const { showUserPreview, setUserUniqueAttribute } = useUserPreview()
            const handleClickUser = (username: string) => {
                setUserUniqueAttribute(username, 'username')
                showUserPreview()
            }

            return {
                handleLogout,
                handleClickUser,
                username,
                name,
                avatar,
            }
        },
        data() {
            return {}
        },
    })
</script>

<style lang="less" module></style>
