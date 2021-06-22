<template>
  <div class="container h-full mx-auto health-container">
    <div class="relative w-full h-full p-12 pt-16 bg-white rounded shadow">
      <div class="flex flex-col items-center mb-6">
        <Fa
          class="mb-6 text-5xl"
          v-bind="getOverallStatusIconClass"
          :key="overallStatus"
        />
        <span class="text-2xl font-bold text-gray-600">
          {{ overallStatusText }}
        </span>
        <span class="mt-1 text-gray-500" v-if="overallStatus === 'down'">
          Facing issues? Reach out to us at
          <a href="mailto:support@atlan.com">support@atlan.com</a>
        </span>
      </div>
      <div
        class="
          grid grid-cols-2
          p-6
          mb-20
          lg:grid-cols-3
          xl:grid-cols-3
          gap-x-12 gap-y-6
        "
      >
        <div
          v-for="service in servicesNames"
          :key="service"
          class="flex items-center justify-between flex-grow"
        >
          <span class="text-xl text-gray-500 capitalize">{{ service }}</span>
          <Fa
            class="text-xl"
            v-bind="getStatusClass(services[service].value)"
            :key="service + services[service].value"
          />
        </div>
      </div>
      <div
        class="absolute bottom-0 flex items-center justify-center w-full mb-8"
      >
        <img class="w-5 mx-2" :src="grafana" />
        <span>Need to check logs?&nbsp;</span>
        <a class="text-center" href="/services/monitor">
          Go to grafana dashboard
          <Fa :icon="'fal chevron-right'" />
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useHealth } from "~/composables/health/useHealth";
import grafana from "~/assets/images/source/grafana.png";

export default defineComponent({
  name: "HealthStatus",
  setup() {
    const {
      services,
      overallStatusText,
      overallStatus,
      getOverallStatusIconClass,
      getStatusClass,
    } = useHealth();

    return {
      services,
      overallStatusText,
      overallStatus,
      getOverallStatusIconClass,
      servicesNames: Object.keys(services),
      getStatusClass,
      grafana,
    };
  },
});
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
.health-container {
  max-height: 95%;
  max-width: 95%;
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