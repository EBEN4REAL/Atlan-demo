import { generateUUID } from '~/utils/helper/generator'

export function useUtils() {
    const getInitialPanelStructure = (type: string) => {
        let panel = {}
        let uuid = generateUUID()
        if (type === 'aggregate') {
            panel = {
                id: uuid,
                column: {},
                aggregators: [],
                expand: true,
            }
        } else if (type === 'group') {
            panel = {
                id: uuid,
                tableQualfiedName: undefined,
                columns: [],
                columsData: [],
                expand: true,
            }
        } else if (type === 'sort') {
            panel = {
                id: uuid,
                column: {},
                order: 'asc',
                expand: true,
                active: false,
                aggregateORGroupColumn: {},
            }
        } else if (type === 'filter') {
            panel = {
                id: uuid,
                column: {},
                filter: {
                    filterType: 'and',
                },
                expand: true,
            }
        } else if (type === 'join') {
            panel = {
                id: uuid,
                columnsDataLeft: {},
                columnsDataRight: {},
                joinType: {
                    type: 'inner_join',
                    name: 'Inner Join',
                },
                expand: true,
            }
        }
        return panel
    }
    return {
        getInitialPanelStructure,
    }
}
