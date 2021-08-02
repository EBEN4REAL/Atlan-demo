import { TreeDataItem } from "ant-design-vue/lib/tree/Tree";
import { SourceList } from "~/constant/source";

import { ConnectionType } from "~/types/atlas/connection";
import { Getters } from "./getters";
import { State, Status } from "./state";

export interface Actions extends State, Getters {
  setData(data: any): void;
  getFilteredTreeList(): void;
  setStatus(status: Status): void;
}

export const actions: Actions = {
  setData(data) {
    this.data = data;
  },
  setStatus(status) {
    this.status = status;
  },
  getFilteredTreeList() {
    const treeData: TreeDataItem[] = [];

    console.log(this.getSourceList);

    return this.getSourceList;
    // watch(list, () => {
    //   treeData.value = [];
    //   sourceList.value?.forEach((src) => {
    //     let children = list.value?.filter((item) => {
    //       return item.attributes.integrationName === src.id;
    //     }).map((item) => {
    //       return {
    //         key: item.guid,
    //         title: item.attributes.displayName || item.attributes.name,
    //         type: "connection"
    //       };
    //     });

    //     children = children?.sort((a, b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0))
    //     let found = SourceList.find((item) => item.id == src.id)
    //     treeData.value.push({
    //       key: src.id,
    //       title: src.label,
    //       children: children,
    //       count: children?.length,
    //       image: found?.image,
    //       type: "connector",
    //       isRoot: true,
    //     });
    //   });
    // });
  }
};
