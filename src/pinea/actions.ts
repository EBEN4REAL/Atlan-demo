import { watch } from "vue";
import { Classification } from "~/api/atlas/classification";
// import { useClassificationStore } from "~/pinea";

export interface Actions {
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
    try {
      this.createClassificationStatus = "loading";

      const {
        data: classificationData,
        error: classificationError,
      } = Classification.getClassificationList({ cache: false });

      watch([classificationData, classificationError], () => {
        console.log(classificationData, classificationError);
        if (classificationData.value) {
          let classifications =
            classificationData.value.classificationDefs || [];
          classifications = classifications.map((classification) => {
            classification.alias = classification.name;
            return classification;
          });
          console.log("getClassifications -> classifications", "boi");
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
    } catch (err) {
      this.classificationsStatus = "error";
    }
  },
  resetClassifications() {
    this.classifications = classifications || [];
    this.classificationTree = classificationTree || [];
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
      try {
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
            classifications = classifications.map((classification) => {
              classification.alias = classification.name;
              return classification;
            });
            console.log(
              "getClassifications -> classifications",
              classifications
            );
            ctx.classifications = classifications || [];
            const classificationTree = ctx.transformClassificationTreeData;
            console.log(classificationTree, "classifciation Tree");
            ctx.classificationTree = classificationTree || [];
            ctx.createClassificationStatus = "success";
          } else {
            ctx.createClassificationStatus = "error";
          }
        });
        resolve(true);
        return true;
      } catch (err) {
        ctx.createClassificationStatus = "error";
        reject(false);
      }
    });
  },
  updateClassificationListById(params) {
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
          (c) => c.guid === classification.guid
        );
        if (classificationIndex === -1) {
          return;
        }
        this.classifications[classificationIndex] = classification;
        this.classifications = [...this.classifications];
        const classificationTree = this.transformClassificationTreeData;
        this.classificationTree = classificationTree || [];
      } else if (updateClassificationError.value) {
        console.log(updateClassificationError.value);
      }
    });
  },
  deleteClassificationByName(classificationName) {
    Classification.archiveClassification({ cache: false, classificationName });
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
