<template>
  <div class="container mx-auto h-full health-container">
    <div class="bg-white rounded h-full w-full p-12 pt-16 relative shadow">
      <div class="flex flex-col items-center mb-6">
        <span v-bind="getOverallStatusIconClass" ></span>
        <Fa class="text-5xl mb-6" v-bind="getOverallStatusIconClass" />
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
          v-for="(service,key) in servicesNames"
          :key="key"
          class="flex flex-grow items-center justify-between"
        >
          <span class="text-xl text-gray-500 capitalize">{{service}}</span>
          <Fa class="text-xl" v-bind="getStatusClass(services[service].value)" />
        </div>
      </div>
      <div
        class="absolute flex items-center justify-center mb-8 bottom-0 w-full"
      >
        <img class="w-5 mx-2" src="/assets/images/source/grafana.png" />
        <span> Need to check logs?&nbsp; </span>
        <a class="text-center" href="/services/monitor">
          Go to grafana dashboard <Fa :icon="'fal chevron-right'"/>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { healthPaths, SERVICE_STATES } from "~/utils/health";
import {useHealth} from "~/composables/health/useHealth"
import { watch } from 'vue';
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
    const servicesNames = Object.keys(services)

    return {
    services,
    overallStatusText,
    overallStatus,
    getOverallStatusIconClass,
    servicesNames,
    getStatusClass

    }
  },
  // data() {
  //   return {
  //     services: {
  //       user: "loading",
  //       heka: "loading",
  //       atlas: "loading",
  //       authentication: "loading",
  //       authorisation: "loading",
  //       cache: "loading",
  //       database: "loading",
  //       smtp: "loading",
  //     },
  //   };
  // },
  // computed: {
  //   overallStatus() {
  //     const states = Object.values(this.services);
  //     if (states.some((status) => status === SERVICE_STATES.down))
  //       return SERVICE_STATES.down;
  //     else if (states.every((status) => status === SERVICE_STATES.up))
  //       return SERVICE_STATES.up;
  //     else return SERVICE_STATES.loading;
  //   },
  //   overallStatusText() {
  //     if (this.overallStatus === SERVICE_STATES.up) {
  //       return "Atlan is up and running";
  //     } else if (this.overallStatus === SERVICE_STATES.down) {
  //       return "Some services are down";
  //     } else if (this.overallStatus === SERVICE_STATES.loading) {
  //       return "Checking status";
  //     }
  //     return "";
  //   },
  //   getOverallStatusIconClass() {
  //     return this.getStatusClass(this.overallStatus);
  //   },
  // },
  // methods: {
  //   getStatusClass(status) {
  //     if (status === SERVICE_STATES.up) {
  //       return {
  //         icon:"fal check-circle",
  //         class: "animate-flipInX text-green-500",
  //       };
  //     } else if (status === SERVICE_STATES.down) {
  //       return {
  //         icon: "fal times-circle",
  //         class: "animate-tada text-red-500",
  //       };
  //     } else if (status === SERVICE_STATES.loading) {
  //       return {
  //         icon: "fal circle-notch",
  //         class: "animate-spin text-yellow-400",
  //       };
  //     }
  //     return "";
  //   },
  //   setServiceStatus(service, status) {
  //     if (service in this.services) {
  //       const servicesCopy = { ...this.services };
  //       servicesCopy[service] = status;
  //       this.services = servicesCopy;
  //     } else console.warn("Cannot set non-existent service", service, status);
  //   },
  // },
  // async fetch() {
  //   const requests = Object.values(healthPaths).map((path) =>
  //     ping(this.$axios, path)
  //   );
  //   const response = await Promise.allSettled(requests);
  //   console.log(response)

  //   response.forEach((res, idx) => {
  //     console.log(res);
  //     if (res.status === "fulfilled") {
  //       // Set the top level service as up
  //       this.setServiceStatus(Object.keys(healthPaths)[idx], SERVICE_STATES.up);
  //       const blocks =
  //         typeof res.value === "object" ? Object.keys(res.value) : [];

  //       blocks.forEach((s) => {
  //         // Set the referenced services as up
  //         this.setServiceStatus(
  //           s,
  //           res.value[s].status === "ok"
  //             ? SERVICE_STATES.up
  //             : SERVICE_STATES.down
  //         );
  //       });
  //     } else {
  //       // The top level services itself is down
  //       this.setServiceStatus(
  //         Object.keys(healthPaths)[idx],
  //         SERVICE_STATES.down
  //       );
  //     }
  //   });

  //   // Set all the unreacheable services as down
  //   Object.keys(this.services).forEach((service) => {
  //     if (this.services[service] === "loading")
  //       this.setServiceStatus(service, SERVICE_STATES.down);
  //   });
  // },
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
