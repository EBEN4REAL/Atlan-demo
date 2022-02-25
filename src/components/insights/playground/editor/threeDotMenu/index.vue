<template>
    <div v-if="(showVQB && activeInlineTab?.queryId) || !showVQB">
        <a-dropdown :trigger="['click']" placement="bottomRight">
            <div
                @click.prevent="toggleButtonState"
                class="flex items-center justify-center h-6 p-1 text-gray-500 border-white rounded cursor-pointer hover:bg-gray-light"
            >
                <AtlanIcon class icon="KebabMenuHorizontal" />
            </div>
            <template #overlay>
                <a-menu
                    style="
                        min-width: 264px;
                        margin-right: 10px !important;
                        margin-top: 2px !important;
                    "
                    :class="$style.menu_class"
                    class="py-2"
                >
                    <a-sub-menu key="themes" v-if="!showVQB">
                        <template #title>
                            <div
                                class="flex items-center justify-between w-full mr-2"
                            >
                                <div
                                    class="flex items-center justify-between w-full text-gray-500"
                                >
                                    <span class="text-gray-700">Themes</span>
                                    <span>
                                        {{
                                            getThemeLabelFromName(
                                                editorConfig.theme
                                            )
                                        }}
                                    </span>
                                </div>
                                <AtlanIcon
                                    icon="ChevronRight"
                                    class="ml-1 text-gray-500 -mt-0.5"
                                />
                            </div>
                        </template>
                        <template #expandIcon />
                        <div class="text-gray-700" style="min-width: 200px">
                            <template
                                v-for="themeObj in themes"
                                :key="themeObj.name"
                            >
                                <a-menu-item
                                    class="px-4 py-2 text-sm"
                                    :class="
                                        isThisThemeActive(
                                            editorConfig,
                                            themeObj.name
                                        )
                                            ? 'bg-primary-light'
                                            : ''
                                    "
                                    @click="() => themeChange(themeObj.name)"
                                    @mouseover="
                                        () => themeHoverChange(themeObj.name)
                                    "
                                    @mouseleave="
                                        () =>
                                            themeHoverChange(editorConfig.theme)
                                    "
                                >
                                    <div
                                        class="flex items-center justify-between"
                                    >
                                        <span>{{ themeObj.label }}</span>
                                        <AtlanIcon
                                            icon="Check"
                                            class="text-primary"
                                            v-if="
                                                isThisThemeActive(
                                                    editorConfig,
                                                    themeObj.name
                                                )
                                            "
                                        />
                                    </div>
                                </a-menu-item>
                            </template>
                        </div>
                    </a-sub-menu>
                    <!-- Tab Spacing -->
                    <a-sub-menu
                        key="Tab Spacing"
                        style="min-width: 200px"
                        v-if="!showVQB"
                    >
                        <template #title>
                            <div
                                class="flex items-center justify-between w-full mr-2"
                            >
                                <div
                                    class="flex items-center justify-between w-full text-gray-500"
                                >
                                    <span class="text-gray-700"
                                        >Tab Spacing</span
                                    >
                                    <span>{{ editorConfig.tabSpace }}</span>
                                </div>
                                <AtlanIcon
                                    icon="ChevronRight"
                                    class="ml-1 text-gray-500 -mt-0.5"
                                />
                            </div>
                        </template>
                        <template #expandIcon />
                        <div class="text-gray-700" style="min-width: 200px">
                            <a-menu-item
                                key="2"
                                class="px-4 py-2 text-sm"
                                :class="
                                    isThisTabActive(editorConfig, 2)
                                        ? 'bg-primary-light'
                                        : ''
                                "
                                @click="() => tabChange(2)"
                                @mouseover="() => tabHoverChange(2)"
                                @mouseleave="
                                    () => tabHoverChange(editorConfig.tabSpace)
                                "
                            >
                                <div class="flex items-center justify-between">
                                    <span>2</span>
                                    <AtlanIcon
                                        icon="Check"
                                        class="text-primary"
                                        v-if="isThisTabActive(editorConfig, 2)"
                                    />
                                </div>
                            </a-menu-item>
                            <a-menu-item
                                class="px-4 py-2 text-sm"
                                key="4"
                                :class="
                                    isThisTabActive(editorConfig, 3)
                                        ? 'bg-primary-light'
                                        : ''
                                "
                                @click="() => tabChange(3)"
                                @mouseover="() => tabHoverChange(3)"
                                @mouseleave="
                                    () => tabHoverChange(editorConfig.tabSpace)
                                "
                            >
                                <div class="flex items-center justify-between">
                                    <span>3</span>
                                    <AtlanIcon
                                        icon="Check"
                                        class="text-primary"
                                        v-if="isThisTabActive(editorConfig, 3)"
                                    />
                                </div>
                            </a-menu-item>
                            <a-menu-item
                                class="px-4 py-2 text-sm"
                                key="6"
                                :class="
                                    isThisTabActive(editorConfig, 4)
                                        ? 'bg-primary-light'
                                        : ''
                                "
                                @click="() => tabChange(4)"
                                @mouseover="() => tabHoverChange(4)"
                                @mouseleave="
                                    () => tabHoverChange(editorConfig.tabSpace)
                                "
                            >
                                <div class="flex items-center justify-between">
                                    <span>4</span>
                                    <AtlanIcon
                                        icon="Check"
                                        class="text-primary"
                                        v-if="isThisTabActive(editorConfig, 4)"
                                    />
                                </div>
                            </a-menu-item>
                        </div>
                    </a-sub-menu>
                    <!-- ------------------------------- -->
                    <!-- Font size -->
                    <a-sub-menu
                        key="fontsize"
                        class="text-gray-500"
                        v-if="!showVQB"
                    >
                        <template #title>
                            <div
                                class="flex items-center justify-between w-full mr-2 text-gray-500"
                            >
                                <div
                                    class="flex items-center justify-between w-full"
                                >
                                    <span class="text-gray-700">Font size</span>
                                    <span>{{ editorConfig.fontSize }}</span>
                                </div>
                                <AtlanIcon
                                    icon="ChevronRight"
                                    class="ml-1 text-gray-500 -mt-0.5"
                                />
                            </div>
                        </template>
                        <template #expandIcon />
                        <div class="text-gray-700" style="min-width: 200px">
                            <a-menu-item
                                key="12"
                                class="px-4 py-2 text-sm"
                                :class="
                                    isThisFontSizeActive(editorConfig, 12)
                                        ? 'bg-primary-light'
                                        : ''
                                "
                                @click="() => fontSizeChange(12)"
                                @mouseover="() => fontSizeHoverChange(12)"
                                @mouseleave="
                                    () =>
                                        fontSizeHoverChange(
                                            editorConfig.fontSize
                                        )
                                "
                            >
                                <div class="flex items-center justify-between">
                                    <span>12</span>
                                    <AtlanIcon
                                        icon="Check"
                                        class="text-primary"
                                        v-if="
                                            isThisFontSizeActive(
                                                editorConfig,
                                                12
                                            )
                                        "
                                    />
                                </div>
                            </a-menu-item>
                            <a-menu-item
                                class="px-4 py-2 text-sm"
                                key="14"
                                :class="
                                    isThisFontSizeActive(editorConfig, 14)
                                        ? 'bg-primary-light'
                                        : ''
                                "
                                @click="() => fontSizeChange(14)"
                                @mouseover="() => fontSizeHoverChange(14)"
                                @mouseleave="
                                    () =>
                                        fontSizeHoverChange(
                                            editorConfig.fontSize
                                        )
                                "
                            >
                                <div class="flex items-center justify-between">
                                    <span>14</span>
                                    <AtlanIcon
                                        icon="Check"
                                        class="text-primary"
                                        v-if="
                                            isThisFontSizeActive(
                                                editorConfig,
                                                14
                                            )
                                        "
                                    />
                                </div>
                            </a-menu-item>
                            <a-menu-item
                                class="px-4 py-2 text-sm"
                                key="16"
                                :class="
                                    isThisFontSizeActive(editorConfig, 16)
                                        ? 'bg-primary-light'
                                        : ''
                                "
                                @click="() => fontSizeChange(16)"
                                @mouseover="() => fontSizeHoverChange(16)"
                                @mouseleave="
                                    () =>
                                        fontSizeHoverChange(
                                            editorConfig.fontSize
                                        )
                                "
                            >
                                <div class="flex items-center justify-between">
                                    <span>16</span>
                                    <AtlanIcon
                                        icon="Check"
                                        class="text-primary"
                                        v-if="
                                            isThisFontSizeActive(
                                                editorConfig,
                                                16
                                            )
                                        "
                                    />
                                </div>
                            </a-menu-item>
                        </div>
                    </a-sub-menu>
                    <!-- ------------------------------- -->

                    <!-- Cursor style -->
                    <a-sub-menu
                        key="cursorStyle"
                        class="text-gray-500"
                        v-if="!showVQB"
                    >
                        <template #title>
                            <div
                                class="flex items-center justify-between w-full mr-2 text-gray-500"
                            >
                                <div
                                    class="flex items-center justify-between w-full"
                                >
                                    <span class="text-gray-700">Cursor</span>
                                    <span>{{
                                        capitalizeFirstLetter(
                                            editorConfig.cursorStyle
                                        )
                                    }}</span>
                                </div>
                                <AtlanIcon
                                    icon="ChevronRight"
                                    class="ml-1 text-gray-500"
                                />
                            </div>
                        </template>
                        <template #expandIcon />
                        <div class="text-gray-700" style="min-width: 200px">
                            <a-menu-item
                                key="line"
                                class="px-4 py-2 text-sm"
                                :class="
                                    isThisCursorActive(editorConfig, 'line')
                                        ? 'bg-primary-light'
                                        : ''
                                "
                                @click="() => cursorChange('line')"
                                @mouseover="() => cursorHoverChange('line')"
                                @mouseleave="
                                    () =>
                                        cursorHoverChange(
                                            editorConfig.cursorStyle
                                        )
                                "
                            >
                                <div class="flex items-center justify-between">
                                    <span>Line</span>
                                    <AtlanIcon
                                        icon="Check"
                                        class="text-primary"
                                        v-if="
                                            isThisCursorActive(
                                                editorConfig,
                                                'line'
                                            )
                                        "
                                    />
                                </div>
                            </a-menu-item>

                            <a-menu-item
                                key="block"
                                class="px-4 py-2 text-sm"
                                :class="
                                    isThisCursorActive(editorConfig, 'block')
                                        ? 'bg-primary-light'
                                        : ''
                                "
                                @click="() => cursorChange('block')"
                                @mouseover="() => cursorHoverChange('block')"
                                @mouseleave="
                                    () =>
                                        cursorHoverChange(
                                            editorConfig.cursorStyle
                                        )
                                "
                            >
                                <div class="flex items-center justify-between">
                                    <span>Block</span>
                                    <AtlanIcon
                                        icon="Check"
                                        class="text-primary"
                                        v-if="
                                            isThisCursorActive(
                                                editorConfig,
                                                'block'
                                            )
                                        "
                                    />
                                </div>
                            </a-menu-item>

                            <a-menu-item
                                key="underline"
                                class="px-4 py-2 text-sm"
                                :class="
                                    isThisCursorActive(
                                        editorConfig,
                                        'underline'
                                    )
                                        ? 'bg-primary-light'
                                        : ''
                                "
                                @click="() => cursorChange('underline')"
                                @mouseover="
                                    () => cursorHoverChange('underline')
                                "
                                @mouseleave="
                                    () =>
                                        cursorHoverChange(
                                            editorConfig.cursorStyle
                                        )
                                "
                            >
                                <div class="flex items-center justify-between">
                                    <span>Underline</span>
                                    <AtlanIcon
                                        icon="Check"
                                        class="text-primary"
                                        v-if="
                                            isThisCursorActive(
                                                editorConfig,
                                                'underline'
                                            )
                                        "
                                    />
                                </div>
                            </a-menu-item>
                        </div>
                    </a-sub-menu>

                    <hr v-if="!showVQB" class="my-1" />
                    <!-- Show these options when query is saved -->
                    <div v-if="activeInlineTab?.queryId" class="text-gray-700">
                        <a-sub-menu key="shareQueryMenu" class="text-gray-500">
                            <template #title>
                                <div
                                    class="flex items-center justify-between w-full mr-2 text-gray-500"
                                >
                                    <div
                                        class="flex items-center justify-between w-full"
                                    >
                                        <span class="text-gray-700">Share</span>
                                        <AtlanIcon
                                            icon="ChevronRight"
                                            class="ml-1 text-gray-500 -mt-0.5"
                                        />
                                    </div>
                                </div>
                            </template>
                            <template #expandIcon />
                            <div class="text-gray-700" style="min-width: 200px">
                                <a-menu-item
                                    key="shareSavedQuery"
                                    class="px-4 py-2 text-sm"
                                    @click="copyURL"
                                >
                                    <AtlanIcon icon="CopyOutlined" />
                                    Copy link
                                </a-menu-item>
                                <a-menu-item
                                    v-if="
                                        tenantSlackStatus.configured &&
                                        tenantSlackStatus.channels.length
                                    "
                                    key="shareSlack"
                                    class="flex items-center px-4 py-2"
                                >
                                    <SlackModal
                                        :link="link"
                                        :asset-i-d="activeInlineTab?.queryId"
                                        :asset-type="
                                            activeInlineTab?.assetSidebar
                                                ?.assetInfo?.typeName || 'Query'
                                        "
                                    >
                                        <div class="flex items-center">
                                            <AtlanIcon icon="Slack" />
                                            <span class="pl-2 text-sm"
                                                >Slack</span
                                            >
                                        </div>
                                    </SlackModal>
                                </a-menu-item>
                            </div>
                        </a-sub-menu>

                        <a-menu-item @click="duplicateQuery" class="px-4 py-2">
                            Duplicate query
                        </a-menu-item>
                        <a-menu-item
                            @click="queryModalVisible = true"
                            class="px-4 py-2"
                        >
                            Rename query
                        </a-menu-item>
                        <a-menu-item
                            key="editQuery"
                            class="px-4 py-2"
                            @click="
                                () => {
                                    openEdit()
                                }
                            "
                            >Edit query</a-menu-item
                        >
                        <a-menu-item
                            key="deleteQueryEditor"
                            class="px-4 py-2 text-red-600"
                            @click="
                                () => {
                                    showDeletePopover = true
                                }
                            "
                            >Delete query</a-menu-item
                        >

                        <!-- <a-menu-item class="px-4 py-2"
                            >Edit saved query</a-menu-item
                        >
                        <a-menu-item class="px-4 py-2 text-red-600"
                            >Delete query</a-menu-item
                        > -->
                        <hr class="my-1" v-if="!showVQB" />
                    </div>
                    <a-menu-item
                        @click="openCommandPallete"
                        class="px-4 py-2"
                        v-if="!showVQB"
                        >Open command palette</a-menu-item
                    >
                </a-menu>
            </template>
        </a-dropdown>
    </div>

    <EditQuery
        v-if="queryModalVisible"
        :modalVisible="queryModalVisible"
        :queryData="{ attributes: activeInlineTab.attributes }"
        @closeRenameModal="queryModalVisible = false"
    />

    <TreeDeletePopover
        :item="{ attributes: activeInlineTab.attributes }"
        @cancel="showDeletePopover = false"
        @delete="() => deleteQuery()"
        :isSaving="isDeleteLoading"
        :showDeletePopover="showDeletePopover"
    />
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        toRefs,
        ComputedRef,
        computed,
        inject,
        Ref,
        toRaw,
        watch,
    } from 'vue'
    import { editorConfigInterface } from '~/types/insights/editoConfig.interface'
    import { useEditorPreference } from '~/components/insights/common/composables/useEditorPreference'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
    import { useLocalStorageSync } from '~/components/insights/common/composables/useLocalStorageSync'
    import { useRouter, useRoute } from 'vue-router'
    import { themes } from '~/components/insights/playground/editor/monaco/themeLoader'
    import { capitalizeFirstLetter } from '~/utils/string'
    import { useVModels } from '@vueuse/core'
    import { copyToClipboard } from '~/utils/clipboard'
    import { message } from 'ant-design-vue'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import SlackModal from '@/common/assets/misc/slackModal.vue'
    import integrationStore from '~/store/integrations/index'
    import EditQuery from '../editQuery/index.vue'
    import { useSchema } from '~/components/insights/explorers/schema/composables/useSchema'
    import { useAssetSidebar } from '~/components/insights/assetSidebar/composables/useAssetSidebar'
    import TreeDeletePopover from '~/components/insights/common/treeDeletePopover.vue'
    import { Insights } from '~/services/meta/insights/index'

    export default defineComponent({
        components: { SlackModal, EditQuery, TreeDeletePopover },
        props: {},
        setup(props, { emit }) {
            const router = useRouter()
            const {
                setEditorTheme,
                setTabSpaces,
                setFontSizes,
                setCursorStyle,
                getThemeLabelFromName,
            } = useEditorPreference()

            const { syncInlineTabsInLocalStorage } = useLocalStorageSync()
            const { inlineTabAdd, setVQBInInlineTab, inlineTabRemove } =
                useInlineTab()
            const store = integrationStore()
            const { tenantSlackStatus } = toRefs(store)

            themes.sort(function (a: object, b: object) {
                return a.label - b.label
            })

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

            const isThisCursorActive = (
                editorConfig: any,
                cursorStyle: string
            ) => {
                return editorConfig.cursorStyle === cursorStyle
            }

            const editorConfig = inject(
                'editorConfig'
            ) as Ref<editorConfigInterface>

            const editorHoverConfig = inject(
                'editorHoverConfig'
            ) as Ref<editorConfigInterface>

            const monacoInstance = inject('monacoInstance') as Ref<any>
            const editorInstance = inject('editorInstance') as Ref<any>
            const route = useRoute()
            // const vqbQueryRoute = ref(route.query?.vqb)
            // const t = computed(() => {
            //     console.log(vqbQueryRoute.value)
            //     return vqbQueryRoute
            // })

            const vqbQueryRoute = computed(() => route.query?.vqb)

            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as Ref<string>
            const tabsArray = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >

            const isQueryCreatedByCurrentUser = inject(
                'isQueryCreatedByCurrentUser'
            ) as ComputedRef
            const hasQueryReadPermission = inject(
                'hasQueryReadPermission'
            ) as ComputedRef
            const hasQueryWritePermission = inject(
                'hasQueryWritePermission'
            ) as ComputedRef

            const readOnly = computed(() =>
                activeInlineTab?.value?.qualifiedName?.length === 0
                    ? false
                    : isQueryCreatedByCurrentUser.value
                    ? false
                    : hasQueryWritePermission.value
                    ? false
                    : true
            )

            const showVQB = computed(() => {
                return activeInlineTab?.value?.playground?.isVQB
            })

            const isActive = ref(false)
            const toggleButtonState = () => {
                isActive.value = !isActive.value
            }
            const themeChange = (themeName: string) => {
                console.log(themeName, 'themeName')
                setEditorTheme(
                    toRaw(monacoInstance.value),
                    editorConfig,
                    themeName
                )
                toRaw(editorInstance?.value)?.focus()
            }
            console.log('editor data: ', editorConfig.value)

            const tabChange = (tabSpace: number) => {
                setTabSpaces(
                    toRaw(editorInstance.value),
                    editorConfig,
                    tabSpace
                )
                toRaw(editorInstance?.value)?.focus()
            }
            const fontSizeChange = (fontSize: number) => {
                setFontSizes(
                    toRaw(editorInstance.value),
                    editorConfig,
                    fontSize
                )
                toRaw(editorInstance?.value)?.focus()
            }

            const themeHoverChange = (theme: string) => {
                setEditorTheme(
                    toRaw(monacoInstance.value),
                    editorHoverConfig,
                    theme
                )
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

            const cursorChange = (cursorStyle: string) => {
                setCursorStyle(
                    toRaw(editorInstance.value),
                    editorConfig,
                    cursorStyle
                )
                toRaw(editorInstance?.value)?.focus()
            }
            const cursorHoverChange = (cursorStyle: string) => {
                setCursorStyle(
                    toRaw(editorInstance.value),
                    editorHoverConfig,
                    cursorStyle
                )
            }

            const queryModalVisible = ref(false)

            const duplicateQuery = () => {
                const activeInlineTabCopy: activeInlineTabInterface =
                    JSON.parse(JSON.stringify(toRaw(activeInlineTab.value)))
                const label = `Copy ${activeInlineTabCopy.label}`
                activeInlineTabCopy.label = label
                /* IMP TO RESET */
                activeInlineTabCopy.key = String(new Date().getTime())
                activeInlineTabCopy.isSaved = false
                activeInlineTabCopy.queryId = undefined
                activeInlineTabCopy.qualifiedName = ''
                activeInlineTabCopy.attributes = undefined
                activeInlineTabCopy.playground.editor.dataList = []
                activeInlineTabCopy.playground.editor.columnList = []
                activeInlineTabCopy.playground.editor.limitRows = {
                    checked: false,
                    rowsCount: -1,
                }

                activeInlineTabCopy.playground.resultsPane = {
                    activeTab:
                        activeInlineTab.value?.playground.resultsPane
                            .activeTab ?? 0,
                    result: {
                        title: '',
                        isQueryRunning: '',
                        isQueryAborted: false,
                        queryErrorObj: {},
                        errorDecorations: [],
                        totalRowsCount: -1,
                        executionTime: -1,
                        runQueryId: undefined,
                        buttonDisable: false,
                        eventSourceInstance: undefined,
                    },
                    metadata: {},
                    queries: {},
                    joins: {},
                    filters: {},
                    impersonation: {},
                    downstream: {},
                    sqlHelp: {},
                }

                /* CAREFUL:-------Order is important here------ */
                inlineTabAdd(activeInlineTabCopy, tabsArray, activeInlineTabKey)
                activeInlineTabKey.value = activeInlineTabCopy.key
                /* ----------------------------- */
                // syncying inline tabarray in localstorage
                syncInlineTabsInLocalStorage(tabsArray.value)
                const queryParams = {}
                if (route?.query?.vqb) queryParams.vqb = true
                router.push({ path: `insights`, query: queryParams })
            }
            const openCommandPallete = () => {
                toRaw(editorInstance.value)?.focus()
                toRaw(editorInstance.value)?.trigger(
                    'editor',
                    'editor.action.quickCommand',
                    undefined
                )
            }

            const link = computed(() => window.location.href)
            const copyURL = () => {
                const URL = link.value
                copyToClipboard(URL)
                message.success({
                    content: 'Link Copied!',
                })
                useAddEvent('insights', 'query', 'link_copied', undefined)
            }

            const { isSameNodeOpenedInSidebar } = useSchema()

            const { openAssetSidebar, closeAssetSidebar } = useAssetSidebar(
                tabsArray,
                activeInlineTab
            )

            const openEdit = () => {
                let queryInfo = {
                    entity: {
                        attributes: { ...activeInlineTab.value.attributes },
                        typeName: 'Query',
                        guid: activeInlineTab.value.queryId,
                    },
                }
                if (isSameNodeOpenedInSidebar(queryInfo, activeInlineTab)) {
                    /* Close it if it is already opened */
                    closeAssetSidebar(activeInlineTab.value)
                } else {
                    const activeInlineTabCopy: activeInlineTabInterface =
                        JSON.parse(JSON.stringify(toRaw(activeInlineTab.value)))

                    console.log('query entity1: ', queryInfo.entity)
                    activeInlineTabCopy.assetSidebar.assetInfo =
                        queryInfo.entity
                    activeInlineTabCopy.assetSidebar.isVisible = true
                    openAssetSidebar(activeInlineTabCopy, 'not_editor')
                }
            }

            const refreshQueryTree = inject<
                (guid: string, type: 'query' | 'Folder') => void
            >('refreshQueryTree', () => {})

            const showDeletePopover = ref(false)
            const isDeleteLoading = ref(false)

            const pushGuidToURL = (guid: string | undefined) => {
                const queryParams = {}
                if (route?.query?.vqb) queryParams.vqb = true
                if (guid) {
                    queryParams.id = guid
                    router.push({ path: `insights`, query: queryParams })
                } else {
                    router.push({ path: `insights`, query: queryParams })
                }
            }

            const deleteQuery = () => {
                let item = {
                    attributes: activeInlineTab.value.attributes,
                    guid: activeInlineTab.value.attributes.__guid,
                }
                let key = item.guid
                let parentGuid = item?.attributes?.parent?.guid
                console.log('delete item: ', item)
                const { data, error, isLoading } = Insights.DeleteEntity(
                    item.guid,
                    {}
                )
                isDeleteLoading.value = true

                watch([data, error, isLoading], ([newData, newError]) => {
                    isDeleteLoading.value = isLoading.value
                    console.log('delete: ', isLoading.value)
                    if (newData && !newError) {
                        showDeletePopover.value = false

                        inlineTabRemove(
                            key,
                            tabsArray,
                            activeInlineTabKey,
                            pushGuidToURL
                        )

                        refreshQueryTree(parentGuid, 'query')

                        message.success({
                            content: `${item?.attributes?.name} deleted!`,
                        })
                        useAddEvent('insights', 'query', 'deleted', undefined)
                    }
                })
            }

            return {
                tenantSlackStatus,
                link,
                vqbQueryRoute,
                showVQB,
                getThemeLabelFromName,
                openCommandPallete,
                activeInlineTab,
                duplicateQuery,
                fontSizeChange,
                isThisFontSizeActive,
                isThisTabActive,
                tabChange,
                isThisThemeActive,
                themeChange,
                editorConfig,
                toggleButtonState,
                isActive,
                themeHoverChange,
                fontSizeHoverChange,
                tabHoverChange,
                themes,
                cursorChange,
                cursorHoverChange,
                isThisCursorActive,
                capitalizeFirstLetter,
                copyURL,
                readOnly,
                queryModalVisible,
                openEdit,
                showDeletePopover,
                deleteQuery,
                isDeleteLoading,
            }
        },
    })
</script>
<style lang="less" module>
    .menu_class {
        // font-family: 'Avenir LT Pro' !important;
        :global(.ant-dropdown-menu-submenu-title) {
            @apply pl-4 !important;
            @apply pr-3 !important;
            @apply py-2 !important;
        }
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
