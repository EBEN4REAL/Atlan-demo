import { defineComponent, PropType } from "vue";
import { Components } from "~/api/atlas/client";
import { useStore } from "~/store";
import { AtlanTableAttributes } from "~/types/asset";
import dayjs from "dayjs";


import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { SourceList } from "~/constant/source";
import { AssetTypeList } from "~/constant/assetType";
import { dataTypeList } from "~/constant/datatype";


export default defineComponent({
  methods: {
    attributes(item: any) {
      return item.attributes;
    },
    dataType(item: any) {
      return this.attributes(item)?.dataType;
    },
    dataTypeImage(item: any) {
      const found = dataTypeList.find((d) => {
        return d.type.includes(this.dataType(item));
      });
      return found?.image;
    },
    title(item: any): string {
      return this.attributes(item)?.name;
    },
    status(item: any): string {
      return this.attributes(item)?.assetStatus;
    },
    assetType(item: any) {
      const store = useStore();
      return item.typeName;
    },
    description(item: any): string {
      return (
        this.attributes(item)?.userDescription ||
        this.attributes(item)?.description
      );
    },
    rowCount(item: any, format?: any): any {
      if (format) {
        return new Intl.NumberFormat("en-US", {
          maximumSignificantDigits: 3,
        }).format(this.attributes(item)?.rowCount);
      }
      return this.attributes(item)?.rowCount;
    },
    columnCount(item: any, format?: any): any {
      if (format) {
        return new Intl.NumberFormat("en-US", {
          maximumSignificantDigits: 3,
        }).format(this.attributes(item)?.columnCount);
      }
      return this.attributes(item)?.columnCount;
    },
    createdAt(item, relative) {
      if (relative) {
        return dayjs().from(this.attributes(item)?.__timestamp, true);
      }
      return dayjs(this.attributes(item)?.__timestamp).format(
        "MMM D, YYYY h:mm A"
      );
    },
    createdBy(item) {
      return this.attributes(item)?.__createdBy;
    },
    updatedBy(item) {
      return this.attributes(item)?.__modifiedBy;
    },
    updatedAt(item, relative) {
      if (relative) {
        return dayjs().from(
          this.attributes(item)?.__modificationTimestamp,
          true
        );
      }
      return dayjs(this.attributes(item)?.__modificationTimestamp).format(
        "MMM D, YYYY h:mm A"
      );
    },
    connectionLastSyncedAt(item, relative) {
      if (relative) {
        return dayjs().from(
          this.attributes(item)?.connectionLastSyncedAt,
          true
        );
      }
      return dayjs(this.attributes(item)?.connectionLastSyncedAt).format(
        "MMM D, YYYY h:mm A"
      );
    },
    logo(item: any): string {
      let img = "";
      let found = SourceList.find(
        (src) => src.id === this.attributes(item).integrationName
      );
      if (found) {
        img = found.image;
      }
      return img;
    },
    integrationName(item: any): string {
      return this.attributes(item)?.integrationName
    },
    relationshipList(item: any) {
      const found = AssetTypeList.find((a) => a.id == item.typeName);

      const temp = [];
      if (found) {
        const filtered = AssetTypeList.filter((a) =>
          found.parents?.includes(a.id)
        );

        filtered.forEach((f) => {
          temp.push({
            ...f,
            qualifiedName: this.attributes(item)[f.qualifiedNameAttribute],
            value: this.attributes(item)[f.nameAttribute],
          });
        });
      }

      return temp;
    },
  },
});
