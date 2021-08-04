<template>
  <tr class="bg-white border-b border-gray-200">
    <td class="w-3 pr-0">
      <div class="flex items-center align-middle">
        <a-tooltip :title="phase" placement="left">
          <fa
            v-if="phase == 'Succeeded'"
            icon="fas check-circle"
            class="text-xl text-green-500"
          ></fa>
          <fa
            v-else-if="phase == 'Failed' || phase === 'Error'"
            icon="fas exclamation-triangle"
            class="text-xl text-red-500"
          ></fa>
          <a-spin v-else-if="phase == 'Running'"></a-spin>

          <fa
            v-else
            icon="fas exclamation-circle"
            class="text-xl text-yellow-500"
          ></fa>
        </a-tooltip>
      </div>
    </td>
    <td class="">
      <div class="flex flex-col align-middle">
        <p class="mb-1 tracking-wide text-gray-700">
          {{ category }}
        </p>

        <div class="flex">
          <img :src="connectionImage" class="w-4 h-auto mr-1" />
          <p class="mb-0 text-sm leading-none text-gray-700">
            {{ connectionDisplayName }}
          </p>

          <!-- <p class="mb-0 text-gray-400" >{{ item.name }}</p> -->
        </div>
      </div>
    </td>
    <td class="text-gray-500" style="min-width: 50px">
      <a-tooltip title="Scheduled" placement="left">
        <fa v-if="isCron" icon="fal calendar-alt"></fa>
      </a-tooltip>
    </td>
    <td class="text-xs text-gray-500" style="min-width: 140px">
      <div class="flex flex-col space-y-1">
        <a-tooltip
          v-if="finishedAt(true)"
          placement="left"
          :title="finishedAt(false)"
        >
          <fa icon="fal hourglass-end" class="mr-1 pushtop"></fa
          >{{ finishedAt(true) }} ago
        </a-tooltip>
        <a-tooltip placement="left" :title="startedAt(false)">
          <fa icon="fal hourglass-start" class="mr-1 pushtop"></fa
          >{{ startedAt(true) }} ago
        </a-tooltip>
      </div>
    </td>

    <td class="text-xs text-gray-500" style="min-width: 160px">
      {{ duration }}
    </td>

    <td class="text-xs text-gray-500">
      <p class="mb-0">{{ creator }}</p>
    </td>
    <td class="text-gray-500">
      <a-dropdown>
        <template #overlay>
          <a-menu>
            <a-menu-item key="1">Details</a-menu-item>
            <a-menu-item key="1">View Logs</a-menu-item>
            <a-menu-item key="2">View Metrics</a-menu-item>
            <a-menu-divider></a-menu-divider>
            <a-menu-item key="3" class="text-red-500">Restart</a-menu-item>
          </a-menu>
        </template>
        <a-button>
          Actions
          <fa icon="fal chevron-down" class="ml-1 text-sm"></fa>
        </a-button>
      </a-dropdown>
    </td>
  </tr>
</template>

<script lang="ts">
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { defineComponent, computed } from "vue";

import { useConnectionsStore } from "~/store/connections";

dayjs.extend(relativeTime);

export default defineComponent({
  components: {},
  props: {
    item: {
      type: Object,
      required: false,
      default(): any {
        return {};
      },
    },
  },
  setup(props) {
    const phase = computed(() => props.item?.phase);

    const titleCase = (text: string, delimiter: string) => {
      if (text) {
        return text
          .split(delimiter)
          .map(
            (word: string) =>
              `${word.charAt(0).toUpperCase()}${word.substr(1).toLowerCase()}`
          )
          .join(delimiter);
      }
      return text;
    };

    const category = computed(() => titleCase(props.item?.labels.category, " ") || props.item.name);

    const creator = computed(() => (
        props.item?.labels["created-by"] ||
        props.item?.labels["workflows.argoproj.io/creator"]
      ));

    const startedAt = (relative: boolean) => {
      if (props.item.started_at) {
        if (relative) {
          return dayjs().from(props.item.started_at, true);
        }
        return dayjs(props.item.started_at).format("dddd MMMM D YYYY HH:mm:ss");
      }
      return "";
    };
    const finishedAt = (relative: boolean) => {
      if (props.item.finished_at) {
        if (relative) {
          return dayjs().from(props.item.finished_at, true);
        }
        return dayjs(props.item.finished_at).format(
          "dddd MMMM D YYYY HH:mm:ss"
        );
      }

      return "";
    };

    const isCron = computed(() => {
      if (props.item?.labels["workflows.argoproj.io/cron-workflow"]) {
        return true;
      }
      return false;
    });

    const duration = computed(() => {
      if (props.item?.started_at && props.item?.finished_at) {
        const sec = dayjs(props?.item?.finished_at).diff(
          props.item?.started_at,
          "second"
        );
        return `${Math.floor(sec / 60)} mins, ${sec % 60} seconds`;
      }
    });

    const store = useConnectionsStore();

    const connectionDisplayName = computed(() => {
      const guid = props.item?.labels["connection-guid"];
      if (guid) {
        return (
          store.getList.find((item) => item.guid == guid)?.attributes
            .displayName || ""
        );
      }
      return "";
    });

    const connectionImage = computed(() => {
      const guid = props.item?.labels["connection-guid"];
      if (guid) {
        console.log(guid);

        const integrationName = store.getList.find((item) => item.guid === guid)
          ?.attributes.integrationName;
        console.log(integrationName);
        return store.getImage(integrationName) || "";
      }

      return "";
    });

    return {
      phase,
      category,
      connectionDisplayName,
      creator,
      isCron,
      startedAt,
      finishedAt,
      duration,
      connectionImage,
    };
  },
});
</script>

<style lang="less" scoped>
.table td,
.table th {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
}
</style>
