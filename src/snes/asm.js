export const ADCValue = (value) => {
  return [0x69, (value & 0xFF), (value >> 8)]
}

export const ADC8Value = (value) => {
  return [0x69, (value & 0xFF)]
}

export const AND = (address) => {
  return [0x2D, (address & 0xFF), (address >> 8)]
}

export const ANDValue = (value) => {
  return [0x29, (value & 0xFF), (value >> 8 & 0xFF)]
}

export const BCC = (jump) => {
  return [0x90, jump]
}

export const BCS = (jump) => {
  return [0xB0, jump]
}

export const BEQ = (jump) => {
  return [0xF0, jump]
}

export const BMI = (jump) => {
  return [0x30, jump]
}

export const BNE = (jump) => {
  return [0xD0, jump]
}

export const BPL = (jump) => {
  return [0x10, jump]
}

export const BVC = (jump) => {
  return [0xF0, jump]
}

export const BVS = (jump) => {
  return [0x70, jump]
}

export const BRA = (jump) => {
  return [0x80, jump]
}

export const CLC = () => {
  return [0x18]
}

export const CLV = () => {
  return [0xB8]
}

export const CMP = (address) => {
  if (address > 0xFFFF) {
    return [0xCF, (address & 0xFF), (address >> 8), (address >> 16)]
  } else {
    return [0xCD, (address & 0xFF), (address >> 8)]
  }
}

export const CMPValue = (value) => {
  return [0xC9, (value & 0xFF), (value >> 8)]
}

export const LDA = (address) => {
  if (address > 0xFFFF) {
    return [0xAF, (address & 0xFF), (address >> 8), (address >> 16)]
  } else {
    return [0xAD, (address & 0xFF), (address >> 8)]
  }
}

export const LDAValue = (value) => {
  return [0xA9, (value & 0xFF), (value >> 8)]
}

export const LDA8Value = (value) => {
  return [0xA9, (value & 0xFF)]
}

export const LDX = (address) => {
  return [0xAE, (address & 0xFF), (address >> 8)]
}

export const JSL = (address) => {
  return [0x22, (address & 0xFF), (address >> 8), (address >> 16)]
}

export const JSR = (address) => {
  return [0x20, (address & 0xFF), (address >> 8)]
}

export const NOP = () => {
  return [0xEA]
}

export const ORAValue = (value) => {
  return [0x09, (value & 0xFF), (value >> 8 & 0xFF)]
}

export const RTL = () => {
  return [0x6B]
}

export const RTS = () => {
  return [0x60]
}

export const TXA = () => {
  return [0x8A]
}

export const SBCValue = (value) => {
  return [0xE9, (value & 0xFF), (value >> 8)]
}

export const SBC8Value = (value) => {
  return [0xE9, (value & 0xFF)]
}

export const STA = (address) => {
  if (address > 0xFFFF) {
    return [0x8F, (address & 0xFF), (address >> 8), (address >> 16)]
  } else {
    return [0x8D, (address & 0xFF), (address >> 8)]
  }
}

export const STAIX = (address) => {
  if (address > 0xFFFF) {
    return [0x9F, (address & 0xFF), (address >> 8), (address >> 16)]
  } else if (address > 0xFF) {
    return [0x9D, (address & 0xFF), (address >> 8)]
  }
}

export const STADPX = (address) => {
  return [0x95, (address & 0xFF)]
}

export const PHX = () => {
  return [0xDA]
}

export const PHA = () => {
  return [0x48]
}

export const LDXValue = (value) => {
  return [0xA2, (value & 0xFF), (value >> 8)]
}

export const LDAAIX = (index) => {
  return [0xBD, (index & 0xFF), (index >> 8)]
}

export const INX = () => {
  return [0xE8]
}

export const CPXValue = (value) => {
  return [0xE0, (value & 0xFF), (value >> 8)]
}

export const PLA = () => {
  return [0x68]
}

export const PLX = () => {
  return [0xFA]
}

export const SEC = () => {
  return [0x38]
}

export const PHP = () => {
  return [0x08]
}

export const SEP = (statusBits) => {
  return [0xE2, (statusBits & 0xFF)]
}

export const PLP = () => {
  return [0x28]
}

export const DEX = () => {
  return [0xCA]
}

export const STZ = (address) => {
  if (address > 0xFFFF) {
    return [0x9C, (address & 0xFF), (address >> 8), (address >> 16)]
  } else {
    return [0x64, (address & 0xFF), (address >> 8)]
  }
}

export const REP = (statusBits) => {
  return [0xC2, statusBits]
}

export const LDY = (address) => {
  return [0xAC, (address & 0xFF), (address >> 8)]
}

export const LDYValue = (value) => {
  return [0xA0, (value & 0xFF), (value >> 8)]
}
