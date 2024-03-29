<template>
    <div
        id="box-readme"
        ref="refBox"
        class="relative p-4 overflow-hidden bg-gray-100 border border-gray-200 rounded-lg"
        :style="`max-height: ${maxHeight}px`"
    >
        <!-- <AtlanEditor
            v-if="readme"
            ref="editor"
            v-model="localReadmeContent"
            placeholder="Type '/' for commands"
            :is-edit-mode="false"
            class="bg-transparent"
            @transitionend.stop="() => {}"
        /> -->
        <div
            v-if="readme && localReadmeContent !== '<p></p>'"
            class="ProseMirror"
            v-html="localReadmeContent"
        ></div>
        <div v-else class="text-sm text-gray-600">No readme</div>
        <div
            v-if="expandShow"
            class="absolute bottom-0 left-0 flex justify-center w-full py-4 bg-over-flow-btn"
        >
            <div
                class="flex items-center px-3 py-1 text-sm text-white bg-gray-500 rounded-full cursor-pointer"
                @click="handleExpandReadme"
            >
                <AtlanIcon icon="FullScreen" class="mr-1 icon-expand-readme" />
                Expand to view
            </div>
        </div>
        <a-modal v-model:visible="expandReadme" :footer="null" :width="692">
            <div class="p-4 overflow-scroll container-view-all-readme">
                <AtlanEditor
                    v-model="localReadmeContent"
                    placeholder="Type '/' for commands"
                    :is-edit-mode="false"
                    class="bg-transparent"
                    @transitionend.stop="() => {}"
                />
            </div>
        </a-modal>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        watch,
        toRefs,
        ref,
        onMounted,
        nextTick,
    } from 'vue'
    import AtlanEditor from '~/components/common/editor/index.vue'

    export default defineComponent({
        name: 'ReadmeView',
        components: { AtlanEditor },
        props: {
            readme: {
                type: String,
                required: true,
            },
            maxHeight: {
                type: Number,
                required: true,
            },
        },
        emits: ['expandedReadme'],
        setup(props, { emit }) {
            const editor = ref()
            const expandReadme = ref(false)
            const refBox = ref()
            const { readme, maxHeight } = toRefs(props)
            const expandShow = ref(false)
            const localReadmeContent = ref(decodeURIComponent(readme.value))
            const calculateHeightBox = () => {
                const box = document.querySelector('#box-readme')
                const height = box.offsetHeight
                if (+maxHeight.value <= height) {
                    expandShow.value = true
                } else {
                    expandShow.value = false
                }
            }
            watch(readme, () => {
                nextTick(() => {
                    calculateHeightBox()
                })
            })
            onMounted(() => {
                nextTick(() => {
                    calculateHeightBox()
                })
            })
            const handleExpandReadme = () => {
                expandReadme.value = true
                emit('expandedReadme')
            }

            return {
                editor,
                localReadmeContent,
                refBox,
                expandShow,
                expandReadme,
                handleExpandReadme,
            }
        },
    })
</script>
<style lang="less">
    .container-view-all-readme {
        max-height: 70vh;
    }
    .icon-expand-readme {
        path {
            stroke: white;
        }
    }
    .bg-over-flow-btn {
        background: linear-gradient(
            0.12deg,
            #ffffff 0.11%,
            rgba(246, 247, 249, 0.1) 144.63%
        );
    }
</style>
