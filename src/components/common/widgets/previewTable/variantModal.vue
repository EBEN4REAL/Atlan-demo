<template>
    <div @click="showModal">
        <slot name="trigger" @click="showModal" />
    </div>
    <a-modal
        v-model:visible="visible"
        width="1000px"
        title="Basic Modal"
        :footer="null"
        centered
    >
        {{ data }}
    </a-modal>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs, watch, ref } from 'vue'

    export default defineComponent({
        name: 'VariantModal',

        props: {
            data: {
                type: String,
                required: true,
            },
        },
        setup(props) {
            const visible = ref<boolean>(false)

            const showModal = async () => {
                visible.value = true
            }

            return {
                visible,
                showModal,
            }
        },
    })
</script>

<style lang="less" module></style>
