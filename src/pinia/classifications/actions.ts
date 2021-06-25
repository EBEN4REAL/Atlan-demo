import { Getters } from "./getters";
import { State } from "./state";

export interface Actions extends State, Getters {
  resetClassifications(): void;
  setClassifications(params: any): void;
  filterClassificationTree(searchText: any): void;
  updateClassificationTree(tree: any): void;
  setClassificationStatus(status: any): void;
  initializeFilterTree(status: any): void;
}

export const actions: Actions = {
  resetClassifications() {
    this.classifications = [];
    this.classificationTree = [];
    this.classificationsStatus = "";
  },
  setClassifications(list) {
    try {
      this.classifications = list;
      const classificationTree = this.transformClassificationTreeData;
      this.classificationTree = classificationTree || [];
    } catch (error) {
      console.log("WTF: setClassifications -> error", error);
    }
  },
  initializeFilterTree() {
    this.filteredClassificationTree = this.classificationTree;
  },
  updateClassificationTree(tree) {
    this.classificationTree = tree;
  },
  setClassificationStatus(status) {
    this.classificationsStatus = status || "";
  },
  filterClassificationTree(searchText: string) {
    const tree = this.getFilteredClassificationsBySeach(searchText);
    this.filteredClassificationTree = tree;
  },
};
