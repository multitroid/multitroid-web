export const groupBy = (list, keyGetter) => {
  const grouped = {}
  list.forEach((item) => {
    const key = keyGetter(item)
    const collection = grouped[key]
    if (!collection) {
      grouped[key] = [item]
    } else {
      collection.push(item)
    }
  })
  return grouped
}
