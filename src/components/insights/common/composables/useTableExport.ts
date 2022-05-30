import { copyToClipboard } from '~/utils/clipboard'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'

const getDate = () => {
    const now = new Date()
    let day = now.toLocaleDateString('en-US', { day: 'numeric' })
    let month = now.toLocaleDateString('en-US', { month: 'short' })

    return `${day}_${month}`
}

const formatHeaders = (data, seperator) => {
    var headerValue = '#' + seperator
    for (let j = 0; j < data.length; j++) {
        let value = data[j] === null ? '' : data[j].toString()

        let result = value.replace(/"/g, '""')
        if (result.search(/("|,|\n)/g) >= 0) result = '"' + result + '"'
        if (j > 0) headerValue += seperator
        headerValue += result
    }
    return headerValue + '\n'
}

const formatColumns = (data, index, seperator) => {
    // debugger
    var rowValue = '' + (index + 1)

    // check for each key in the row object
    for (let key in data) {
        const cell = data[key]
        var value = cell === null ? ' ' : cell.toString()

        // check for Date data
        if (cell instanceof Date) {
            value = cell.toLocaleString()
        }
        var result = value.replace(/"/g, '""')
        if (result.search(/("|,|\n)/g) >= 0) result = '"' + result + '"'
        if (key) rowValue += seperator
        rowValue += result
    }
    return rowValue + '\n'
}

export const useTableExport = (name, columnList, rows) => {
    let filename = name
        ? `${getDate()}_${name}`
        : `atlan-analysis-${dayjs().format('YYYY-MM-DD')}-at-${dayjs().format(
              'hh:mm A'
          )}.csv`

    // list all the headers in array
    let headers = columnList.map((el) => el.title)

    var csvData = ''
    csvData += formatHeaders(headers, ',')
    for (var i = 0; i < rows.length; i++) {
        csvData += formatColumns(rows[i], i, ',')
    }

    var blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })

    if (navigator?.msSaveBlob) {
        navigator?.msSaveBlob(blob, filename)
    } else {
        var link = document.createElement('a')
        if (link.download !== undefined) {
            var url = URL.createObjectURL(blob)
            link.setAttribute('href', url)
            link.setAttribute('download', filename)
            link.style.visibility = 'hidden'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
    }
}
export const useSlackTableExport = (columnList, rows) => {
    let filename = `atlan-analysis-${dayjs().format(
        'YYYY-MM-DD'
    )}-at-${dayjs().format('hh:mm A')}.csv`

    // list all the headers in array
    let headers = columnList.map((el) => el.title)

    var csvData = ''
    csvData += formatHeaders(headers, ',')
    for (var i = 0; i < rows.length; i++) {
        csvData += formatColumns(rows[i], i, ',')
    }

    return {
        file: new Blob([csvData], { type: 'text/csv;charset=utf-8;' }),
        filename: filename,
    }
}

export const useCopy = (columnList, rows) => {
    let headers = columnList.map((el) => el.title)

    var csvData = ''
    csvData += formatHeaders(headers, '\t')
    for (var i = 0; i < rows.length; i++) {
        csvData += formatColumns(rows[i], i, '\t')
    }

    copyToClipboard(csvData)
    message.info('Data Copied')
}
