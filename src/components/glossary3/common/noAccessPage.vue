<template>
    <div class="text-gray-700 text-lg text-center">
        You don't have access to this page!
    </div>
</template>
<script lang="ts">
    import {
        defineComponent,
    } from 'vue'


export default defineComponent({
    props: {
        type: {
            type: String,
            required: true,
            default: '',
        },
    },
    setup(props, { emit }) {


        return {
    
        }
    },
})
</script>
<style lang="less" module>

</style>
