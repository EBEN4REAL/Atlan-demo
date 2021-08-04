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
        <a-tooltip placement="left" :title="startedAt(false)">
          <fa icon="fal hourglass-start" class="mr-1 pushtop"></fa
          >{{ startedAt(true) }} ago
        </a-tooltip>
        <a-tooltip
          v-if="finishedAt(true)"
          placement="left"
          :title="finishedAt(false)"
        >
          <fa icon="fal hourglass-end" class="mr-1 pushtop"></fa
          >{{ finishedAt(true) }} ago
        </a-tooltip>
      </div>
    </td>

    <td class="text-xs text-gray-500" style="min-width: 160px">
      {{ duration(item) }}
      <a-progress
        v-if="phase == 'Running'"
        :percent="progressPercent(item)"
        size="small"
      >
        <template #format="percent, successPercent">
          {{ progress(item) }}
        </template>
      </a-progress>
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
            <a-menu-item key="3" class="text-red-500">Stop Run</a-menu-item>
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
import { SourceList } from "~/constant/source";
import WorkflowMixin from "~/mixins/workflow";
import { useConnectionsStore } from "~/store/connections";

import titlecase from "~/utils/titlecase";

dayjs.extend(relativeTime);

export default defineComponent({
  components: {},
  mixins: [WorkflowMixin],
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
    const phase = computed(() => props.item?.status?.phase);

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

    const category = computed(() => (
        titleCase(props.item?.metadata?.labels.category, " ") ||
        props.item.metadata.name
      ));

    const creator = computed(() => (
        props.item?.metadata?.labels["created-by"] ||
        props.item?.metadata?.labels["workflows.argoproj.io/creator"]
      ));

    const startedAt = (relative: boolean) => {
      if (props.item.status.startedAt) {
        if (relative) {
          return dayjs().from(props.item.status.startedAt, true);
        }
        return dayjs(props.item.status.startedAt).format(
          "dddd MMMM D YYYY HH:mm:ss"
        );
      }
      return "";
    };
    const finishedAt = (relative: boolean) => {
      if (props.item.status.finishedAt) {
        if (relative) {
          return dayjs().from(props.item.status.finishedAt, true);
        }
        return dayjs(props.item.status.finishedAt).format(
          "dddd MMMM D YYYY HH:mm:ss"
        );
      }

      return "";
    };

    const isCron = computed(() => {
      if (props.item?.metadata?.labels["workflows.argoproj.io/cron-workflow"]) {
        return true;
      }
      return false;
    });

    const store = useConnectionsStore();

    const connectionDisplayName = computed(() => {
      const guid = props.item?.metadata?.labels["connection-guid"];
      if (guid) {
        return (
          store.getList.find((item) => item.guid == guid)?.attributes
            .displayName || ""
        );
      }
      return "";
    });

    const connectionImage = computed(() => {
      const guid = props.item?.metadata?.labels["connection-guid"];
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
