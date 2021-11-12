<template>
    <div
        class="flex flex-col items-center justify-center w-full h-full text-center "
    >
        <AtlanIcon icon="Error" class="h-20 mb-2 text-red-500" />
        {{ errorMessage || 'Something went wrong. Please try again' }}
        <!-- Can use this slot for adding retry CTA-->
        <slot></slot>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
        name: 'ErrorView',
        props: {
            error: {
                required: false,
            },
        },
        computed: {
            errorMessage() {
                if (this.error) {
                    if (this.error.response) {
                        if (this.error.response.status === 503) {
                            return 'Service is unavailable. Please try again'
                        }
                        if (this.error.response.status === 400) {
                            if (this.error.response.data) {
                                if (this.error.response.data.errorMessage) {
                                    return this.error.response.data.errorMessage
                                }
                            }
                            return 'Service is unavailable. Please try again'
                        }
                    }
                }
                return ''
            },
        },
        mounted() {},
        methods: {},
    })
</script>
