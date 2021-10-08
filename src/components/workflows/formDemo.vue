<template>
    <div class="grid grid-cols-2">
        <div class="p-1 border">
            <a-button @click="() => (view = true)" class="m-2"
                >Render Form</a-button
            >

            <a-textarea
                placeholder="Add Form Config"
                :rows="29"
                @change="handleChange"
            />
        </div>
        <div
            class="p-2 overflow-y-auto border"
            style="height: calc(100vh - 3.5rem)"
        >
            <formGen v-if="view" :config="data" :error="error" />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import formGen from '@/common/formGenerator/index.vue'

    export default defineComponent({
        components: {
            formGen,
        },
        setup() {
            const data = ref()
            const view = ref()
            const error = ref(false)
            const handleChange = (e) => {
                view.value = false
                try {
                    data.value = JSON.parse(e.target.value)
                    console.log(e, JSON.parse(e.target.value))
                    error.value = false
                } catch (e) {
                    console.log(e)
                    data.value = []
                    error.value = true
                }
            }
            return { handleChange, data, error, view }
        },
    })
</script>

<style scoped></style>
