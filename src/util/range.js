export const checkBit = (bitDescriptorName, ranges, rangeName) => {
  const equipmentRange = ranges[rangeName]
  if (!equipmentRange) {
    return false
  }
  const bitDescriptor = equipmentRange.bitDescriptors.find(bd => bd.name === bitDescriptorName)
  if (!bitDescriptor) {
    return false
  }
  return (equipmentRange.range[bitDescriptor.index] & bitDescriptor.mask) !== 0
}
