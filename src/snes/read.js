import { getOffset } from '../util/snes'
import { sleep } from '../util/sleep'
import { DisconnectedFromServer, DisconnectedFromSnes, SnesReadTimeout } from '../util/error'

export const readFromSnes = async (webSockets, addresses, offset = true, timeout = 5000) => {
  if (webSockets.snesWebsocket.readyState !== webSockets.snesWebsocket.OPEN) {
    throw new DisconnectedFromSnes()
  }
  if (webSockets.serverWebsocket.readyState !== webSockets.serverWebsocket.OPEN) {
    throw new DisconnectedFromServer()
  }
  const readRequest = {
    reads: 0,
    toRead: addresses.length,
    sizes: addresses.map(a => a[1]),
    blobs: [],
    data: [],
  }
  webSockets.snesWebsocket.readQueue.push(readRequest)
  for (const address of addresses) {
    const addressWithOffsetHex = (offset ? getOffset(address[0]) : address[0]).toString(16)
    const length = address[1].toString(16)
    const json = JSON.stringify({
      Opcode: 'GetAddress',
      Space: 'SNES',
      Operands: [addressWithOffsetHex, length]
    })
    await sleep(10)
    if (webSockets.snesWebsocket.readyState === webSockets.snesWebsocket.OPEN) {
      webSockets.snesWebsocket.send(json)
    } else {
      throw new DisconnectedFromSnes()
    }
  }
  const closeSnesWs = () => readRequest.reject(new DisconnectedFromSnes())
  webSockets.snesWebsocket.addEventListener('close', closeSnesWs)
  const closeServerWs = () => readRequest.reject(new DisconnectedFromServer())
  webSockets.serverWebsocket.addEventListener('close', closeServerWs)
  try {
    return await Promise.race([
      new Promise((resolve, reject) => {
        readRequest.resolve = resolve
        readRequest.reject = reject
      }),
      (async () => {
        await sleep(timeout)
        throw new SnesReadTimeout()
      })(),
    ])
  } finally {
    webSockets.snesWebsocket.removeEventListener('close', closeSnesWs)
    webSockets.serverWebsocket.removeEventListener('close', closeServerWs)
  }
}

export const parseBlobData = (snesWebsocket, data) => {
  const read = snesWebsocket.readQueue[0]
  if (!read.blobs[read.reads]) {
    read.blobs[read.reads] = []
  }
  read.blobs[read.reads].push(data)

  const totalBlobSizes = read.blobs[read.reads].reduce((acc, cur) => acc + cur.size, 0)

  if (totalBlobSizes >= read.sizes[read.reads]) {
    read.reads++
  }

  if (read.reads === read.toRead) {
    snesWebsocket.readQueue.shift()

    let processed = 0
    const readBlobs = (blobs, index, index2) => {
      const blob = blobs[index][index2]
      const fileReader = new FileReader()
      fileReader.onload = function () {
        if (!read.data[index]) {
          read.data[index] = []
        }
        read.data[index].push(Array.from(new Uint8Array(this.result)))
        const lastBlobInArray = index2 === blobs[index].length - 1
        if (lastBlobInArray) {
          processed++
        }
        if (processed === blobs.length) {
          const finishedData = read.data.map(d => d.reduce((acc, cur) => acc.concat(cur), []))
          read.resolve(finishedData)
          return
        }
        readBlobs(blobs, lastBlobInArray ? ++index : index, lastBlobInArray ? 0 : ++index2)
      }
      fileReader.readAsArrayBuffer(blob)
    }

    readBlobs(read.blobs, 0, 0)
  }
}

export const createOptimizedReads = (game) => {
  const optimizedReads = []

  const rangeDescriptorThings = game.rangeDescriptors.map(rd => {
    return {
      address: rd.startAddress,
      length: rd.length
    }
  })

  const consumableThings = game.consumables.map(c => {
    return {
      address: c.address,
      length: c.bits ? (c.bits / 2) : 16
    }
  })

  const statusThings = game.statuses.map(c => {
    return {
      address: c.address,
      length: c.bits ? (c.bits / 2) : 16
    }
  })

  const sorted = rangeDescriptorThings
    .concat(consumableThings)
    .concat(statusThings)
    .sort((a, b) => a.address - b.address)

  let readEnd = 0
  sorted.forEach((s, i) => {
    let size = s.length
    if (readEnd < s.address + s.length) {
      let iLookAhead = i + 1
      while (iLookAhead < sorted.length) {
        const lookAheadToByte = s.address + size + 1024
        const sAhead = sorted[iLookAhead]
        if (lookAheadToByte >= sAhead.startAddress) {
          size = sAhead.startAddress + sAhead.length - s.address
        } else {
          break
        }
        iLookAhead++
      }

      optimizedReads.push({
        startAddress: s.address,
        size: size
      })

      readEnd = s.address + size
    }
  })

  return optimizedReads
}

export const readEverythingFromSnes = async (webSockets) => await readFromSnes(
  webSockets,
  webSockets.snesWebsocket.sessionDetails.optimizedReads.map(read =>
    [read.startAddress, read.size]
  )
)

export const readRangesFromSnesData = (webSockets, data) => {
  return webSockets.snesWebsocket.game.rangeDescriptors.map((rangeDescriptor) => {
    rangeDescriptor.data = readRangeFromOptimized(webSockets, data, rangeDescriptor.startAddress, rangeDescriptor.length)
    rangeDescriptor.oldData = rangeDescriptor.data
    return rangeDescriptor
  })
}

export const readRangeFromOptimized = (webSockets, data, startAddress, length) => {
  const optimized = webSockets.snesWebsocket.sessionDetails.optimizedReads
    .find(optimized => startAddress >= optimized.startAddress && startAddress < optimized.startAddress + optimized.size)

  const start = startAddress - optimized.startAddress
  const end = start + length
  const dataIndex = webSockets.snesWebsocket.sessionDetails.optimizedReads.indexOf(optimized)
  return data[dataIndex].slice(start, end)
}

export const readConsumablesFromSnesData = (webSockets, data) => {
  return webSockets.snesWebsocket.game.consumables.map(consumable => {
    consumable.value = readConsumableValueFromOptimized(webSockets, consumable, data)
    consumable.oldValue = consumable.value ? consumable.value : 0
    return consumable
  })
}

export const readConsumableValueFromOptimized = (webSockets, consumable, data) => {
  const consumableAddress = consumable.address
  const optimized = webSockets.snesWebsocket.sessionDetails.optimizedReads
    .find(optimized => consumableAddress >= optimized.startAddress && consumableAddress < optimized.startAddress + optimized.size)

  const startAddress = consumableAddress - optimized.startAddress
  const dataArray = data[webSockets.snesWebsocket.sessionDetails.optimizedReads.indexOf(optimized)]

  if (consumable.bits && consumable.bits === 8) {
    return dataArray[startAddress]
  } else {
    return dataArray[startAddress] | (dataArray[startAddress + 1] << 8)
  }
}

export const readStatusesFromSnesData = (webSockets, data) => {
  return webSockets.snesWebsocket.game.statuses.map(status => {
    const newStatusValue = readStatusValueFromOptimized(webSockets, status, data)
    if (status.value !== newStatusValue) {
      status.value = newStatusValue
      status.changed = true
    } else {
      status.changed = false
    }
    return status
  })
}

export const readStatusValueFromOptimized = (webSockets, status, data) => {
  const statusAddress = status.address
  const optimized = webSockets.snesWebsocket.sessionDetails.optimizedReads
    .find(optimized => statusAddress >= optimized.startAddress && statusAddress < optimized.startAddress + optimized.size)

  const startAddress = statusAddress - optimized.startAddress
  const dataArray = data[webSockets.snesWebsocket.sessionDetails.optimizedReads.indexOf(optimized)]

  let value

  if (status.bits && status.bits === 8) {
    value = dataArray[startAddress]
  } else {
    value = dataArray[startAddress] | (dataArray[startAddress + 1] << 8)
  }

  if (status.divider) {
    value = Math.floor(value / status.divider)
  }

  return value
}
