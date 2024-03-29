import { dataTypeCategoryList } from '~/constant/dataType'
import number from '~/assets/images/dataType/number.svg?url'
import float1 from '~/assets/images/dataType/float1.svg?url'
import boolean from '~/assets/images/dataType/boolean.svg?url'
import string from '~/assets/images/dataType/string.svg?url'
import date from '~/assets/images/dataType/date.svg?url'
import array from '~/assets/images/dataType/array.svg?url'
import struct from '~/assets/images/dataType/struct.svg?url'
import geography from '~/assets/images/dataType/geography.svg?url'
import variant from '~/assets/images/dataType/variant.svg?url'
import Expand from '~/assets/images/icons/expand.svg?url'

const imageMap = {
    Number: number,
    Decimal: float1,
    Boolean: boolean,
    Text: string,
    DateTime: date,
    Array: array,
    Object: struct,
    Geography: geography,
    Variant: variant,
}

const getDataType = (type) => {
    let label = ''
    dataTypeCategoryList.forEach((i) => {
        if (i.type.includes(type.toUpperCase())) label = i.label
    })
    return label
}

export const getColumnAlignment = (data_type) => {
    switch (data_type) {
        case 'Number':
        case 'DateTime':
        case 'Geography':
        case 'Decimal':
        case 'Boolean':
            return 'right'
        default:
            return 'left'
    }
}

export const setRowHeaderStyle = (th, columns, regularTableInstance) => {
    // add default # to first row as default symbol
    if (th.classList.contains('rt-group-corner')) {
        // th.innerText = '#'
        th.style.setProperty('text-align', 'center', 'important')
    }

    // get column data type for reach column and figure out the alignment style based on data type
    const { x } = regularTableInstance.getMeta(th)
    const column = columns.value[x]

    if (column?.data_type) {
        // add alignment style
        th.style.setProperty(
            'text-align',
            getColumnAlignment(getDataType(column?.data_type)),
            'important'
        )
        // add icons based on dataTypes to header
        const span = document.createElement('span')
        span.setAttribute('id', 'icon')
        if (imageMap[getDataType(column?.data_type)]) {
            span.innerHTML = `<img style="filter: invert(45%) sepia(20%) saturate(522%) hue-rotate(184deg) brightness(96%) contrast(87%);" data-tooltip=${
                column?.data_type
            }  class="cursor-pointer inline-flex w-4 h-4 mr-1 mb-0.5" src="${
                imageMap[getDataType(column?.data_type)]
            }">`
        }

        // append the images
        if (!th.querySelector('#icon > img')) {
            th.prepend(span)
        }
    }
}

export const setCellTextStyle = (rows, columns, regularTableInstance) => {
    rows.childNodes.forEach((td, i) => {
        if (i !== 0) {
            const { x } = regularTableInstance.getMeta(td)
            if (columns?.value[x]?.data_type) {
                td.style.setProperty(
                    'text-align',
                    getColumnAlignment(getDataType(columns.value[x].data_type)),
                    'important'
                )
            }
        }
    })
}

// set data-key and key attribute for each cell that has variant type data - this enables hovering and clicking on these cells so variantModal can be triggered on click
export const setVariantCellStyle = (
    th,
    columns,
    rows,
    variantTypeIndexes,
    regularTableInstance
) => {
    // get column index
    const { x } = regularTableInstance.getMeta(th)
    // get column data from index
    const column = columns.value[x]
    // check if the column data is any of the variant data types
    if (variantTypeIndexes.includes(column?.dataIndex)) {
        // traverse each row to append the expand icon and set key and data-key attributes
        rows.forEach((element, i) => {
            if (element?.children?.length - 1 > x) {
                element?.children[x + 1]?.setAttribute(
                    'key',
                    column.dataIndex.toString()
                )
                element?.children[x + 1]?.setAttribute(
                    'data-key',
                    column.dataIndex.toString()
                )
                // create a span element that has the expand icon - visible on hovering
                const span = document.createElement('span')
                span.setAttribute('id', 'expandIcon')
                span.innerHTML = `<img  class="inline-flex w-4 h-4 mr-4 mb-0.5 absolute top-1.5 hidden right-0" src=${Expand}>`

                if (
                    !element.children[x + 1]?.querySelector('#expandIcon > img')
                ) {
                    element.children[x + 1]?.append(span)
                }
            }
        })
    }
}
