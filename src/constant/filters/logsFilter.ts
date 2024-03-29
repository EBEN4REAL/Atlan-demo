// import { confidenceScore } from '~/constant/confidenceScore'
import { computed } from 'vue'
import { statusRequest, assetTypes , requestType} from '~/constant/statusRequest'
import { statusPersona } from '~/constant/statusPersona'
import { personaScopeList } from '~/components/governance/personas/composables/useScopeService'
import useGlossaryStore from '~/store/glossary'

const glossaryStore = useGlossaryStore()
const glossaryComputed = computed(() => [...glossaryStore.list].map((el) => ({...el, label: el.displayText, value: el.id, icon: 'Glossary'})))

const getPermissions = (permissionScopeList) => {
    const permissions = []
    permissionScopeList.forEach((scope) => {
        const { scopes } = scope
        scopes.forEach((scope) => {
            const newScope = { ...scope }
            newScope.id = scope.value
            if (scope.filterLabel) {
                newScope.label = scope.filterLabel
            }
            permissions.push(newScope)
        })
    })
    return permissions
}

export const queryLogsFilter = [
    {
        id: 'queryStatus',
        label: 'STATUS',
        component: 'queryStatus',
        overallCondition: 'OR',
        attributes: [],
        isDeleted: false,
        isDisabled: false,
        exclude: false,
        class: 'bg-transparent',
    },
    {
        id: 'users',
        label: 'Users',
        component: 'owners',
        overallCondition: 'OR',
        attributes: [],
        isDeleted: false,
        isDisabled: false,
        exclude: false,
        propsToComponent: {
            showNone: false,
            hideDisabledTabs: true,
            enableTabs: ['users'],
        },
        class: 'bg-transparent',
    },
]
export const accessLogsFilter = [
    {
        id: 'logAction',
        label: 'Action',
        component: 'logAction',
        overallCondition: 'OR',
        attributes: [],
        isDeleted: false,
        isDisabled: false,
        exclude: false,
        class: 'bg-transparent',
    },
    {
        id: 'logStatus',
        label: 'Status',
        component: 'logStatus',
        overallCondition: 'OR',
        attributes: [],
        isDeleted: false,
        isDisabled: false,
        exclude: false,
        class: 'bg-transparent',
    },
    {
        id: 'userType',
        label: 'User Type',
        component: 'userTypes',
        overallCondition: 'OR',
        attributes: [],
        isDeleted: false,
        isDisabled: false,
        exclude: false,
        class: 'bg-transparent',
    },
    {
        id: 'users',
        label: 'Users',
        component: 'owners',
        overallCondition: 'OR',
        attributes: [],
        isDeleted: false,
        isDisabled: false,
        exclude: false,
        propsToComponent: {
            showNone: false,
            hideDisabledTabs: true,
            enableTabs: ['users'],
        },
        class: 'bg-transparent',
    },
    {
        id: 'properties',
        label: 'Properties',
        component: 'properties',
        attributes: [
            {
                name: 'resource.keyword',
                displayName: 'Qualified Name',
                description: 'Unique name for asset',
                typeName: 'string',
                isMandatory: true,
            },
        ],
        overallCondition: 'OR',
        isDeleted: false,
        isDisabled: false,
        exclude: false,
    },
]

export const requestFilter = [
    // {
    //     id: 'hierarchy',
    //     label: 'Connection',
    //     component: 'hierarchy',
    //     overallCondition: 'OR',
    //     attributes: [],
    //     isDeleted: false,
    //     isDisabled: false,
    //     exclude: false,
    //     analyticsKey: 'connection',
    // },
    //   {
    //     id: 'hierarchy',
    //     label: 'Connection',
    //     component: 'hierarchy',
    //     overallCondition: 'OR',
    //     attributes: [],
    //     isDeleted: false,
    //     isDisabled: false,
    //     exclude: false,
    // },
    // {
    //     id: 'assetType',
    //     label: 'ASSETS',
    //     component: 'CheckBoxOption',
    //     overallCondition: 'OR',
    //     attributes: [],
    //     isDeleted: false,
    //     isDisabled: false,
    //     exclude: false,
    //     class: 'bg-transparent',
    //     data: assetTypes
    // },
    {
        id: 'owners',
        label: 'Requestor',
        component: 'owners',
        overallCondition: 'OR',
        // selectUserKey: "id",
        attributes: [],
        isDeleted: false,
        isDisabled: false,
        exclude: false,
        propsToComponent: {
            showNone: false,
            hideDisabledTabs: true,
            enableTabs: ['users'],
        },
        class: 'bg-transparent',
    },
    {
        id: '__traitNames',
        label: 'Classifications',
        component: 'classifications',
        overallCondition: 'OR',
        attributes: [],
        isDeleted: false,
        isDisabled: false,
        exclude: false,
        showNone: false,
    },
    {
        id: 'statusRequest',
        label: 'Status',
        component: 'CheckBoxOption',
        overallCondition: 'OR',
        attributes: [],
        isDeleted: false,
        isDisabled: false,
        exclude: false,
        class: 'bg-transparent',
        data: statusRequest,
    },
  {
        id: 'requestType',
        label: 'Request Type',
        component: 'CheckBoxOption',
        overallCondition: 'OR',
        attributes: [],
        isDeleted: false,
        isDisabled: false,
        exclude: false,
        class: 'bg-transparent',
        data: requestType,
    },


    // {
    //     id: 'terms',
    //     label: 'Terms',
    //     component: 'governance',
    //     overallCondition: 'OR',
    //     attributes: [],
    //     isDeleted: false,
    //     isDisabled: false,
    //     exclude: false,
    // },
    // {
    //     id: 'confidenceScore',
    //     label: 'Confidence score',
    //     component: 'CheckBoxOption',
    //     overallCondition: 'OR',
    //     attributes: [],
    //     isDeleted: false,
    //     isDisabled: false,
    //     exclude: false,
    //     class: 'bg-transparent',
    //     data: confidenceScore
    // },
]

export const personaFilter = [
    {
        id: 'hierarchy',
        label: 'Connection',
        component: 'hierarchy',
        overallCondition: 'OR',
        attributes: [],
        isDeleted: false,
        isDisabled: false,
        exclude: false,
        analyticsKey: 'connection',
    },
    {
        id: 'glossaries',
        label: 'Glossaries',
        component: 'CheckBoxOption',
        overallCondition: 'OR',
        attributes: [],
        isDeleted: false,
        isDisabled: false,
        exclude: false,
        class: 'bg-transparent',
        data: glossaryComputed.value,
    },
    {
        id: 'owners',
        label: 'Users',
        component: 'owners',
        selectUserKey: 'id',
        overallCondition: 'OR',
        attributes: [],
        isDeleted: false,
        isDisabled: false,
        exclude: false,
        propsToComponent: {
            showNone: false,
            hideDisabledTabs: true,
            enableTabs: ['users', 'groups'],
            selectGroupKey: 'id',
            selectUserKey: 'id',
        },
        class: 'bg-transparent',
    },
    // {
    //     id: 'statusRequest',
    //     label: 'STATUS',
    //     component: 'CheckBoxOption',
    //     overallCondition: 'OR',
    //     attributes: [],
    //     isDeleted: false,
    //     isDisabled: false,
    //     exclude: false,
    //     class: 'bg-transparent',
    //     data: statusPersona,
    // },
    {
        id: 'permissions',
        label: 'PERMISSION',
        component: 'CheckBoxOption',
        overallCondition: 'OR',
        attributes: [],
        isDeleted: false,
        isDisabled: false,
        exclude: false,
        class: 'bg-transparent',
        data: getPermissions(personaScopeList),
    },
    // {
    //     id: 'confidenceScore',
    //     label: 'Confidence score',
    //     component: 'CheckBoxOption',
    //     overallCondition: 'OR',
    //     attributes: [],
    //     isDeleted: false,
    //     isDisabled: false,
    //     exclude: false,
    //     class: 'bg-transparent',
    //     data: confidenceScore
    // },
]

export const purposeFilter = [
    {
        id: 'classifications',
        label: 'Classifications',
        component: 'classifications',
        overallCondition: 'OR',
        attributes: [],
        isDeleted: false,
        isDisabled: false,
        exclude: false,
        showNone: false,
    },
    {
        id: 'owners',
        label: 'Users',
        component: 'owners',
        overallCondition: 'OR',
        attributes: [],
        isDeleted: false,
        isDisabled: false,
        exclude: false,
        propsToComponent: {
            showNone: false,
            hideDisabledTabs: true,
            enableTabs: ['users', 'groups'],
        },
        class: 'bg-transparent',
    },
]
