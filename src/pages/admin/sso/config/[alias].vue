<template>
    <div class="px-12 mx-auto my-8 text-gray-600 bg-white rounded">
        <UpdateSSOConfig :alias="alias" />
    </div>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import UpdateSSOConfig from '~/components/admin/sso/update/updateSSOConfig.vue'

export default defineComponent({
    components: { UpdateSSOConfig },
    setup() {
        const route = useRoute()
        const alias = computed(() => route?.params?.alias || '')
        return {
            alias,
        }
    },
})
</script>
  <route lang="yaml">
  meta:
  layout: default
  requiresAuth: true
  </route>