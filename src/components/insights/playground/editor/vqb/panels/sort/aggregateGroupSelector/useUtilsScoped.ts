export function useUtilsScoped() {
    function suffixDuplicates(copyList) {
        const list = JSON.parse(JSON.stringify(copyList))
        // Containers

        var count = {}
        var firstOccurences = {}

        // Loop through the list

        var item, itemCount
        for (var i = 0, c = list.length; i < c; i++) {
            item = list[i]
            itemCount = count[item.label]
            itemCount = count[item.label] =
                itemCount == null ? 1 : itemCount + 1

            if (itemCount == 2)
                list[firstOccurences[item.label]] =
                    list[firstOccurences[item.label]]

            if (count[item.label] > 1)
                list[i].label = list[i].label + (count[item.label] - 1)
            else firstOccurences[item.label] = i
        }

        // Return
        return list
    }
    return {
        suffixDuplicates,
    }
}
