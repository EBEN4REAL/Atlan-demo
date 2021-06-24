<template>
  <span v-if="isAssetAccessible" class="font-size-sm">
    <span
      v-if="
        !assetParents.length &&
          !checkIfAssetIntegrationOrServer &&
          asset.typeName !== 'AtlasGlossary'
      "
      class="p-1 mb-0 cursor-pointer asset-qf d-flex align-items-start"
      v-b-popover.hover.bottom="
        copiedLink
          ? 'Identifier copied!'
          : `Asset unique identifier: ${qualifiedName}`
      "
      ref="copyLink"
      :aria-label="qualifiedName"
    >
      <i class="pt-1 mr-2 far fa-code-branch"></i>
      <span>
        {{
          qualifiedName.length >
          (longQualifiedName ? 200 : qualifiedNameCharacterCountToDisplay)
            ? qualifiedName.substring(
                0,
                longQualifiedName ? 200 : qualifiedNameCharacterCountToDisplay
              )
            : qualifiedName
        }}
        {{
          qualifiedName.length >
          (longQualifiedName ? 200 : qualifiedNameCharacterCountToDisplay)
            ? "..."
            : ""
        }}
      </span>
    </span>
    <span
      v-else-if="asset.typeName === 'AtlasGlossary'"
      class="p-0 mb-0 cursor-pointer asset-qf d-flex align-items-start"
    >
      <nuxt-link :to="`/glossary/${this.asset.guid}`">
        <i class="pt-1 mr-2 far fa-certificate text-pink"></i>
        <span>
          {{
            name.length >
            (longQualifiedName ? 200 : qualifiedNameCharacterCountToDisplay)
              ? name.substring(
                  0,
                  longQualifiedName ? 200 : qualifiedNameCharacterCountToDisplay
                )
              : name
          }}
          {{
            name.length >
            (longQualifiedName ? 200 : qualifiedNameCharacterCountToDisplay)
              ? "..."
              : ""
          }}
        </span>
      </nuxt-link>
    </span>
    <span v-else-if="assetParents.length && !checkIfAssetIntegrationOrServer">
      <nuxt-link
        v-if="showIntegrationDetails"
        :to="getNuxtUrl(integrationType, sources)"
      >
        <img :src="integrationIcon" class="integration-icon" />
        <span class="pl-1 pr-2 text-hover-primary color-gray">
          {{ integrationTypeName.toLowerCase() }}
        </span>
      </nuxt-link>
      <span
        v-for="(parent, index) in assetParents"
        :key="index"
        class="padding-left-asset-tag"
        :class="[
          `${
            isAssetParentSelectable ? 'text-hover-primary cursor-pointer' : ''
          }`,
          index === assetParents.length - 1 ? 'mr-0' : 'mr-2',
        ]"
        @click="
          isAssetParentSelectable && getEntityByQualifiedName(parent.parentType)
        "
        v-b-popover.hover.bottom="
          showTypeInPopover ? `${parent.parentType}` : ''
        "
      >
        <i
          class="pr-1 cursor-pointer font-size-xs"
          :class="`${parent.icon}`"
        ></i>
        <span v-if="showTypeWithName" class="font-w700"
          >{{ parent.parentType }} :
        </span>
        <span v-if="showTruncatedString">{{
          formattedString(`${parent.parent}`)
        }}</span>
        <span v-else> {{ `${parent.parent}` }} </span>
        <br
          v-if="
            moveLastParentToNewLine &&
              assetParents.length >= 3 &&
              index === assetParents.length - 2
          "
        />
      </span>
    </span>
  </span>
  <span
    v-else
    class="font-size-sm"
    v-b-popover.hover.bottom="
      `It seems you do not have access to this ${type}. Request your admin to give
                  you access.`
    "
  >
    <i class="mr-1 far fa-lock-alt"></i> Access Restricted
  </span>
</template>

<script>
import AssetItem from "~/mixins/asset/assetItem";
import ClipboardJS from "~/plugins/clipboard";
import { truncateStringInMiddle } from "~/utils/format";
import { mapState } from "vuex";

export default {
  name: "AssetItemParentsList",

  mixins: [AssetItem],

  props: {
    asset: {
      type: Object,
      default: () => ({}),
    },
    isAssetParentSelectable: {
      type: Boolean,
      default: false,
    },
    longQualifiedName: {
      type: Boolean,
      default: false,
    },
    qualifiedNameCharacterCountToDisplay: {
      type: Number,
      default: 70,
    },
    showTypeWithName: {
      type: Boolean,
      default: false,
    },
    showTypeInPopover: {
      type: Boolean,
      default: true,
    },
    showTruncatedString: {
      type: Boolean,
      default: false,
    },
    showIntegrationDetails: {
      type: Boolean,
      default: false,
    },
    moveLastParentToNewLine: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      copiedLink: false,
    };
  },
  computed: {
    ...mapState({
      sources: (state) => state.source.sources,
    }),
  },
  mounted() {
    this.initClipboard();
  },
  methods: {
    formattedString(str) {
      return truncateStringInMiddle(str, 17);
    },
    initClipboard() {
      if (this.$refs.copyLink) {
        this.copyAlias = new ClipboardJS(this.$refs.copyLink, {
          text: (trigger) => trigger.getAttribute("aria-label"),
        });
        this.copyAlias.on("success", (e) => {
          this.copiedLink = true;
          setTimeout(() => {
            this.copiedLink = false;
          }, 1500);
          e.clearSelection();
        });
        this.copyAlias.on("error", (e) => {
          console.error("Action:", e.action);
          console.error("Trigger:", e.trigger);
        });
      }
    },
    async getEntityByQualifiedName(entityType) {
      if (this.isAssetParentSelectable) {
        const entityQualifiedName =
          (
            (this.qualifiedName.split("/") || []).splice(
              0,
              this.qualifiedName.split("/").length -
                (this.getAssetHeirarchyOrderDifference(entityType) || 1)
            ) || []
          ).join("/") || "";
        this.$router.push(`/a/guid?qualifiedName=${entityQualifiedName}`);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.color-gray {
  color: #6c757d;
}
.integration-icon {
  height: 0.85rem;
}
.asset-qf {
  -ms-word-break: break-all;
  word-break: break-all;
}
.padding-left-asset-tag {
  padding-left: 0.1rem !important;
}
</style>
