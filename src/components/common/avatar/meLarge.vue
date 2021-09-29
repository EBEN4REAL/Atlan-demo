<template>
    <a-dropdown>
        <div class="flex items-center justify-between">
            <div class="flex items-center">
                <avatar
                    :image-url="
                        KeyMaps.auth.avatar.GET_AVATAR({
                            username: username,
                        })
                    "
                    :allow-upload="false"
                    :avatar-name="username"
                    avatar-size="large"
                    :avatar-shape="'circle'"
                />

                <div class="flex flex-col ml-2">
                    <div class="text-base text-gray-700">{{ name }}</div>
                    <div class="text-sm text-gray-500">{{ username }}</div>
                </div>
            </div>
            <AtlanIcon class="h-3 ml-2" icon="ChevronDown" />
        </div>
        <!-- <div
            class="flex items-center px-2 py-1 transition-colors duration-300 border border-transparent rounded-full hover:border-gray-300"
        >
           
        </div> -->
        <!-- <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
              Hover me <a-icon type="down" />
    </a>-->
        <template #overlay>
            <a-menu>
                <a-menu-item>
                    <a @click="() => handleClickUser(username)">View Profile</a>
                </a-menu-item>
                <a-menu-item>
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
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item>
                    <a href="javascript:;" @click="handleLogout">Logout</a>
                </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
</template>

<script lang="ts">
    import { defineComponent, inject } from 'vue'
    import { useUserPreview } from '~/composables/user/showUserPreview'
    import whoami from '~/composables/user/whoami'
    import { KeyMaps } from '~/api/keyMap'
    import Avatar from '~/components/common/avatar.vue'

    export default defineComponent({
        name: 'UserPersonalAvatar',
        components: {
            Avatar,
        },
        props: {},
        setup() {
            const keycloak = inject('$keycloak')
            const handleLogout = () => {
                console.log(
                    keycloak.logout({
                        redirectUri: window.location.origin,
                    })
                )
            }
            const { username, name } = whoami()
            // user preview drawer
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
                KeyMaps,
            }
        },
        data() {
            return {}
        },
    })
</script>

<style lang="less" module></style>
