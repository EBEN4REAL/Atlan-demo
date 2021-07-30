<template>
    <div class="text-sm leading-6 text-gray-400 font-normal">
        <span class="mr-3"
            >Created {{ creationTime }} ago<span v-if="createdBy">
                by
                <a-button type="link" class="p-0 m-0" @click="() => handleClickUser(createdBy)"
                    >@{{ createdBy }}</a-button
                ></span
            ></span
        >
        <span>&bull;</span>
        <span class="ml-3"
            >Edited {{ updationTime }} ago<span v-if="updatedBy"
                >by
                <a-button type="link" class="p-0 m-0" @click="() => handleClickUser(updatedBy)"
                    >@{{ updatedBy }}</a-button
                ></span
            ></span
        >
    </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useTimeAgo } from '@vueuse/core'

import { useUserPreview } from '~/composables/user/showUserPreview'

interface PropsType {
    createdAt: number
    updatedAt: number
    createdBy: string
    updatedBy: string
}

export default defineComponent({
    props: ['createdAt', 'updatedAt', 'createdBy', 'updatedBy'],
    setup(props: PropsType) {
        const creationTime = computed(() => useTimeAgo(props.createdAt).value)
        const updationTime = computed(() => useTimeAgo(props.updatedAt).value)

        const { showUserPreview, setUserUniqueAttribute } = useUserPreview()
        const handleClickUser = (username: string) => {
            setUserUniqueAttribute(username, 'username')
            showUserPreview({ allowed: ['about'] })
        }

        return {
            creationTime,
            updationTime,
            handleClickUser,
        }
    },
})
</script>