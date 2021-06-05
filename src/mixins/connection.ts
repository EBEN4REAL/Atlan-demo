import { defineComponent, getCurrentInstance, PropType } from "vue";
import { Components } from "~/api/atlas/client";
import { useStore } from "~/store";
import { AtlanConnectionAttributes, AtlanTableAttributes } from "~/types/asset";

export default defineComponent({
  methods: {
    attributes(item) {
      return item?.attributes || {};
    },
    title(item): string {
      return this.attributes(item)?.name;
    },
    integrationName(item) {
      return this.attributes(item)?.integrationName || "";
    },
    connectionList() {
      const store = useStore();
      return store.getters.getConnectionList || [];
    },
    sourceList() {
      return [
        ...new Set(
          this.connectionList().map((item) => this.integrationName(item))
        ),
      ];
    },
  },
});
