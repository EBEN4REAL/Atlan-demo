export const filterMethod = (data, query, field = "name") => data.filter((item) => query
      .toLowerCase()
      .split(" ")
      .every((v) => item[field].toLowerCase().includes(v)));

export const sortMethodArrOfObject = (data, field = "name") => data.sort((a, b) => {
        const current = a[field].toLowerCase()
        const last = b[field].toLowerCase()
        if (current < last) {
            return -1
        }
        if (current > last) {
            return 1
        }
        return 0
    });