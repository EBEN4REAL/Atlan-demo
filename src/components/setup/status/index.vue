<template>
  <div class="text-center px-10">
    <div class="mb-2">
      <fa
        v-if="status === 'success'"
        icon="fas check-circle"
        class="text-green-400 text-7xl"
        :class="$style.animatedicon"
      ></fa>
      <a-spin
        size="large"
        class="text-gray-500"
        v-if="status === 'loading'"
      /><span class="text-xl ml-3"></span>
    </div>
    <div class="">
      <p class="mb-0 text-gray-500">
        Securely saving your credentials, setting up connectivity and starting
        your metadata refresh
      </p>

      <div ref="animationPoint" class="flex items-center mb-3 mt-2">
        <img :src="logo(item)" class="mr-2" alt="Image" />

        <a-progress
          :stroke-color="{
            from: '#eee',
            to: '#eee',
          }"
          :show-info="false"
          :percent="0"
          status="active"
        />
        <img class="ml-2" alt="Image" />
      </div>
    </div>
  </div>
</template>
    <script lang="ts">
import { defineComponent } from "vue";
import ConnectorMixin from "~/mixins/connector";

export default defineComponent({
  components: {},
  mixins: [ConnectorMixin],
  props: {
    item: {
      type: Object,
      required: false,
      default(): any {
        return {};
      },
    },
    status: {
      type: String,
      required: false,
      default(): any {
        return "loading";
      },
    },
    statusMessage: {
      type: String,
      required: false,
      default(): any {
        return "";
      },
    },
  },
  data() {
    return {};
  },
  methods: {},
});
</script>

<style lang="less" module>
.animatedicon {
  animation: icon 0.5s cubic-bezier(0.895, 0.03, 0.685, 0.22) forwards;
}

@keyframes icon {
  from {
    opacity: 0;
    transform: scale(0.3);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>