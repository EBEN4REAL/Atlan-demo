import { Getters } from "./getters";
import { State } from "./state";

export interface Actions extends State, Getters {
  resetClassifications(): void;
  setClassifications(params: any): void;
  addClassifications(classification: any): void;
  setClassificationsStatus(status: string): void;
  filterClassificationTree(searchText: any): void;
  deleteClassificationByName(classificationName: any): void;
  updateClassificationTree(tree: any): void;
  initializeFilterTree(): void;
}

export const actions: Actions = {
  addClassifications(classification) {
    const classifications = this.classifications;
    this.classifications = [...classifications, ...classification];
    this.classifications = this.sortClassifications("asc");
  },
  resetClassifications() {
    this.classifications = [];
    this.classificationTree = [];
    this.fetchClassificationsStatus = "";
  },
  setClassifications(list) {
    try {
      this.classifications = list;
      this.classifications = this.sortClassifications("asc");
      const classificationTree = this.transformClassificationTreeData;
      this.classificationTree = classificationTree || [];
      this.filteredClassificationTree = this.classificationTree;
    } catch (error) {
      console.log("WTF: setClassifications -> error", error);
    }
  },
  setClassificationsStatus(status) {
    this.fetchClassificationsStatus = status;
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
    this.classifications = this.sortClassifications("dsc");
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
