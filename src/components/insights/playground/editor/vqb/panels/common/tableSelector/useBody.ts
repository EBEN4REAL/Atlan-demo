import bodybuilder from 'bodybuilder'
import { connectorsWidgetInterface } from '~/types/insights/connectorWidget.interface'

interface useBodyProps {
    from?: number
    limit?: number
    searchText?: string | undefined
    context: connectorsWidgetInterface
}
export default function useBody({
    from = 0,
    limit = 100,
    searchText,
    context,
}: useBodyProps) {
    const base = bodybuilder()
    base.sort([
        {
            'name.keyword': {
                order: 'asc',
            },
        },
    ])
    base.from(from || 0)
    base.size(limit || 100)
    if (searchText)
        base.query('wildcard', 'name.keyword', {
            value: `*${searchText}*`,
        })

    /* for crossed DB and schemas */

    switch (context.attributeName) {
        case 'connectionQualifiedName': {
            base.filter('term', context.attributeName, context.attributeValue)
            break
        }
        case 'databaseQualifiedName': {
            base.filter('term', context.attributeName, context.attributeValue)
            break
        }
        case 'schemaQualifiedName': {
            base.filter('term', context.attributeName, context.attributeValue)
            break
        }
    }
    base.filter('terms', '__typeName.keyword', ['Table', 'View'])

    const tempQuery = base.build()

    return tempQuery
}
