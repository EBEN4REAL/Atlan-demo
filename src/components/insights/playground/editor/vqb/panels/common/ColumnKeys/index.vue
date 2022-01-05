<template>
    <div
        class="absolute right-0 flex items-center text-xs"
        :class="[`${topStyle}`]"
    >
        <div class="flex items-center" v-if="primaryKey">
            <AtlanIcon icon="primaryKey" class="w-4 h-4 mr-1"></AtlanIcon>
            <span style="color: #ebb907" class="">Pkey</span>
        </div>
        <div class="flex items-center ml-4 mr-1" v-if="ForeignKey">
            <AtlanIcon icon="ForeignKey" class="w-4 h-4 mr-1"></AtlanIcon>
            <span class="" style="color: #9040f5">Fkey</span>
        </div>

        <!-- <div class="flex items-center ml-4 mr-1" v-if="isPartition">
            <AtlanIcon icon="ForeignKey" class="w-4 h-4 mr-1"></AtlanIcon>
            <span class="" style="color: #9040f5">Ptkey</span>
        </div> -->
    </div>
</template>

<script lang="ts">
    import { defineComponent, toRefs } from 'vue'

    export default defineComponent({
        name: 'Column Keys',
        components: {},
        props: {
            isPrimary: {
                type: Boolean,
                required: false,
                default: false,
            },
            isForeign: {
                type: Boolean,
                required: false,
                default: false,
            },
            isPartition: {
                type: Boolean,
                required: false,
                default: false,
            },
            topStyle: {
                type: String,
                required: false,
                default: '-top-2.5',
            },
        },

        setup(props, { emit }) {
            const { topStyle } = toRefs(props)
            return {
                topStyle,
            }
        },
    })
</script>
<style lang="less" scoped></style>
