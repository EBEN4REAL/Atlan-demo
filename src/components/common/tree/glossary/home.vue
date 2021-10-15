<template>
    <div v-for="glossary in glossaryList" :key="glossary.guid">
        <div
            class="
                px-3
                text-sm
                leading-5
                text-gray-700
                h-9
                flex flex-col
                justify-center
                cursor-pointer
                group
                hover:bg-primary-light
                hover:text-primary
            "
            @click="() => redirectToProfile('AtlasGlossary', glossary.guid)"
        >
            <div class="flex flex-row justify-between">
                {{ glossary.name }}
                <Fa
                    class="w-auto h-3 text-white group-hover:text-primary"
                    icon="fal external-link-alt"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue'
import { useRouter } from 'vue-router'
import redirect from '@/glossary/utils/redirectToProfile';

import { Glossary } from '~/api/atlas/glossary'

export default defineComponent({
    props: {},
    setup() {
        const { data: glossaryList, loading, error, mutate } = Glossary.List()
        const router = useRouter()

        const redirectToProfile = redirect(router)

        return {
            glossaryList,
            loading,
            error,
            redirectToProfile,
        }
    },
    data() {
        return {}
    },
})
</script>
<style lang="less" scoped>
</style>
