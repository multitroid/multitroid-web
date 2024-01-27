export const sramOffset = 0xE00000
export const wramOffset = 0xF50000

export const snesToPc = (snesAddress) => {
  const b1 = snesAddress & 0xFF
  const b2 = (snesAddress >> 8) & 0xFF
  let b3 = snesAddress >> 16

  if (b3 >= 0x80) {
    b3 = (b3 - 0x80)
  }
  let tmp = b2 << 8 | b1
  if (tmp < 0x8000) {
    tmp = tmp + 0x8000
  }
  tmp = tmp + (b3 * 0x8000) - 0x8000

  return tmp;
}

export const getOffset = (offset) => {
  if (offset >= 0x7E0000 && offset <= 0x7FFFFF) {
    return offset - 0x7E0000 + wramOffset
  }
  else if (offset >= 0x700000 && offset <= 0x7DFFFF) {
    return offset - 0x700000 + sramOffset
  }
  else {
    return snesToPc(offset)
  }
}
