<template>
    <div class="flex justify-center h-full">
        <div class="max-w-md py-4 px-8 bg-white rounded-lg my-20">
        <div>
            <h2 class="text-gray-800 text-3xl font-semibold"><span class="text-primary">404</span> Page not found</h2>
            <!--p class="mt-2 text-gray-600">Please check the URL in the adress bar and try again.</p-->
        </div>
</div>
    </div>
</template>

<script lang="ts">

    import { defineComponent, ref, computed } from 'vue'
    import { useRouter } from 'vue-router'
      import { usePackageDiscoverList } from '~/composables/package/usePackageDiscoverList'
    export default defineComponent({

        setup(props, { emit }) {
                        const limit = ref(20)
            const offset = ref(0)
            const queryText = ref('')
            const facets = ref({
                verified: true,
            })
            const dependentKey = ref('DEFAULT_PACKAGES')
                    const { isLoading, list, error } = usePackageDiscoverList({
                isCache: true,
                dependentKey,
                facets,
                limit,
                offset,
            })
        }


    });
</script>

<style lang="less">
    .container {
        display: flex;
        width: 100vw !important;
        align-items: center;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>

