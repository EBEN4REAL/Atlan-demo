export const useTableExport = (columnList, rows) => {
    let filename = 'default.csv'

    // list all the headers in array
    let headers = columnList.map(el=>el.title)

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
        var rowValue = '' + (index+1)

        // check for each key in the row object
        for (let key in data) {
            var value = data[key] === null ? '' : data[key].toString()
            
            // check for Date data
            if (data[key] instanceof Date) {
                value = data[key].toLocaleString()
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
