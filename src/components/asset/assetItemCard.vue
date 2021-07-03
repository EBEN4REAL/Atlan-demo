<template>
  <div
    class="px-4 py-3 mb-3 bg-white rounded asset-item position-relative"
    @click="onAssetClick"
    :class="{ active: isSelected, 'cursor-pointer': isAssetAccessible }"
    :style="{ opacity: !isAssetAccessible ? 0.8 : 1 }"
  >
    <div class="w-100">
      <div class="mb-2 d-flex align-items-center">
        <div class="pr-2"><i class="font-size-h2" :class="[typeIcon]"></i></div>
        <img v-if="isAssetAccessible" :src="integrationIcon" class="integration-icon" />
        <div class="d-flex flex-column w-90">
          <nuxt-link
            v-if="isAssetAccessible"
            :to="profilePath"
            class="mb-0 asset-title hover-underline font-w700"
          >
            <span>{{ name }}</span>

            <span class="ml-2" :id="`status-icon-${asset.guid}`" v-if="statusIcon"
              ><i :class="[statusIcon]"></i
            ></span>
            <!-- <StatusDetailPopover
              :target="`status-icon-${asset.guid}`"
              placement="right"
              :asset="asset"
            /> -->
          </nuxt-link>
          <span v-else class="mb-0 asset-title font-w700">
            <span>{{ name }}</span>
            <span class="ml-2" v-if="statusIcon" v-b-popover.hover.right="statusMessage"
              ><i :class="[statusIcon]"></i
            ></span>
          </span>
          <p v-if="type === 'table' || type === 'view'" class="mb-0 font-size-sm">
            <template v-if="isAssetAccessible">
              <span
                v-b-popover.hover.bottom="
                  'Row count might be different from underlying store'
                "
                class="pr-2"
                v-if="tableRowCount"
                ><span class="font-w700">{{ rowCountString }}</span> {{ rowString }}</span
              >

              <span class="pr-2"
                ><span class="font-w700">{{ tableColumnsCount.toLocaleString() }}</span>
                {{ columnString }}</span
              >
            </template>
          </p>
          <p v-if="type === 'column'" class="mb-0 font-size-sm d-flex align-items-center">
            <template v-if="isAssetAccessible">
              <span class="pr-2"
                ><i class="text-gray-500 fa-sm" :class="columnDataTypeIcon"></i>
                <span class="font-w700 text-capitalize">{{ columnDataType }}</span></span
              >
              <a-tooltip v-if="columnIsPrimary">
                <template slot="title">Primary Key</template>
                <i class="mr-3 far fa-key text-warning" />
              </a-tooltip>
              <span class="">synced {{ lastSyncedAt }}</span>
            </template>
          </p>
          <p
            v-else-if="type === 'schema' || type === 'database' || type.startsWith('bi')"
            class="mb-0 font-size-sm d-flex align-items-center"
          >
            <template v-if="isAssetAccessible">
              <span class="">synced {{ lastSyncedAt }}</span>
            </template>
          </p>
          <p
            v-else-if="type === 'integration'"
            class="mb-0 font-size-sm d-flex align-items-center"
          >
            <span class="pr-2 mb-0">Integration</span>
          </p>
          <div
            v-else-if="formattedSql"
            class="mb-1 prism-fade-effect"
            :id="`query-preview-${asset.guid}`"
          >
            <!-- <Prism :code="formattedSql" /> -->
            <!-- <SavedQueryPopover
              :query="formattedSql"
              :target="`query-preview-${asset.guid}`"
              :placement="queryPopoverPlacement"
            /> -->
          </div>
          <div class="d-flex justify-content-between align-items-center font-size-sm">
            <div
              v-show="description && showDescription"
              class="text-ellipsis"
              v-b-popover.hover.bottom="description"
            >
              {{ description }}
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <asset-item-parents-list
          :asset="asset"
          class="pl-6 ml-1"
          :class="{ invisible: hideParentsList }"
          :qualifiedNameCharacterCountToDisplay="qualifiedNameCharacterCountToDisplay"
        ></asset-item-parents-list>
        <span
          v-if="type === 'query' && isQueryPrivate"
          class="ml-auto mr-3 text-sm bg-warning-lighter badge-pill"
          ><i style="font-size: 14px" class="text-xs far fa-lock text-warning"></i>
          Private</span
        >
        <slot name="unlinkButton"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from "vue";
// import AssetItem from "~/mixins/asset/assetItem";
// import SavedQuery from "~/mixins/savedQuery/savedQuery";
import pluralize from "pluralize";
import { getRowCountString } from "~/composables/asset/useFormat";
import { copyToClipboard } from "~/utils/clipboard";
import useAssetItemConstants from "~/composables/asset/useAssetItemConstants";
// import AssetItemParentsList from "~/components/asset/assetItemParentsList.vue";
// import Prism from "~/plugins/prism";
// import SavedQueryPopover from "~/components/savedQueries/shared/savedQueryPopover.vue";
// import StatusDetailPopover from "~/components/shared/statusDetailPopover.vue";

export default defineComponent({
  name: "AssetItemCard",

  props: {
    asset: {
      type: Object,
      default: () => ({}),
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
    qualifiedNameCharacterCountToDisplay: {
      type: Number,
      default: 70,
    },
    showDescription: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      copiedLink: false,
      queryPopoverPlacement: "bottom",
    };
  },

  setup(props, context) {
    const {
      typeNameMapping,
      iconsMappingByType,
      typeNameReadableNameMapping,

      assetTypeFilterItems,
      getNameFromType,
      getIconClassByType,
      getReadableNameFromType,
      getStatusIcon,
    } = useAssetItemConstants();

    const tableRowCount = computed(() => {
      if (props.asset && props.asset.attributes) {
        return props.attributes.rowCount || 0;
      }
      return 0;
    });
    const tableColumnsCount = computed(() => {
      if (props.asset && props.asset.attributes) {
        return props.asset.attributes.colCount || 0;
      }
      return 0;
    });

    const isAssetAccessible = computed(() => {
      if (props.asset && props.asset.guid && props.asset.guid === "-1") {
        return false;
      }
      return true;
    });
    const type = computed(() => {
      if (props.asset) {
        const typeName = props.asset.typeName || "";
        return typeNameMapping[typeName] || "";
      }
      return "table";
    });

    const integrationIcon = () => {
      if (type.value === "query" && this.integrationType) {
        return getSourceImage(this.integrationType.toLowerCase());
      }
      const qualifiedName = this.qualifiedName
        ? JSON.parse(JSON.stringify(this.qualifiedName))
        : "";
      const qualifiedNameParts = qualifiedName.split("/");
      if (this.isMultiTenant && qualifiedNameParts.length) {
        qualifiedNameParts.splice(0, 1);
      }
      const integration = qualifiedNameParts.length ? qualifiedNameParts[0] : "";
      return getSourceImage(integration);
    };

    const columnString = computed(() => {
      return pluralize("column", tableColumnsCount);
    });
    const rowCountString = computed(() => {
      return getRowCountString(tableRowCount);
    });
    const rowString = computed(() => {
      return pluralize("row", tableRowCount);
    });
    const hideParentsList = computed(() => {
      if (type.value === "query") {
        if (props.asset.attributes) {
          if (!props.asset.attributes.tableQualifiedName) {
            return true;
          }
        }
      }
      return false;
    });

    const profilePath = computed(() => {
      if (type.value === "query") {
        const { table } = props.asset.attributes;
        return `/a/${table}/query/?queryId=${props.asset.guid}`;
      }
      return `/a/${props.asset.guid}/overview`;
    });

    const onAssetClick = () => {
      console.log("onAssetClick -> onAssetClick", props.asset);
      context.emit("selectAsset", props.asset);
    };

    return {
      columnString,
      rowCountString,
      rowString,
      hideParentsList,
      profilePath,
      onAssetClick,
      isAssetAccessible,
      tableRowCount,
      tableColumnsCount,
    };
  },
});
</script>

<style lang="less" scoped>
.asset-item {
  border: 1px solid #e8e8f8;
  transition: box-shadow 200ms ease-out;
  .asset-title {
    color: $primary;
    opacity: 0.8;
    letter-spacing: 0.0225rem;
    font-size: 1rem;
    -ms-word-break: break-all;
    word-break: break-all;
    word-break: break-word;
    -webkit-hyphens: auto;
    -ms-hyphens: auto;
    hyphens: auto;
    &.disabled {
      color: $dark;
      text-decoration: none;
      pointer-events: none;
    }
  }
  .integration-icon-image {
    height: 1rem;
  }
  &:hover {
    // transform: translateY(-2px);
    // box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  }
  &.active {
    transition: box-shadow 200ms ease-in;
    opacity: 1;
    // border: 2px solid #e8e8f8;
    box-shadow: 0 0.2rem 0.3rem rgba(0, 0, 0, 0.1);
  }
  .integration-icon {
    height: 1.25rem;
    position: absolute;
    top: 1rem;
    right: 1.25rem;
  }
  .asset-qf {
    display: block;
    width: 95%;
    overflow: overlay;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.prism-fade-effect {
  position: relative;
  max-height: 2.6rem;
  overflow-y: hidden;
  overflow-x: hidden;
  background: #fff;
  z-index: 1;
  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 30%;
    background: -webkit-gradient(
      linear,
      left bottom,
      left top,
      color-stop(0, #fff),
      color-stop(1, rgba(255, 255, 255, 0))
    );
  }
}
</style>
