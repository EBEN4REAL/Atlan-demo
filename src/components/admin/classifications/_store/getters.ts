// eslint-disable-next-line import/no-cycle

import { GettersTree } from 'pinia'
import { State } from './state'
import { classificationInterface } from '~/types/classifications/classification.interface'
import { treeClassificationInterface } from '~/types/classifications/treeClassification.interface'

export interface Getters {
    transformClassificationTreeData(state: State): treeClassificationInterface[]
    getClassificationTree(state: State): treeClassificationInterface[]
    getFilteredClassifications(state: State): classificationInterface[]
    getFilteredClassificationsBySeach(
        state: State
    ): (searchText: string) => treeClassificationInterface[]
    sortClassifications(
        state: State
    ): (sortingOrder: string) => classificationInterface[]

    getClasificationByName(
        state: State
    ): (name: string) => classificationInterface | undefined
}
const RESTRICTED_CLASSIFICATION_PREFIX = 'atlan_'

const orderTreeNodesAsc = (
    node0: treeClassificationInterface,
    node1: treeClassificationInterface
) => {
    const compareStrings = (a: string, b: string) => {
        if (a < b) {
            return -1
        }
        if (a > b) {
            return 1
        }
        return 0
    }
    return compareStrings(node0.title, node1.title)
}

export const getters: GettersTree<State> & Getters = {
    transformClassificationTreeData: (
        state: State
    ): treeClassificationInterface[] => {
        // each classification has a unique name, create a hashmap with name for O(1) access
        const hashMap: { [index: string]: classificationInterface } = {}
        state.classifications.forEach((item) => {
            hashMap[item.name] = item
        })
        //
        const getClassificationNodeObj = (
            classification: classificationInterface
        ) => ({
            title: classification.displayName || classification.name,
            name: classification.name,
            key: classification.guid,
            children: [],
            data: {
                ...classification,
                type: 'classification',
            },
        })

        // resolves children recursively looking at the hashmap
        const getResolvedChildren = (nameArr: string[]) => {
            const children = nameArr
                .filter((name) => typeof hashMap[name] !== 'undefined')
                .map((name) => {
                    const classificationObj = hashMap[name]
                    const nodeObj: treeClassificationInterface =
                        getClassificationNodeObj(classificationObj)
                    if (classificationObj.subTypes) {
                        const subTypeChilds = getResolvedChildren(
                            classificationObj.subTypes
                        )
                        if (subTypeChilds.length) {
                            nodeObj.children = subTypeChilds
                        }
                    }
                    return nodeObj
                })
            children.sort(orderTreeNodesAsc)
            return children
        }
        const transformedClassifications = state.classifications.reduce(
            (treeData, classification) => {
                if (classification.superTypes.length) {
                    return treeData
                }
                // don't show classifications with name starting with atlan_ - this are internal classifications used by us
                if (
                    classification.name
                        .toLowerCase()
                        .startsWith(RESTRICTED_CLASSIFICATION_PREFIX)
                ) {
                    return treeData
                }

                // To plugin children uncomment the code
                const nodeObj = getClassificationNodeObj(classification)
                // if (classification.subTypes.length) {
                //   const children = getResolvedChildren(classification.subTypes);
                //   if (children.length) {
                //     nodeObj.children = children;
                //   }
                // }
                treeData.push(nodeObj)
                return treeData
            },
            [] as treeClassificationInterface[]
        )
        transformedClassifications.sort(orderTreeNodesAsc)
        return transformedClassifications
    },
    getClassificationTree: (state: State): treeClassificationInterface[] =>
        state.classificationTree,
    getFilteredClassificationsBySeach:
        (state: State) =>
        (searchText: string): treeClassificationInterface[] =>
            state.classificationTree.filter((classification: any) =>
                classification.title
                    .toLowerCase()
                    .includes(searchText.toLocaleLowerCase())
            ),
    getFilteredClassifications: (state: State): classificationInterface[] =>
        state.classifications.filter(
            (obj) =>
                !obj.name
                    .toLowerCase()
                    .startsWith(RESTRICTED_CLASSIFICATION_PREFIX)
        ),

    sortClassifications:
        (state: State) =>
        (sortingOrder: string): classificationInterface[] => {
            let classifications: classificationInterface[] = []
            switch (sortingOrder) {
                case 'asc': {
                    classifications = state.classifications.sort(
                        (
                            classificationA: classificationInterface,
                            classificationB: classificationInterface
                        ) => {
                            const a = classificationA.displayName
                            const b = classificationB.displayName
                            if (a < b) {
                                return -1
                            }
                            if (a > b) {
                                return 1
                            }
                            return 0
                        }
                    )
                    break
                }
                case 'dsc': {
                    classifications = state.classifications.sort(
                        (
                            classificationA: classificationInterface,
                            classificationB: classificationInterface
                        ) => {
                            const a = classificationA.displayName
                            const b = classificationB.displayName
                            if (a > b) {
                                return -1
                            }
                            if (a < b) {
                                return 1
                            }
                            return 0
                        }
                    )
                    break
                }
                default: {
                    break
                }
            }
            console.log('classifications', classifications)
            return classifications
        },

    getClasificationByName:
        (state: State) =>
        (name: string): classificationInterface | undefined =>
            state?.classifications.find((obj) => obj.name === name),
}
