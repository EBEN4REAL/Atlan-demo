<template>
    <div class="grid grid-cols-2">
        <div class="flex flex-col p-1 border">
            <div class="relative">
                <a-button
                    class="absolute top-0 right-0 z-10 m-2"
                    @click="() => (view = true)"
                    >Render Form</a-button
                >
                <a-textarea
                    placeholder="Add Form Config"
                    style="height: calc(100vh - 3.5rem); font-family: monospace"
                    class="z-1"
                    @change="handleChange"
                    v-model:value="data"
                />
            </div>
        </div>
        <div
            class="p-2 overflow-y-auto border"
            style="height: calc(100vh - 3.5rem)"
        >
            <formGen
                v-if="view"
                :config="JSON.parse(data)"
                :error="error"
                :globalValues="tempGlobal"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, onMounted } from 'vue'
    import formGen from '@/common/formGenerator/index.vue'

    export default defineComponent({
        components: {
            formGen,
        },
        setup() {
            const data = ref()
            const view = ref()
            const error = ref(false)

            onMounted(() => {
                const storedData = localStorage.getItem('formData')
                if (storedData) data.value = storedData
            })

            const handleChange = (e) => {
                view.value = false
                try {
                    data.value = e.target.value
                    localStorage.setItem('formData', e.target.value)
                    error.value = false
                } catch (e) {
                    console.log(e)
                    data.value = []
                    error.value = true
                }
            }

            const tempGlobal = ref({
                global_1: '1111111',
                global_3: {
                    global_2: '000000',
                },
            })

            return { tempGlobal, handleChange, data, error, view }
        },
    })
</script>

<style scoped></style>
