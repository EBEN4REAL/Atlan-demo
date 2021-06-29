import { Getters } from "./getters";
import { State } from "./state";

export interface Actions extends State, Getters {
  resetClassifications(): void;
  setClassifications(params: any): void;
  filterClassificationTree(searchText: any): void;
  deleteClassificationByName(classificationName: any): void;
  updateClassificationTree(tree: any): void;
  initializeFilterTree(): void;
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
  deleteClassificationByName(classificationName) {
    const classifications = this.classifications;
    const filteredClassifications = classifications.filter(
      (classification: any) => classification.name !== classificationName
    );
    this.classifications = filteredClassifications;
    const classificationTree = this.transformClassificationTreeData;
    this.classificationTree = classificationTree;
    this.filteredClassificationTree = filteredClassifications;
  },
  updateClassificationTree(tree) {
    this.classificationTree = tree;
  },
  filterClassificationTree(searchText: string) {
    const tree = this.getFilteredClassificationsBySeach(searchText);
    this.filteredClassificationTree = tree;
  },
};
