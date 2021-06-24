import { watch, toRaw } from "vue";
import { Classification } from "~/api/atlas/classification";
import { Getters } from "./getters";
import { State } from "./state";

export interface Actions extends State, Getters {
  getClassifications(): void;
  resetClassifications(): void;
  setClassifications(params: any): void;
  filterClassificationTree(searchText: any): void;
  createClassification(payload: any): any;
  updateClassificationListById(params: any): void;
  deleteClassificationByName(classificationName: any): void;
  updateClassificationTree(tree: any): void;
  setClassificationStatus(status: any): void;
}

export const actions: Actions = {
  getClassifications() {
    this.classificationsStatus = "loading";

    const {
      data: classificationData,
      error: classificationError,
    } = Classification.getClassificationList({ cache: false });

    watch([classificationData, classificationError], () => {
      console.log(classificationData, classificationError);
      if (classificationData.value) {
        let classifications = classificationData.value.classificationDefs || [];
        classifications = classifications.map((classification) => {
          classification.alias = classification.name;
          return classification;
        });
        console.log("getClassifications -> classifications", classifications);
        this.classifications = classifications || [];
        const classificationTree = this.transformClassificationTreeData;
        console.log(classificationTree, "classifciation Tree");
        this.classificationTree = classificationTree || [];
        this.filteredClassificationTree = classificationTree || [];
        this.classificationsStatus = "success";
      } else {
        this.classificationsStatus = "error";
      }
    });
  },
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
  createClassification(payload) {
    const ctx = this;
    return new Promise((resolve, reject) => {
      ctx.createClassificationStatus = "loading";
      const {
        data: createClassificationData,
        error: createClassificationError,
      } = Classification.createClassification({ cache: false, payload });

      watch([createClassificationData, createClassificationError], () => {
        console.log(createClassificationData, createClassificationError);
        if (createClassificationData.value) {
          let classifications =
            createClassificationData.value.classificationDefs || [];
          classifications = [...ctx.classifications, ...classifications];
          classifications = classifications.map((classification: any) => {
            classification.alias = classification.name;
            return classification;
          });
          console.log("getClassifications -> classifications", classifications);
          ctx.classifications = classifications || [];
          const classificationTree = ctx.transformClassificationTreeData;
          console.log(classificationTree, "classifciation Tree");
          ctx.classificationTree = classificationTree || [];
          ctx.createClassificationStatus = "success";
          resolve(true);
        } else {
          ctx.createClassificationStatus = "error";
          reject(toRaw(createClassificationError.value));
        }
      });
    });
  },
  updateClassificationListById(params) {
    const ctx = this;
    return new Promise((resolve, reject) => {
      ctx.updateClassificationStatus = "loading";
      const {
        data: updateClassificationData,
        error: updateClassificationError,
      } = Classification.updateClassification({ cache: false, params });

      watch([updateClassificationData, updateClassificationError], () => {
        console.log(updateClassificationData, updateClassificationError);
        if (updateClassificationData.value) {
          const classificationObject: any = updateClassificationData;
          const classification =
            classificationObject &&
            classificationObject.value.classificationDefs &&
            classificationObject.value.classificationDefs.length &&
            classificationObject.value.classificationDefs[0]
              ? classificationObject.value.classificationDefs[0]
              : {};
          const classificationIndex = this.classifications.findIndex(
            (c: any) => c.guid === classification.guid
          );
          if (classificationIndex === -1) {
            return;
          }
          this.classifications[classificationIndex] = classification;
          this.classifications = [...this.classifications];
          const classificationTree = this.transformClassificationTreeData;
          this.classificationTree = classificationTree;
          ctx.updateClassificationStatus = "success";
          resolve(true);
        } else if (updateClassificationError.value) {
          ctx.updateClassificationStatus = "error";
          reject(toRaw(updateClassificationError.value));
          console.log(updateClassificationError.value);
        }
      });
    });
  },
  deleteClassificationByName(classificationName) {
    const { data, error, isLoading } = Classification.archiveClassification({
      cache: false,
      classificationName,
    });
    const ctx = this;
    ctx.deleteClassificationStatus = "loading";
    return new Promise((resolve, reject) => {
      watch([data, error], () => {
        if (!error.value) {
          ctx.deleteClassificationStatus = "success";
          resolve(true);
        } else {
          ctx.deleteClassificationStatus = "error";
          reject(toRaw(error.value));
        }
      });
    });
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
