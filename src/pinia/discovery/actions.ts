import { Getters } from "./getters";
import { State } from "./state";

export interface Actions extends State, Getters {
  addClassifications(params: any): void;
  setSelectedAsset(params: any): void;
  updateAvailableClassificationsForLink(classifications: any): void;
  addClassificationToSelectedAsset(params: any): void;
  removeClassificationToSelectedAsset(params: any): void;
}

function getAvailableClassificationsForLink(
  selectedAssetClassifications,
  classifications
) {
  let availableClassifications: Array<any> = [];
  classifications.forEach((classification) => {
    let index = selectedAssetClassifications.findIndex(
      (cl) => cl.typeName === classification.name
    );
    if (index === -1) availableClassifications.push(classification);
  });

  return availableClassifications;
}

export const actions: Actions = {
  addClassifications(classification) {
    const classifications = this.classifications;
    this.classifications = [...classifications, ...classification];
    this.availableClassificationsForLink = getAvailableClassificationsForLink(
      this.selectedAsset.classifications,
      this.classifications
    );
  },
  updateAvailableClassificationsForLink(classifications) {
    this.availableClassificationsForLink = getAvailableClassificationsForLink(
      this.selectedAsset.classifications,
      classifications
    );
  },
  setSelectedAsset(assetData) {
    this.selectedAsset = assetData ?? {};
    this.availableClassificationsForLink = getAvailableClassificationsForLink(
      assetData.classifications,
      this.classifications
    );
  },

  addClassificationToSelectedAsset(classification: any) {
    let classifications = this.selectedAsset.classifications;
    classifications = [...classifications, classification];
    this.selectedAsset.classifications = this.formattedLinkedClassifications(
      classifications
    );
    this.availableClassificationsForLink = getAvailableClassificationsForLink(
      this.selectedAsset.classifications,
      this.classifications
    );
  },
  removeClassificationToSelectedAsset(selectedClassification: any) {
    const { typeName } = selectedClassification;
    let classifications = this.selectedAsset.classifications;
    this.selectedAsset.classifications = classifications.filter(
      (classification) => classification.typeName !== typeName
    );
    this.availableClassificationsForLink = getAvailableClassificationsForLink(
      this.selectedAsset.classifications,
      this.classifications
    );
  },
};
