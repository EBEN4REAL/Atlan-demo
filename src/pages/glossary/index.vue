<template>
    <div class="flex items-center w-full pl-12 mb-5">
        <div class="grid h-full grid-cols-12 p-6 gap-x-12">
            <div class="col-span-12 mt-10 sm:col-span-8">
                <div class="relative text-white">
                    <h3 class="text-xl font-bold text-gray">
                        Recently accessed terms
                    </h3>

                    <div class="grid grid-cols-12">
                        <div class="col-span-4 p-5 mr-5 border rounded-md">
                            <p class="font-bold text-gray">
                                Sample recently accessed terms
                            </p>
                            <p class="text-gray-500">
                                set of all Tableau sales dashboards, reports and
                                data sources from 2020
                            </p>
                        </div>

                        <div class="col-span-4 p-5 mr-5 border rounded-md">
                            <p class="font-bold text-gray">
                                Sample recently accessed terms
                            </p>
                            <p class="text-gray-500">
                                set of all Tableau sales dashboards, reports and
                                data sources from 2020
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-span-12 mt-10 sm:col-span-8">
                <div class="relative text-white">
                    <h3 class="text-xl font-bold text-gray">
                        Recommended terms
                    </h3>

                    <div class="grid grid-cols-12">
                        <div class="col-span-4 p-5 mr-5 border rounded-md">
                            <p class="font-bold text-gray">
                                Sample recommended terms
                            </p>
                            <p class="text-gray-500">
                                set of all Tableau sales dashboards, reports and
                                data sources from 2020
                            </p>
                        </div>

                        <div class="col-span-4 p-5 mr-5 border rounded-md">
                            <p class="font-bold text-gray">
                                Sample recommended terms
                            </p>
                            <p class="text-gray-500">
                                set of all Tableau sales dashboards, reports and
                                data sources from 2020
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
        setup() {},
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
