<template>
    <a-dropdown>
        <div
            class="flex items-center px-2 py-1 transition-colors duration-300 border border-transparent rounded-full  hover:border-gray-300"
        >
            <a-avatar
                :size="24"
                class="mr-2"
                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            />
            <span class="text-base text-gray">
                {{ username }}
            </span>
            <AtlanIcon class="h-3 ml-2" icon="ChevronDown" />
        </div>
        <!-- <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
              Hover me <a-icon type="down" />
    </a>-->
        <template #overlay>
            <a-menu>
                <a-menu-item>
                    <div class="flex items-center">
                        <a-avatar
                            :size="42"
                            class="border-2 border-gray-300"
                            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                        />

                        <div class="flex flex-col ml-2">
                            <p class="mb-0 text-base">{{ name }}</p>
                            <p class="mb-0 text-sm text-gray-500">
                                {{ username }}
                            </p>
                        </div>
                    </div>
                </a-menu-item>
                <a-menu-divider />
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

    export default defineComponent({
        name: 'UserPersonalAvatar',
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
            }
        },
        data() {
            return {}
        },
    })
</script>

<style lang="less" module></style>
