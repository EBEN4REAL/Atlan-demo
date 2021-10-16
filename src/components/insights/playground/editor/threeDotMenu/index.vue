<template>
    <div>
        <a-dropdown :trigger="['click']">
            <div
                @click.prevent="toggleButtonState"
                class="
                    flex
                    cursor-pointer
                    h-6
                    items-center
                    justify-center
                    py-0.5
                    ml-2
                    -mr-2
                    px-1
                    border-white
                    text-gray-500
                "
            >
                <AtlanIcon class="" icon="KebabMenu" />
            </div>
            <template #overlay>
                <!-- w-64 -->
                <a-menu style="width: 200px" :class="$style.menu_class">
                    <a-sub-menu key="themes" class="">
                        <template #title>
                            <div
                                class="flex items-center justify-between w-full mr-2 "
                            >
                                <div
                                    class="flex items-center justify-between w-full "
                                >
                                    <span>Themes</span>
                                    <span>{{
                                        themeAlias[editorConfig.theme]
                                    }}</span>
                                </div>
                                <AtlanIcon icon="ChevronRight" class="ml-2" />
                            </div>
                        </template>
                        <template #expandIcon />
                        <div class="w-28">
                            <a-menu-item
                                key="vs"
                                class="text-sm"
                                :class="
                                    isThisThemeActive(editorConfig, 'vs')
                                        ? 'bg-primary-light'
                                        : ''
                                "
                                @click="() => themeChange('vs')"
                                ><div class="flex items-center justify-between">
                                    <span> Light </span>
                                    <AtlanIcon
                                        icon="Check"
                                        class="text-primary"
                                        v-if="
                                            isThisThemeActive(
                                                editorConfig,
                                                'vs'
                                            )
                                        "
                                    /></div
                            ></a-menu-item>
                            <a-menu-item
                                class="text-sm"
                                key="vs-dark"
                                :class="
                                    editorConfig.theme === 'vs-dark'
                                        ? 'bg-primary-light'
                                        : ''
                                "
                                @click="() => themeChange('vs-dark')"
                                ><div class="flex items-center justify-between">
                                    <span> Dark </span>
                                    <AtlanIcon
                                        icon="Check"
                                        class="text-primary"
                                        v-if="
                                            isThisThemeActive(
                                                editorConfig,
                                                'vs-dark'
                                            )
                                        "
                                    /></div
                            ></a-menu-item>
                        </div>
                    </a-sub-menu>
                    <!-- Tab Spacing -->
                    <a-sub-menu key="Tab Spacing" class="">
                        <template #title>
                            <div
                                class="flex items-center justify-between w-full mr-2 "
                            >
                                <div
                                    class="flex items-center justify-between w-full "
                                >
                                    <span>Tab Spacing</span>
                                    <span>{{ editorConfig.tabSpace }}</span>
                                </div>
                                <AtlanIcon icon="ChevronRight" class="ml-2" />
                            </div>
                        </template>
                        <template #expandIcon />
                        <div class="w-28">
                            <a-menu-item
                                key="2"
                                class="text-sm"
                                :class="
                                    isThisTabActive(editorConfig, 2)
                                        ? 'bg-primary-light'
                                        : ''
                                "
                                @click="() => tabChange(2)"
                                ><div class="flex items-center justify-between">
                                    <span> 2 </span>
                                    <AtlanIcon
                                        icon="Check"
                                        class="text-primary"
                                        v-if="isThisTabActive(editorConfig, 2)"
                                    /></div
                            ></a-menu-item>
                            <a-menu-item
                                class="text-sm"
                                key="4"
                                :class="
                                    isThisTabActive(editorConfig, 3)
                                        ? 'bg-primary-light'
                                        : ''
                                "
                                @click="() => tabChange(3)"
                                ><div class="flex items-center justify-between">
                                    <span> 3 </span>
                                    <AtlanIcon
                                        icon="Check"
                                        class="text-primary"
                                        v-if="isThisTabActive(editorConfig, 3)"
                                    /></div
                            ></a-menu-item>
                            <a-menu-item
                                class="text-sm"
                                key="6"
                                :class="
                                    isThisTabActive(editorConfig, 4)
                                        ? 'bg-primary-light'
                                        : ''
                                "
                                @click="() => tabChange(4)"
                                ><div class="flex items-center justify-between">
                                    <span> 4 </span>
                                    <AtlanIcon
                                        icon="Check"
                                        class="text-primary"
                                        v-if="isThisTabActive(editorConfig, 4)"
                                    /></div
                            ></a-menu-item>
                        </div>
                    </a-sub-menu>
                    <!-- ------------------------------- -->
                    <!-- Font size -->
                    <a-sub-menu key="fontsize" class="">
                        <template #title>
                            <div
                                class="flex items-center justify-between w-full mr-2 "
                            >
                                <div
                                    class="flex items-center justify-between w-full "
                                >
                                    <span>Font size</span>
                                    <span>{{ editorConfig.fontSize }}</span>
                                </div>
                                <AtlanIcon icon="ChevronRight" class="ml-2" />
                            </div>
                        </template>
                        <template #expandIcon />
                        <div class="w-28">
                            <a-menu-item
                                key="12"
                                class="text-sm"
                                :class="
                                    isThisFontSizeActive(editorConfig, 12)
                                        ? 'bg-primary-light'
                                        : ''
                                "
                                @click="() => fontSizeChange(12)"
                                ><div class="flex items-center justify-between">
                                    <span> 12 </span>
                                    <AtlanIcon
                                        icon="Check"
                                        class="text-primary"
                                        v-if="
                                            isThisFontSizeActive(
                                                editorConfig,
                                                12
                                            )
                                        "
                                    /></div
                            ></a-menu-item>
                            <a-menu-item
                                class="text-sm"
                                key="14"
                                :class="
                                    isThisFontSizeActive(editorConfig, 14)
                                        ? 'bg-primary-light'
                                        : ''
                                "
                                @click="() => fontSizeChange(14)"
                                ><div class="flex items-center justify-between">
                                    <span> 14 </span>
                                    <AtlanIcon
                                        icon="Check"
                                        class="text-primary"
                                        v-if="
                                            isThisFontSizeActive(
                                                editorConfig,
                                                14
                                            )
                                        "
                                    /></div
                            ></a-menu-item>
                            <a-menu-item
                                class="text-sm"
                                key="16"
                                :class="
                                    isThisFontSizeActive(editorConfig, 16)
                                        ? 'bg-primary-light'
                                        : ''
                                "
                                @click="() => fontSizeChange(16)"
                                ><div class="flex items-center justify-between">
                                    <span> 16 </span>
                                    <AtlanIcon
                                        icon="Check"
                                        class="text-primary"
                                        v-if="
                                            isThisFontSizeActive(
                                                editorConfig,
                                                16
                                            )
                                        "
                                    /></div
                            ></a-menu-item>
                        </div>
                    </a-sub-menu>
                    <!-- ------------------------------- -->
                    <!-- <a-sub-menu key="test" title="Font family">
                        <a-menu-item>Fira code</a-menu-item>
                        <a-menu-item>Sans serif</a-menu-item>
                    </a-sub-menu> -->
                    <hr />
                    <a-menu-item>Duplicate query</a-menu-item>
                    <a-menu-item>Edit saved query</a-menu-item>
                    <a-menu-item>Delete</a-menu-item>
                    <hr />
                    <a-menu-item>keyboard shortcuts</a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs, inject, Ref, toRaw } from 'vue'
    import { editorConfigInterface } from '~/types/insights/editoConfig.interface'
    import { useEditor } from '~/components/insights/common/composables/useEditor'

    export default defineComponent({
        components: {},
        props: {},
        setup(props) {
            const { setEditorTheme, setTabSpaces, setFontSizes } = useEditor()
            const themeAlias = {
                vs: 'Light',
                'vs-dark': 'Dark',
            }
            const isThisThemeActive = (editorConfig, theme: string) => {
                return editorConfig.theme === theme
            }
            const isThisTabActive = (editorConfig: any, tabSpace: number) => {
                return editorConfig.tabSpace === tabSpace
            }
            const isThisFontSizeActive = (
                editorConfig: any,
                fontSize: number
            ) => {
                return editorConfig.fontSize === fontSize
            }
            const editorConfig = inject(
                'editorConfig'
            ) as Ref<editorConfigInterface>
            const selectedKeys = ref([editorConfig.value.theme])
            const monacoInstance = inject('monacoInstance') as Ref<any>
            const editorInstance = inject('editorInstance') as Ref<any>
            const isActive = ref(false)
            const toggleButtonState = () => {
                isActive.value = !isActive.value
            }
            const themeChange = (theme: string) => {
                setEditorTheme(toRaw(monacoInstance.value), editorConfig, theme)
            }
            const tabChange = (tabSpace: number) => {
                setTabSpaces(
                    toRaw(editorInstance.value),
                    editorConfig,
                    tabSpace
                )
            }
            const fontSizeChange = (fontSize: number) => {
                setFontSizes(
                    toRaw(editorInstance.value),
                    editorConfig,
                    fontSize
                )
            }

            return {
                fontSizeChange,
                isThisFontSizeActive,
                isThisTabActive,
                tabChange,
                isThisThemeActive,
                themeAlias,
                selectedKeys,
                themeChange,
                editorConfig,
                toggleButtonState,
                isActive,
            }
        },
    })
</script>
<style lang="less" module>
    .menu_class {
        :global(.ant-dropdown-menu-submenu-title) {
            @apply pr-4 !important;
        }
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
