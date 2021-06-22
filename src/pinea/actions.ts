import { watch, toRaw } from "vue";
import { Classification } from "~/api/atlas/classification";
import { ActionTypes } from "./types-actions";

export interface Actions {
  [ActionTypes.GET_CLASSIFICATIONS](): void;
  [ActionTypes.RESET_CLASSIFICATIONS](): void;
  [ActionTypes.SET_CLASSIFICATIONS](params: any): void;
  [ActionTypes.FILTER_CLASSIFICATION_TREE](searchText: any): void;
  [ActionTypes.CREATE_CLASSIFICATION](params: any): boolean;
  [ActionTypes.UPDATE_CLASSIFICATION_LIST_BY_ID](params: any): void;
  [ActionTypes.DELETE_CLASSIFICATION_BY_NAME](classificationName: any): void;
  [ActionTypes.UPDATE_CLASSIFICATION_TREE](tree: any): void;
  [ActionTypes.SET_CLASSIFICATION_STATUS](status: any): void;
}

export const actions: Actions = {
  [ActionTypes.GET_CLASSIFICATIONS]() {
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
          console.log("getClassifications -> classifications", classifications);
          this.classifications = classifications || [];
          const classificationTree = this.getters
            .transformClassificationTreeData;
          console.log(classificationTree, "classifciation Tree");
          this.classificationTree = classificationTree || [];
          this.filteredClassificationTree = classificationTree || [];
          this.classificationsStatus = "success";
        } else if (!classificationData.value && classificationError.value) {
          this.classificationsStatus = "error";
        }
      });
    } catch (err) {
      this.classificationsStatus = "error";
    }
  },
  [ActionTypes.RESET_CLASSIFICATIONS]() {
    this.classifications = classifications || [];
    this.classificationTree = classificationTree || [];
    this.classificationsStatus = "";
  },
  [ActionTypes.SET_CLASSIFICATIONS](list) {
    try {
      this.classifications = list;
      const classificationTree = this.getters.transformClassificationTreeData;
      this.classificationTree = classificationTree || [];
    } catch (error) {
      console.log("WTF: setClassifications -> error", error);
    }
  },
  [ActionTypes.CREATE_CLASSIFICATION](payload) {
    try {
      this.createClassificationStatus = "loading";
      const {
        data: createClassificationData,
        error: createClassificationError,
      } = Classification.createClassification({ cache: false, payload });

      watch([createClassificationData, createClassificationError], () => {
        console.log(createClassificationData, createClassificationError);
        if (createClassificationData.value) {
          let classifications =
            createClassificationData.value.classificationDefs || [];
          classifications = [...state.classifications, ...classifications];
          classifications = classifications.map((classification) => {
            classification.alias = classification.name;
            return classification;
          });
          console.log("getClassifications -> classifications", classifications);
          this.classifications = classifications || [];
          const classificationTree = this.getters
            .transformClassificationTreeData;
          console.log(classificationTree, "classifciation Tree");
          this.classificationTree = classificationTree || [];
          this.createClassificationStatus = "success";
        } else if (
          !createClassificationData.value &&
          createClassificationError.value
        ) {
          this.createClassificationStatus = "error";
        }
      });
      return true;
    } catch (err) {
      this.createClassificationStatus = "error";
      return false;
    }
  },
  [ActionTypes.UPDATE_CLASSIFICATION_LIST_BY_ID](params) {
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
        const classificationIndex = state.classifications.findIndex(
          (c) => c.guid === payload.classification.guid
        );
        if (classificationIndex === -1) {
          return;
        }
        this.classifications[classificationIndex] = classification;
        this.classifications = [...this.classifications];
        const classificationTree = this.this.getters
          .transformClassificationTreeData;
        this.classificationTree = classificationTree || [];
      } else if (updateClassificationError.value) {
        console.log(updateClassificationError.value);
        // throw Error(updateClassificationError.value);
      }
    });
  },
  [ActionTypes.DELETE_CLASSIFICATION_BY_NAME](classificationName) {
    Classification.archiveClassification({ cache: false, classificationName });
  },
  [ActionTypes.UPDATE_CLASSIFICATION_TREE](tree) {
    this.classificationTree = tree;
  },
  [ActionTypes.SET_CLASSIFICATION_STATUS](status) {
    this.classificationsStatus = status || "";
  },
  [ActionTypes.FILTER_CLASSIFICATION_TREE](searchText: string) {
    console.log(searchText, "in action");
    const tree = this.this.getters.getFilteredClassificationsBySeach(
      searchText
    );
    this.filteredClassificationTree = tree;
  },
};
