import {
  ADC8Value,
  ADCValue,
  ANDValue,
  BCC,
  BCS,
  CLC,
  CMP,
  LDA,
  LDA8Value,
  LDAValue,
  ORAValue,
  REP,
  RTL,
  SBC8Value,
  SBCValue,
  SEC,
  SEP,
  STA
} from './asm'
import { getOffset } from '../util/snes'
import { waitForSnes } from './status'
import { textLookup } from '../util/text'

export const writeToSnes = (webSockets, address, bytes, offset = true) => {
  if (bytes.length > 1) {
    putAddress(webSockets, offset, address + 1, bytes.slice(1))
  }
  putAddress(webSockets, offset, address, bytes.slice(0, 1))
}

const putAddress = function (webSockets, offset, address, bytes) {
  const offsetAddressHex = (offset ? getOffset(address) : address).toString(16)

  const json = JSON.stringify({
    Opcode: 'PutAddress',
    Space: 'SNES',
    Operands: [offsetAddressHex, bytes.length.toString(16)]
  })
  webSockets.snesWebsocket.send(json)

  const byteArray = new Uint8Array(bytes.length)
  for (let i = 0; i < bytes.length; ++i) {
    byteArray[i] = bytes[i]
  }
  webSockets.snesWebsocket.send(byteArray.buffer)
}

/**
 *
 * @param webSockets
 * @param {Number[][]} commands
 * @returns {Promise<void>}
 */
export const writeCommands = async (webSockets, commands) => {
  const commandLocation = webSockets.snesWebsocket.game.code.commandLocation
  const maxCommandLength = webSockets.snesWebsocket.game.code.maxCommandLength

  await waitForSnes(webSockets)

  const combinedUntilFull = commands.reduce((acc, cur) => {
    if (acc.full) {
      return acc
    }
    const c = cur.reduce((acc, curr) => acc.concat(curr), [])
    if (c.length >= maxCommandLength - 1) {
      throw new Error('OMGZ COMMAND TOO BIG')
    }
    if (acc.bytes + c.length < maxCommandLength - 1) {
      acc.data = acc.data.concat(c)
      acc.bytes += c.length
      acc.lastIndex++
    } else {
      acc.full = true
    }
    return acc
  }, {
    data: [],
    full: false,
    bytes: 0,
    lastIndex: -1
  })

  if (combinedUntilFull.lastIndex === -1) {
    // There is nothing to write, lets jump out of this write loop
    return
  }

  combinedUntilFull.data.push(RTL()[0])

  writeToSnes(
    webSockets,
    commandLocation,
    combinedUntilFull.data
  )

  const restOfCommands = commands.splice(combinedUntilFull.lastIndex + 1)

  await writeCommands(webSockets, restOfCommands)
}

export const writeInitialServerDataToSnes = async (webSockets) => {
  const rangeDescriptors = webSockets.snesWebsocket.game.rangeDescriptors
  const rangeDescriptorCommands = createRangeDescriptorCommands(rangeDescriptors, webSockets.snesWebsocket.game.code.maxCommandLength, true)
  const consumables = webSockets.snesWebsocket.game.consumables
  const consumableCommands = createConsumableCommands(consumables)
  const commands = rangeDescriptorCommands.concat(consumableCommands)

  if (commands.length === 0) {
    return
  }

  await writeCommands(webSockets, commands)
}

/**
 *
 * @param rangeDescriptors
 * @param {Number} maxCommandLength
 * @param {Boolean} isInitialData
 * @returns {Number[][]}
 */
const createRangeDescriptorCommands = (rangeDescriptors, maxCommandLength, isInitialData) => {
  return rangeDescriptors
    .map(rangeDescriptor => createRangeDescriptorBitCommands(rangeDescriptor, maxCommandLength, isInitialData))
    .reduce((acc, curr) => acc.concat(curr), [])
}

/**
 *
 * @param rangeDescriptor
 * @param {Number} maxCommandLength
 * @param {Boolean} isInitialData
 * @returns {Number[][]}
 */
const createRangeDescriptorBitCommands = (rangeDescriptor, maxCommandLength, isInitialData) => {
  const data = rangeDescriptor.data
  let commands = []

  if (rangeDescriptor.bitDescriptors.length === 0 && rangeDescriptor.onlySyncDescribedBits) {
    return commands
  }

  for (let byteIndex = 0; byteIndex < data.length; byteIndex++) {
    // Per byte

    if (rangeDescriptor.diff[byteIndex] === 0) {
      continue
    }

    if (rangeDescriptor.bitDescriptors.length === 0 && !rangeDescriptor.onlySyncDescribedBits) {
      // Generate commands that is guaranteed to no have ASM
      commands.push(createCommandForRangeDescriptorMasked(rangeDescriptor, byteIndex, 0xFF, isInitialData))
      continue
    }

    // Generate commands for the whole byte
    let mask = 0xFF
    if (rangeDescriptor.onlySyncDescribedBits) {
      mask = rangeDescriptor.bitDescriptors
        .filter(bitDescriptor => bitDescriptor.index === byteIndex)
        .reduce((acc, cur) => acc | cur.mask, 0x00)
    }
    if (mask === 0x00) {
      continue
    }

    const command = createCommandForRangeDescriptorMasked(rangeDescriptor, byteIndex, mask, isInitialData);
    const commandLength = command.flatMap(x => x).length;
    if (commandLength + 1 < maxCommandLength) {
      commands.push(command)
      continue
    }
    // If the command was too big, create commands for each bit instead

    for (let j = 0; j < 8; j++) {
      // Per bit

      let mask = 1 << j
      if (rangeDescriptor.onlySyncDescribedBits) {
        const bitDescriptor = rangeDescriptor.bitDescriptors.find(bitDescriptor => bitDescriptor.index === byteIndex && bitDescriptor.mask === mask)
        if (bitDescriptor) {
          mask = bitDescriptor.mask
        } else {
          mask = 0x00
        }
      }

      if (mask === 0x00) {
        continue
      }

      commands.push(createCommandForRangeDescriptorMasked(rangeDescriptor, byteIndex, mask, isInitialData))
    }
  }

  return commands
}

/**
 *
 * @param rangeDescriptor
 * @param {Number} byteIndex
 * @param {Number} mask
 * @param {Boolean} isInitialData
 * @returns {Number[][]}
 */
function createCommandForRangeDescriptorMasked(rangeDescriptor, byteIndex, mask, isInitialData) {
  const currentByte = rangeDescriptor.data[byteIndex];

  let command = [
    LDA(rangeDescriptor.startAddress + byteIndex),
    ORAValue(currentByte & mask),
    ANDValue(0xFFFF - mask | currentByte),
    STA(rangeDescriptor.startAddress + byteIndex)
  ]

  const relevantBitDescriptors = rangeDescriptor.bitDescriptors
    .filter(bitDescriptor => bitDescriptor.index === byteIndex && (bitDescriptor.mask & mask) !== 0)

  const bitDescriptorsToEnable = relevantBitDescriptors
    .filter(bitDescriptor => (currentByte & bitDescriptor.mask) !== 0)

  const bitDescriptorsToDisable = relevantBitDescriptors
    .filter(bitDescriptor => (currentByte & bitDescriptor.mask) === 0)

  if (isInitialData) {
    command = command.concat(bitDescriptorsToEnable
      .map(bitDescriptor => bitDescriptor.asm && bitDescriptor.asm.onAcquire)
      .filter(exists => exists))

    command = command.concat(bitDescriptorsToDisable
      .map(bitDescriptor => bitDescriptor.asm && bitDescriptor.asm.onLose)
      .filter(exists => exists))

  } else {
    const oldData = rangeDescriptor.oldData

    command = command.concat(bitDescriptorsToEnable
      .filter(bitDescriptor => (oldData[byteIndex] & bitDescriptor.mask) === 0)
      .map(bitDescriptor => bitDescriptor.asm && bitDescriptor.asm.onAcquire)
      .filter(exists => exists))

    command = command.concat(bitDescriptorsToDisable
      .filter(bitDescriptor => (oldData[byteIndex] & bitDescriptor.mask) !== 0)
      .map(bitDescriptor => bitDescriptor.asm && bitDescriptor.asm.onLose)
      .filter(exists => exists))

    command = command.concat(bitDescriptorsToEnable
      .filter(bitDescriptor => (oldData[byteIndex] & bitDescriptor.mask) === 0)
      .map(bitDescriptor => bitDescriptor.asm && bitDescriptor.asm.onIncrease)
      .filter(exists => exists))

    command = command.concat(bitDescriptorsToDisable
      .filter(bitDescriptor => (oldData[byteIndex] & bitDescriptor.mask) !== 0)
      .map(bitDescriptor => bitDescriptor.asm && bitDescriptor.asm.onDecrease)
      .filter(exists => exists))
  }

  return command
}


const createConsumableCommands = (consumables, isInitialData) => {
  return consumables.map(consumable => {
    const diff = consumable.value - consumable.oldValue
    return createConsumableCommand(consumable, diff, consumable.value, consumables, isInitialData)
  }).filter(exists => exists)
}

const createConsumableCommand = (consumable, diff, forceValue, consumables, isInitialData) => {
  const command = []
  const eightBit = consumable.bits === 8
  if (eightBit) {
    command.push(SEP(0x20))
  }
  command.push(LDA(consumable.address))

  if (forceValue !== undefined) {
    command.push(eightBit ? LDA8Value(forceValue) : LDAValue(forceValue))
  } else if (diff > 0) {
    command.push(CLC())
    command.push(eightBit ? ADC8Value(diff) : ADCValue(diff))
  } else {
    command.push(SEC())
    command.push(eightBit ? SBC8Value(Math.abs(diff)) : SBCValue(Math.abs(diff)))
    const underflowCorrection = eightBit ? LDA8Value(0x00) : LDAValue(0x0000)
    command.push(BCS(underflowCorrection.length))
    command.push(underflowCorrection)
  }

  if (consumable.max) {
    const consumableMax = consumables.find(c => c.name === consumable.max)
    if (consumableMax) {
      command.push(CMP(consumableMax.address))
      const aboveMaxConsumable = LDA(consumableMax.address)
      command.push(BCC(aboveMaxConsumable.length))
      command.push(aboveMaxConsumable)
    }
  }

  command.push(STA(consumable.address))
  if (eightBit) {
    command.push(REP(0x20))
  }

  if (consumable.asm && isInitialData) {
    if (consumable.asm.onAcquire && consumable.value > 0) {
      command.push(consumable.asm.onAcquire)
    }
    if (consumable.asm.onLose && consumable.value <= 0) {
      command.push(consumable.asm.onLose)
    }
  }

  if (consumable.asm && !isInitialData) {
    if (consumable.asm.onAcquire && consumable.oldValue <= 0 && consumable.value > 0) {
      command.push(consumable.asm.onAcquire)
    }
    if (consumable.asm.onLose && consumable.oldValue > 0 && consumable.value <= 0) {
      command.push(consumable.asm.onLose)
    }
    if (consumable.asm.onIncrease && consumable.value > consumable.oldValue) {
      command.push(consumable.asm.onIncrease)
    }
    if (consumable.asm.onDecrease && consumable.value < consumable.oldValue) {
      command.push(consumable.asm.onDecrease)
    }
  }

  return command
}

export const handleConsumableUpdate = (webSockets, consumableUpdate) => {
  const createCommands = (snesWebsocket) => {
    const consumables = snesWebsocket.game.consumables
    const consumable = consumables.find(c => c.name === consumableUpdate.name)
    let value
    let forceValue
    if (consumableUpdate.force) {
      value = consumableUpdate.value
      forceValue = consumableUpdate.value
    } else {
      value = consumable.value + consumableUpdate.diff
    }
    let clampedValue = value < 0 ? 0 : value
    if (consumable.max) {
      const consumableMax = consumables.find(c => c.name === consumable.max)
      if (consumableMax?.value && clampedValue > consumableMax.value) {
        clampedValue = consumableMax.value
      }
    }
    consumable.oldValue = consumable.value ? consumable.value : 0
    consumable.value = clampedValue
    let diff = consumableUpdate.diff
    if (consumableUpdate.force) {
      diff = consumable.value - consumable.oldValue
    }
    return [createConsumableCommand(consumable, diff, forceValue, consumables, false)]
  }
  webSockets.snesWebsocket.writeQueue.push(createCommands)
}

export const handleRangeUpdate = (webSockets, rangeUpdate) => {
  const createCommands = (snesWebsocket) => {
    const rangeDescriptors = snesWebsocket.game.rangeDescriptors
    const rangeDescriptor = rangeDescriptors.find(rd => rd.name === rangeUpdate.name)
    rangeDescriptor.oldData = rangeDescriptor.data
    rangeDescriptor.data = rangeDescriptor.oldData.map((oldData, x) => {
      return rangeUpdate.diff[x] === 1 ? rangeUpdate.data[x] : rangeDescriptor.oldData[x]
    })
    rangeDescriptor.diff = rangeUpdate.diff
    return createRangeDescriptorBitCommands(rangeDescriptor, snesWebsocket.game.code.maxCommandLength, false)
  }
  webSockets.snesWebsocket.writeQueue.push(createCommands)
}

export const handleBitUpdate = (webSockets, bitUpdate) => {
  const createCommands = (snesWebsocket) => {
    const rangeDescriptors = snesWebsocket.game.rangeDescriptors
    const rangeDescriptor = rangeDescriptors.find(rd => rd.name === bitUpdate.name)
    const updatedData = rangeDescriptor.data.map((oldByte, oldByteIndex) => {
      if (oldByteIndex === bitUpdate.index) {
        return bitUpdate.value === 0 ? oldByte & ~bitUpdate.mask : oldByte | bitUpdate.mask
      }
      return oldByte
    })
    rangeDescriptor.diff = updatedData.map((updatedByte, updatedByteIndex) => {
      return rangeDescriptor.data[updatedByteIndex] === updatedByte ? 0 : 1
    })
    rangeDescriptor.oldData = rangeDescriptor.data
    rangeDescriptor.data = updatedData
    return createRangeDescriptorBitCommands(rangeDescriptor, snesWebsocket.game.code.maxCommandLength, false)
  }
  webSockets.snesWebsocket.writeQueue.push(createCommands)
}

export const handleExecuteAsm = (webSockets, asm) => {
  webSockets.snesWebsocket.writeQueue.push(() => asm)
}

export const handleCheat = (webSockets) => {
  webSockets.snesWebsocket.writeQueue.push(() => {
    return createTextCommands('CHEAT', 1, 2, 4)
      .concat(createTextCommands('CHEAT', 20, 2, 4))
  })
}

export const handleChat = (webSockets, message) => {
  if (webSockets.snesWebsocket.chatTimer) {
    clearTimeout(webSockets.snesWebsocket.chatTimer)
    webSockets.snesWebsocket.chatTimer = null
  }
  if (!message.sticky) {
    webSockets.snesWebsocket.chatTimer = setTimeout(() => {
      webSockets.snesWebsocket.writeQueue.push(() => {
        return createTextCommands('       ', 19, 2, 7)
      })
      webSockets.snesWebsocket.chatTimer = null
    }, 5000)
  }
  const text = (message.message ? message.message : '').substring(0, 7).padEnd(7)
  webSockets.snesWebsocket.writeQueue.push(() => {
    return createTextCommands(text, 19, 2, message.palette)
  })
}

const createTextCommands = (text, x, y, p) => {
  const palette = p >= 0 && p <= 7 ? p : 7
  return text.split('').map((c, i) => {
    const paletteWithBlackSpaces = c === ' ' ? 7 : palette
    const tileData = (textLookup(c) & 0x3FF) | ((paletteWithBlackSpaces << 10) & 0x1C00)
    return [
      LDAValue(tileData),
      STA(0x7EC608 + (64 * y) + (x + i) * 2)
    ]
  })
}

export const handleWrite = (webSockets, addresses, values, offset) => {
  addresses.forEach((address, i) => {
    if (!values[i]) {
      return
    }
    writeToSnes(webSockets, address, values[i], offset)
  })
}
