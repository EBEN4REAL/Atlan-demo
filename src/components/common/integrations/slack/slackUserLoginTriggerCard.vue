<template>
    <div
        class="flex items-center justify-between px-3 py-2 bg-gray-100 border rounded "
    >
        <div class="flex flex-col">
            <span class="font-bold">Connect to Slack</span>
            <span>Get rich previews for Slack</span>
        </div>
        <div
            class="flex items-center px-4 py-1 text-white bg-gray-700 rounded cursor-pointer "
            @click="openSlackIntegration"
        >
            <AtlanIcon
                :icon="'Slack'"
                class="mr-2"
                style="height: 15px"
            ></AtlanIcon>
            <span>Connect</span>
        </div>
    </div>
</template>

<script>
// components
import { defineComponent } from 'vue'
import AtlanIcon from '../../icon/atlanIcon.vue'
import { userLevelOauthUrl } from '~/composables/integrations/useSlack'

export default defineComponent({
    components: { AtlanIcon },
    setup() {
        function openSlackIntegration() {
            window.open(userLevelOauthUrl.value)
        }
        return {
            openSlackIntegration,
            userLevelOauthUrl,
        }
    },
})
</script>