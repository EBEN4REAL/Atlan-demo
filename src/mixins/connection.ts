import { defineComponent } from "vue";
import { Components } from "~/api/atlas/client";
import { SourceList } from "~/constant/source";
import { useStore } from "~/store";
import { AtlanConnectionAttributes, AtlanTableAttributes } from "~/types/asset";

export default defineComponent({
  methods: {
    attributes(item) {
      return item?.attributes || {};
    },
    title(item): string {
      return this.attributes(item)?.displayName;
    },
    integrationName(item) {
      return this.attributes(item)?.integrationName || "";
    },
    connectionList() {
      const store = useStore();
      return store.getters.getConnectionList || [];
    },
    logo(item) {
      console.log(item);
      let found = SourceList.find((src) => src.id == this.integrationName(item));
      console.log(found);
      return found?.image;
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
