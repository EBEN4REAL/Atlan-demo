<template>
    <a-dropdown>
        <div v-if="$slots?.dropdownIcon" class="footer">
            <slot name="dropdownIcon" />
        </div>

        <div v-else class="flex items-center justify-between w-full">
            <div class="flex">
                <avatar
                    :image-url="avatarUrl"
                    :allow-upload="false"
                    :avatar-name="username"
                    avatar-size="small"
                    :avatar-shape="'circle'"
                />

                <div class="self-center ml-1 text-sm text-gray-700 capitalize">
                    {{ name }}
                </div>
            </div>
            <div><AtlanIcon class="flex h-3 ml-1" icon="ChevronDown" /></div>
        </div>
        <!-- <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
              Hover me <a-icon type="down" />
    </a>-->
        <template #overlay>
            <a-menu class="mt-1">
                <a-menu-item>
                    <a @click="() => handleClickUser(username)">
                        <div class="flex items-center">
                            <AtlanIcon icon="User" class="mr-2" />
                            <span>Profile</span>
                        </div></a
                    >
                </a-menu-item>
                <!--   <a-menu-item>
                    <a @click="toggleHelpWidget">
                        <div class="flex items-center">
                            <AtlanIcon icon="Support" class="mr-2" />
                            <span>Support</span>
                        </div>
                    </a>
                </a-menu-item> -->
                <!-- <a-menu-item>
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
                <a-menu-divider />
                <a-menu-item>
                    <a class="text-red-500" @click.stop="handleLogout"
                        ><div class="flex items-center">
                            <AtlanIcon icon="Logout" class="mr-2" />
                            <span>Logout</span>
                        </div>
                    </a>
                </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
</template>

<script lang="ts">
    import { defineComponent, inject } from 'vue'
    import { useUserPreview } from '~/composables/user/showUserPreview'
    // import whoami from '~/composables/user/whoami'
    import useUserData from '~/composables/user/useUserData'
    import Avatar from '~/components/common/avatar/index.vue'
    import useHelpWidget from '~/composables/helpCenter/useHelpWidget'

    export default defineComponent({
        name: 'UserPersonalAvatar',
        components: {
            Avatar,
        },
        props: {},
        setup() {
            const keycloak = inject('$keycloak')
            const { toggleHelpWidget } = useHelpWidget()
            const handleLogout = () => {
                window.localStorage.clear()
                keycloak.logout({
                    redirectUri: window.location.origin,
                })
            }

            const { name, username, avatar: avatarUrl } = useUserData()
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
                avatarUrl,
                toggleHelpWidget,
            }
        },
        data() {
            return {}
        },
    })
</script>

<style lang="less" module></style>
