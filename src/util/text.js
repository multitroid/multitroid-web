export const textLookup = (c) => {
  const cInt = c.charCodeAt(0)

  // Uppercase
  if (cInt >= 65 && cInt <= 90) {
    return 0xE0 + cInt - 65
  }

  // Lowercase
  if (cInt >= 97 && cInt <= 122) {
    return 0xE0 + cInt - 97
  }

  if (cInt >= '1'.charCodeAt(0) && cInt <= '9'.charCodeAt(0)) {
    return 0x00 + cInt - 49
  }

  switch (cInt) {
    case 48: //0
      return 0x09
    case 32: //space
      return 0x0F
    case 33: //!
      return 0xFF
    case 63: //?
      return 0xFE
    case 46: //.
      return 0xFA
    case 44: //,
      return 0xFB
    case 39: //'
      return 0xFD
    case 45: //-
      return 0xCF
    case 37: //%
      return 0x0A
    case 38: //&
      return 0xC8
    case 64: //@ (morphball)
      return 0xC9
    case 36: //$ (save station symbol)
      return 0x4D//0x11
    case 94: //^ (arrow, but pointing down)
      return 0x11
    case 60: //<
      return 0x33
    case 62: //>
      return 0xCD
  }

  return 0xFE
}
