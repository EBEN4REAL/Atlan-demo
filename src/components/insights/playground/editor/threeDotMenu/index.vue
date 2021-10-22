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
                                    class="flex items-center justify-between w-full text-gray-500 "
                                >
                                    <span class="text-gray-700">Themes</span>
                                    <span>{{
                                        themeAlias[editorConfig.theme]
                                    }}</span>
                                </div>
                                <AtlanIcon
                                    icon="ChevronRight"
                                    class="ml-2 text-gray-500"
                                />
                            </div>
                        </template>
                        <template #expandIcon />
                        <div class="text-gray-700 w-28">
                            <a-menu-item
                                key="vs"
                                class="text-sm"
                                :class="
                                    isThisThemeActive(editorConfig, 'vs')
                                        ? 'bg-primary-light'
                                        : ''
                                "
                                @click="() => themeChange('vs')"
                                @mouseover="() => themeHoverChange('vs')"
                                @mouseleave="() => themeHoverChange(editorConfig.theme)"
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
                                @mouseover="() => themeHoverChange('vs-dark')"
                                @mouseleave="() => themeChange(editorConfig.theme)"
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
                                    class="flex items-center justify-between w-full text-gray-500 "
                                >
                                    <span class="text-gray-700"
                                        >Tab Spacing</span
                                    >
                                    <span>{{ editorConfig.tabSpace }}</span>
                                </div>
                                <AtlanIcon
                                    icon="ChevronRight"
                                    class="ml-2 text-gray-500"
                                />
                            </div>
                        </template>
                        <template #expandIcon />
                        <div class="text-gray-700 w-28">
                            <a-menu-item
                                key="2"
                                class="text-sm"
                                :class="
                                    isThisTabActive(editorConfig, 2)
                                        ? 'bg-primary-light'
                                        : ''
                                "
                                @click="() => tabChange(2)"
                                @mouseover="() => tabHoverChange(2)"
                                @mouseleave="() => tabHoverChange(editorConfig.tabSpace)"
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
                                @mouseover="() => tabHoverChange(3)"
                                @mouseleave="() => tabHoverChange(editorConfig.tabSpace)"
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
                                @mouseover="() => tabHoverChange(4)"
                                @mouseleave="() => tabHoverChange(editorConfig.tabSpace)"
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
                    <a-sub-menu key="fontsize" class="text-gray-500">
                        <template #title>
                            <div
                                class="flex items-center justify-between w-full mr-2 text-gray-500 "
                            >
                                <div
                                    class="flex items-center justify-between w-full "
                                >
                                    <span class="text-gray-700">Font size</span>
                                    <span>{{ editorConfig.fontSize }}</span>
                                </div>
                                <AtlanIcon
                                    icon="ChevronRight"
                                    class="ml-2 text-gray-500"
                                />
                            </div>
                        </template>
                        <template #expandIcon />
                        <div class="text-gray-700 w-28">
                            <a-menu-item
                                key="12"
                                class="text-sm"
                                :class="
                                    isThisFontSizeActive(editorConfig, 12)
                                        ? 'bg-primary-light'
                                        : ''
                                "
                                @click="() => fontSizeChange(12)"
                                @mouseover="() => fontSizeHoverChange(12)"
                                @mouseleave="() => fontSizeHoverChange(editorConfig.fontSize)"
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

                                @mouseover="() => fontSizeHoverChange(14)"
                                @mouseleave="() => fontSizeHoverChange(editorConfig.fontSize)"
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

                                @mouseover="() => fontSizeHoverChange(16)"
                                @mouseleave="() => fontSizeHoverChange(editorConfig.fontSize)"
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
                    <!-- Show these options when query is saved -->
                    <div v-if="activeInlineTab?.queryId" class="text-gray-700">
                        <a-menu-item @click="duplicateQuery"
                            >Duplicate query</a-menu-item
                        >
                        <a-menu-item>Edit saved query</a-menu-item>
                        <a-menu-item class="text-red-600"
                            >Delete query</a-menu-item
                        >
                        <hr />
                    </div>
                    <a-menu-item>keyboard shortcuts</a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        toRefs,
        ComputedRef,
        inject,
        Ref,
        toRaw,
    } from 'vue'
    import { editorConfigInterface } from '~/types/insights/editoConfig.interface'
    import { useEditor } from '~/components/insights/common/composables/useEditor'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
    import { useLocalStorageSync } from '~/components/insights/common/composables/useLocalStorageSync'
    import { useRouter } from 'vue-router'

    export default defineComponent({
        components: {},
        props: {},
        setup(props) {
            const router = useRouter()
            const { setEditorTheme, setTabSpaces, setFontSizes } = useEditor()
            const { syncInlineTabsInLocalStorage } = useLocalStorageSync()
            const { inlineTabAdd } = useInlineTab()

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

            const editorHoverConfig = inject(
                'editorHoverConfig'
            ) as Ref<editorConfigInterface>
            

            const selectedKeys = ref([editorConfig.value.theme])
            const monacoInstance = inject('monacoInstance') as Ref<any>
            const editorInstance = inject('editorInstance') as Ref<any>
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as Ref<string>
            const tabsArray = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >

            const isActive = ref(false)
            const toggleButtonState = () => {
                isActive.value = !isActive.value
            }
            const themeChange = (theme: string) => {
                setEditorTheme(toRaw(monacoInstance.value), editorConfig, theme)
            }
            console.log("editor data: ", editorConfig.value)

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

            const themeHoverChange = (theme: string) => {
                setEditorTheme(toRaw(monacoInstance.value), editorHoverConfig, theme)
            }

            const tabHoverChange = (tabSpace: number) => {
                setTabSpaces(
                    toRaw(editorInstance.value),
                    editorHoverConfig,
                    tabSpace
                )
            }
            const fontSizeHoverChange = (fontSize: number) => {
                setFontSizes(
                    toRaw(editorInstance.value),
                    editorHoverConfig,
                    fontSize
                )
            }


            const duplicateQuery = () => {
                const activeInlineTabCopy: activeInlineTabInterface =
                    Object.assign({}, activeInlineTab.value)
                const label = `Copy ${activeInlineTabCopy.label}`
                activeInlineTabCopy.label = label
                /* IMP TO RESET */
                activeInlineTabCopy.key = String(new Date().getTime())
                activeInlineTabCopy.isSaved = false
                activeInlineTabCopy.queryId = undefined

                /* CAREFUL:-------Order is important here------ */
                inlineTabAdd(activeInlineTabCopy, tabsArray, activeInlineTabKey)
                activeInlineTabKey.value = activeInlineTabCopy.key
                /* ----------------------------- */
                // syncying inline tabarray in localstorage
                syncInlineTabsInLocalStorage(tabsArray.value)
                router.push(`/insights`)
            }

            return {
                activeInlineTab,
                duplicateQuery,
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
                themeHoverChange,
                fontSizeHoverChange,
                tabHoverChange
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
