<template>
    <div class="grid grid-cols-2">
        <div class="flex flex-col p-1 border">
            <div class="relative">
                <div class="absolute top-0 right-0 z-10 m-2">
                    <a-select
                        class="mr-2"
                        placeholder="test config"
                        :options="[
                            {
                                title: 'Test for async',
                                value: 'async',
                            },
                            {
                                title: 'Test for fields',
                                value: 'fields',
                            },
                            {
                                title: 'Test for rules',
                                value: 'rules',
                            },
                        ]"
                        @select="handleSelect"
                    />
                    <a-button @click="() => (view = true)"
                        >Render Form</a-button
                    >
                </div>
                <a-textarea
                    v-model:value="data"
                    placeholder="Add Form Config"
                    style="height: calc(100vh - 3.5rem); font-family: monospace"
                    class="z-1"
                    @change="handleChange"
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
                :global-values="tempGlobal"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { defineAsyncComponent, ref, onMounted } from 'vue'
    import tests from './tests.json'

    const formGen = defineAsyncComponent(
        () => import('@/common/formGenerator/index.vue')
    )
    const data = ref()
    const view = ref()
    const error = ref(false)

    onMounted(() => {
        const storedData = localStorage.getItem('formData')
        if (storedData) data.value = storedData
    })

    const handleSelect = (v) => {
        data.value = JSON.stringify(tests[v])
    }

    const handleChange = (e) => {
        view.value = false
        try {
            data.value = e.target.value
            localStorage.setItem('formData', e.target.value)
            error.value = false
        } catch (err) {
            // console.log(err)
            console.log('test', err)
            data.value = []
            error.value = true
        }
    }

    const tempGlobal = ref({
        name: 'atlan',
        details: {
            email: 'samiran@atlan.com',
        },
    })
</script>

<style scoped></style>
