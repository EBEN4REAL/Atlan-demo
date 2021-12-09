<template>
    <node-view-wrapper
        class="flex w-full mt-2 group"
        :class="selected ? 'outline-primary' : ''"
    >
        <div v-if="isEditMode" class="w-full">
            <div class="flex w-full px-3 py-5 bg-gray-100 rounded">
                <AtlanIcon icon="Gdoc" class="h-8 mr-4"></AtlanIcon>
                <div class="flex items-center w-full">
                    <a-input
                        v-if="!validInput"
                        v-model:value="linkInput"
                        placeholder="https://docs.google.com/xxx"
                        @change="handleInputChange"
                        @keydown.esc="handleCancel"
                        class="mr-3"
                    >
                    </a-input>
                    <AtlanButton
                        :size="'sm'"
                        class="ml-auto"
                        color="secondary"
                        @click="checkEmbed"
                        >Embed</AtlanButton
                    >
                </div>
            </div>
        </div>
        <!-- https://miro.com/app/embed/o9J_kuibKbM=/?moveToWidget=3074457350197542287&cot=14 -->
        <iframe
            v-else
            :src="linkInput"
            frameborder="0"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            width="100%"
            height="500"
            type="text/html"
            allowFullScreen
        ></iframe>
    </node-view-wrapper>
</template>

<script lang="ts">
import { ref, watch, PropType } from 'vue'
import { getNameInitials, getNameInTitleCase } from '~/utils/string'
import uploadAvatar from '~/composables/avatar/uploadAvatar'
import SectionLoader from '@/common/loaders/section.vue'

import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import { toRefs } from 'vue'
import useUploadImage from '~/composables/image/uploadImage'
import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
import AtlanButton from '~/components/UI/button.vue'

export default {
    components: {
        NodeViewWrapper,
        SectionLoader,
        AtlanIcon,
        AtlanButton,
    },
    props: {
        ...nodeViewProps,
    },
    setup(props, context) {
        const { selected, deleteNode, node, editor } = toRefs(props)

        const imageSrc = ref(node.value?.attrs.src)
        const linkInput = ref('')
        const isEditMode = ref(true)
        const validInput = ref(false)
        const popoverVisible = ref(true)

        const { upload, isLoading, error, isReady, data } = useUploadImage()
        const handleUploadImage = async (uploaded) => {
            await upload(uploaded.file)
        }

        watch(isReady, () => {
            if (isReady?.value) {
                const url = `/api/service/images/${data.value?.id}?ContentDisposition=inline&name=image`
                imageSrc.value = url
                isEditMode.value = false
                if (props?.updateAttributes) {
                    props?.updateAttributes({
                        src: url,
                    })
                }
            }
        })

        const handleInput = () => {
            console.log('prevent')
        }

        const handleDelete = () => {
            deleteNode?.value()
        }

        const toggleEditMode = () => {
            isEditMode.value = !isEditMode.value
        }

        const handleCancel = (value) => {
            // popoverVisible.value = false
        }

        const handleInputChange = (value) => {
            console.log('change')
            if (linkInput.value) {
                isEditMode.value = false
                if (props?.updateAttributes) {
                    props?.updateAttributes({
                        src: linkInput.value,
                    })
                }
            }
        }

        const checkEmbed = () => {
            toggleEditMode()
        }

        return {
            handleUploadImage,

            getNameInitials,
            getNameInTitleCase,
            error,
            handleInput,
            handleInputChange,
            imageSrc,
            linkInput,
            selected,
            handleDelete,
            deleteNode,
            isEditMode,
            toggleEditMode,
            handleCancel,
            isLoading,
            editor,
            isReady,
            validInput,
            popoverVisible,
            checkEmbed,
        }
    },
}
</script>

<style lang="less"></style>
