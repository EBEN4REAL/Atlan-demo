<template>
    <DefaultLayout title="Health Status">
        <div class="flex flex-col items-center pt-16 mb-6">
            <Fa
                v-bind="getOverallStatusIconClass"
                :key="overallStatus"
                class="mb-6 text-5xl"
            />
            <span class="text-2xl font-bold text-gray-600">
                {{ overallStatusText }}
            </span>
            <span v-if="overallStatus === 'down'" class="mt-1 text-gray-500">
                Facing issues? Reach out to us at
                <a href="mailto:support@atlan.com">support@atlan.com</a>
            </span>
        </div>
        <div
            class="grid grid-cols-2 py-6 mb-20  lg:grid-cols-3 xl:grid-cols-3 gap-x-16 gap-y-9"
        >
            <div
                v-for="service in servicesNames"
                :key="service"
                class="flex items-center justify-between flex-grow px-5 py-3 rounded shadow "
            >
                <span class="text-xl text-gray-500 capitalize">{{
                    SERVICES[service]
                }}</span>
                <Fa
                    v-bind="getStatusClass(services[service].value)"
                    :key="service + services[service].value"
                    class="text-xl"
                />
            </div>
        </div>
        <div class="bottom-0 flex items-center justify-center w-full mb-8">
            <img class="w-5 mx-2" :src="grafana" />
            <span>Need to check logs?&nbsp;</span>
            <a class="text-center" href="/services/monitor">
                Go to grafana dashboard
                <Fa :icon="'fal chevron-right'" />
            </a>
        </div>
    </DefaultLayout>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { useHead } from '@vueuse/head'
    import DefaultLayout from '@/admin/defaultLayout.vue'

    import { useHealth } from './useHealth'
    import grafana from '~/assets/images/source/grafana.png'

    export default defineComponent({
        name: 'HealthStatus',
        components: { DefaultLayout },
        setup() {
            useHead({
                title: 'Health',
            })
            const {
                SERVICES,
                services,
                overallStatusText,
                overallStatus,
                getOverallStatusIconClass,
                getStatusClass,
            } = useHealth()

            return {
                SERVICES,
                services,
                overallStatusText,
                overallStatus,
                getOverallStatusIconClass,
                servicesNames: Object.keys(services),
                getStatusClass,
                grafana,
            }
        },
    })
</script>

<style lang="less" scoped>
    .animate-flipInX {
        backface-visibility: visible !important;
        animation: flipInX 1.2s linear 1;
    }

    .animate-tada {
        backface-visibility: visible !important;
        animation: tada 1.2s linear 1;
    }

    @keyframes flipInX {
        0% {
            transform: perspective(400px) rotateX(90deg);
            transition-timing-function: ease-in;
            opacity: 0;
        }
        40% {
            transform: perspective(400px) rotateX(-20deg);
            transition-timing-function: ease-in;
        }

        60% {
            transform: perspective(400px) rotateX(10deg);
            opacity: 1;
        }
        80% {
            transform: perspective(400px) rotateX(-5deg);
        }
        100% {
            transform: perspective(400px);
        }
    }

    @keyframes tada {
        0% {
            transform: scaleX(1);
        }
        10%,
        20% {
            transform: scale3d(0.9, 0.9, 0.9) rotate(-3deg);
        }
        30%,
        50%,
        70%,
        90% {
            transform: scale3d(1.1, 1.1, 1.1) rotate(3deg);
        }
        40%,
        60%,
        80% {
            transform: scale3d(1.1, 1.1, 1.1) rotate(-3deg);
        }
        100% {
            transform: scaleX(1);
        }
    }
</style>
<route lang="yaml">
meta:
layout: default
requiresAuth: true
</route>
