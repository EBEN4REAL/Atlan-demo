<template>
  <div class="container mx-auto h-full health-container">
    <div class="bg-white rounded h-full w-full p-12 pt-16 relative shadow">
      <div class="flex flex-col items-center mb-6">
        <Fa class="text-5xl mb-6" v-bind="getOverallStatusIconClass" :key="overallStatus" />
        <span class="text-2xl font-bold text-gray-600">{{
          overallStatusText
        }}</span>
        <span class="text-gray-500 mt-1" v-if="overallStatus === 'down'">
          Facing issues? Reach out to us at
          <a href="mailto:support@atlan.com">support@atlan.com</a>
        </span>
      </div>
      <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-12 gap-y-6 p-6 mb-20">
        <div
          v-for="(service) in servicesNames"
          :key="service"
          class="flex flex-grow items-center justify-between"
        >
          <span class="text-xl text-gray-500 capitalize">{{service}}</span>
          <Fa class="text-xl" v-bind="getStatusClass(services[service].value)" :key="service+services[service].value" />
        </div>
      </div>
      <div
        class="absolute flex items-center justify-center mb-8 bottom-0 w-full"
      >
        <!-- <img class="w-5 mx-2" src="~/assets/images/source/grafana.png" /> -->
        <span> Need to check logs?&nbsp; </span>
        <a class="text-center" href="/services/monitor">
          Go to grafana dashboard <Fa :icon="'fal chevron-right'"/>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import {useHealth} from "~/composables/health/useHealth";


export default {
  name: "HealthStatus",
  setup(){
    const { 
      user,   
    services,
    overallStatusText,
    overallStatus,
    getOverallStatusIconClass,
    getStatusClass
    } = useHealth();

    return {
    services,
    overallStatusText,
    overallStatus,
    getOverallStatusIconClass,
    servicesNames:Object.keys(services),
    getStatusClass

    }
  },
};
</script>

<style>
.animate-flipInX {
  backface-visibility: visible !important;
  animation: flipInX 1.2s linear 1;
}

.animate-tada {
  backface-visibility: visible !important;
  animation: tada 1.2s linear 1;
}
.health-container{
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
