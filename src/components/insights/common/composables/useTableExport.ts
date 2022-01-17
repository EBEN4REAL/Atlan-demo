export const useTableExport = (columnList, rows) => {
    let filename = 'atlan_analysis.csv'

    // list all the headers in array
    let headers = columnList.map((el) => el.title)

    const formatHeaders = (data) => {
        var headerValue = '#,'
        for (let j = 0; j < data.length; j++) {
            let value = data[j] === null ? '' : data[j].toString()

            let result = value.replace(/"/g, '""')
            if (result.search(/("|,|\n)/g) >= 0) result = '"' + result + '"'
            if (j > 0) headerValue += ','
            headerValue += result
        }
        return headerValue + '\n'
    }

    const formatColumns = (data, index) => {
        // debugger
        var rowValue = '' + (index + 1)

        // check for each key in the row object
        for (let key in data) {
            const cell = data[key].data
            var value = cell === null ? '' : cell.toString()

            // check for Date data
            if (cell instanceof Date) {
                value = cell.toLocaleString()
            }
            var result = value.replace(/"/g, '""')
            if (result.search(/("|,|\n)/g) >= 0) result = '"' + result + '"'
            if (key) rowValue += ','
            rowValue += result
        }
        return rowValue + '\n'
    }

    var csvData = ''
    csvData += formatHeaders(headers)
    for (var i = 0; i < rows.length; i++) {
        csvData += formatColumns(rows[i], i)
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
