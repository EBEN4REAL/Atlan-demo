<template>
    <div class="flex justify-center h-full">
        <div class="max-w-md px-8 py-4 my-20 bg-white rounded-lg">
            <div>
                <h2 class="text-3xl font-semibold text-gray-800">
                    <span class="text-primary">404</span> Page not found
                </h2>
                <!--p class="mt-2 text-gray-600">Please check the URL in the adress bar and try again.</p-->
            </div>
        </div>
    </div>
</template>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
