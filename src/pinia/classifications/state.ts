export interface State {
  classifications: any;
  classificationsStatus: string;
  createClassificationStatus: string;
  updateClassificationStatus: string;
  deleteClassificationStatus: string;
  classificationTree: any;
  filteredClassificationTree: any;
}

export const state: State = {
  classifications: [],
  classificationsStatus: "",
  createClassificationStatus: "",
  updateClassificationStatus: "",
  deleteClassificationStatus: "",
  classificationTree: [],
  filteredClassificationTree: [],
};
