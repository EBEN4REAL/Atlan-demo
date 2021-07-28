export interface State {
  classifications: any;
  classificationTree: any;
  filteredClassificationTree: any;
  fetchClassificationsStatus: string;
}

export const state: State = {
  classifications: [],
  classificationTree: [],
  filteredClassificationTree: [],
  fetchClassificationsStatus: "",
};
