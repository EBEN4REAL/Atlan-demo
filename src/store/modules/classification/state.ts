export interface State {
  classifications: any;
  classificationsStatus: string;
  createClassificationStatus: string;
  classificationTree: any;
  filteredClassificationTree: any;
}

export const state: State = {
  classifications: [],
  classificationsStatus: "",
  createClassificationStatus: "",
  classificationTree: [],
  filteredClassificationTree: [],
};
