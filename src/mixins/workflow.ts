import { defineComponent, getCurrentInstance, PropType } from "vue";
import { Components } from "~/api/atlas/client";
import { useStore } from "~/store";
import { AtlanTableAttributes } from "~/types/asset";

export default defineComponent({
  methods: {
    name(item: any): string {
      return item.metadata?.name;
    },
    creationTimestamp(item: any) {
      return item.metadata?.creationTimestamp;
    },
    labels(item: any) {
      return item.metadata?.labels;
    },
    phase(item: any) {
      return item.status?.phase;
    },
    startedAt(item: any) {
      return item.status?.startedAt;
    },
    finishedAt(item: any) {
      return item.status?.finishedAt;
    },
    connectionQualifiedName(item: any) {
      return this.labels(item)["connection-qualified-name"];
    },
    botName(item: any) {
      return this.labels(item)["bot-template-name"];
    },
  },
});
