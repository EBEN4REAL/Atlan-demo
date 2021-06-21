import { GetterTree } from "vuex";

// eslint-disable-next-line import/no-cycle
import { RootState } from "~/store";

import { State } from "./state";

export type Getters = {
  transformClassificationTreeData(state: State): any;
  getClassificationTree(state: State): any;
  getFilteredClassifications(state: State): any;
};
const RESTRICTED_CLASSIFICATION_PREFIX = "atlan_";

const orderTreeNodesAsc = (node0, node1) => {
  const compareStrings = (a, b) => {
    // Assuming you want case-insensitive comparison
    // eslint-disable-next-line no-param-reassign
    a = a.toLowerCase();
    // eslint-disable-next-line no-param-reassign
    b = b.toLowerCase();

    // eslint-disable-next-line no-nested-ternary
    return a < b ? -1 : a > b ? 1 : 0;
  };
  return compareStrings(node0.title, node1.title);
};

export const getters: GetterTree<State, RootState> & Getters = {
  transformClassificationTreeData: (state) => {
    // each classification has a unique name, create a hashmap with name for O(1) access
    const hashMap = {};
    state.classifications.forEach((item) => {
      hashMap[item.name] = item;
    });
    //
    const getClassificationNodeObj = (classification) => {
      return {
        title: classification.displayName || classification.name,
        name: classification.displayName || classification.name,
        key: classification.guid,
        data: {
          ...classification,
          type: "classification",
        },
      };
    };

    // resolves children recursively looking at the hashmap
    const getResolvedChildren = (nameArr) => {
      const children = nameArr
        .filter((name) => typeof hashMap[name] !== "undefined")
        .map((name) => {
          const classificationObj = hashMap[name];
          const nodeObj = getClassificationNodeObj(classificationObj);
          if (classificationObj.subTypes) {
            const subTypeChilds = getResolvedChildren(
              classificationObj.subTypes
            );
            if (subTypeChilds.length) {
              nodeObj.children = subTypeChilds;
            }
          }
          return nodeObj;
        });
      children.sort(orderTreeNodesAsc);
      return children;
    };
    const transformedClassifications = state.classifications.reduce(
      (treeData, classification) => {
        if (classification.superTypes.length) {
          return treeData;
        }
        // don't show classifications with name starting with atlan_ - this are internal classifications used by us
        if (
          classification.name
            .toLowerCase()
            .startsWith(RESTRICTED_CLASSIFICATION_PREFIX)
        ) {
          return treeData;
        }

        // To plugin children uncomment the code
        const nodeObj = getClassificationNodeObj(classification);
        // if (classification.subTypes.length) {
        //   const children = getResolvedChildren(classification.subTypes);
        //   if (children.length) {
        //     nodeObj.children = children;
        //   }
        // }
        treeData.push(nodeObj);
        return treeData;
      },
      []
    );
    transformedClassifications.sort(orderTreeNodesAsc);
    return transformedClassifications;
  },
  getClassificationTree: (state) => {
    return state.classificationTree;
  },
  getFilteredClassificationsBySeach: (state) => (searchText: string) => {
    return state.classifications.filter((classification: any) =>
      classification.title.includes(searchText)
    );
  },
  getFilteredClassifications: (state) => {
    return state.classifications.filter(
      (obj) =>
        !obj.name.toLowerCase().startsWith(RESTRICTED_CLASSIFICATION_PREFIX)
    );
  },
};
