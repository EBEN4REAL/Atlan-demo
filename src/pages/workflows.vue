<template>
    <router-view></router-view>
</template>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
    middleware: [routePrint]
</route>
