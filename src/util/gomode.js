import { checkBit } from './range'

const equipmentRangeName = 'EQUIPMENT'

export const gates = [
  {
    name: 'Minimum',
    vanilla: (ranges, consumables) => {
      const morphingBall = checkBit('MORPHING_BALL', ranges, equipmentRangeName)
      const superMissiles = (consumables?.['Max Super Missile']?.value || 0) > 0
      const powerBombs = (consumables?.['Max Powerbomb']?.value || 0) > 0
      return morphingBall && superMissiles && powerBombs && checkMinimumEnergy(ranges, consumables)
    },
    vanillaLabel: 'Morph + Supers + PB + Min. energy',
    options: []
  },
  {
    name: 'Maridia',
    vanilla: (ranges) => {
      return checkBit('GRAVITY_SUIT', ranges, equipmentRangeName)
    },
    vanillaLabel: 'Gravity',
    options: ['GO_MODE_SUITLESS_MARIDIA', 'GO_MODE_SUITLESS_MARIDIA_HARD', 'GO_MODE_SUITLESS_MARIDIA_HARD2']
  },
  {
    name: 'Botwoon access',
    vanilla: (ranges) => {
      return checkBit('GRAVITY_SUIT', ranges, equipmentRangeName)
        && checkBit('SPEED_BOOSTER', ranges, equipmentRangeName)
    },
    vanillaLabel: 'Gravity + Speed',
    options: ['GO_MODE_BOTWOON_ICE_CLIP', 'GO_MODE_BOTWOON_SUITLESS_CF_CLIP', 'GO_MODE_BOTWOON_CF_CLIP']
  },
  {
    name: 'Draygon escape',
    vanilla: (ranges) => {
      return checkBit('GRAVITY_SUIT', ranges, equipmentRangeName)
        && checkBit('SPACE_JUMP', ranges, equipmentRangeName)
    },
    vanillaLabel: 'Gravity + Space',
    options: ['GO_MODE_DRAYGON_GRAVITY_JUMP', 'GO_MODE_DOUBLE_SPRING_BALL_JUMP', 'GO_MODE_BLUE_SUIT_GRAPPLE_JUMP', 'GO_MODE_SPIKE_SUIT_SPRING_BALL', 'GO_MODE_SPIKE_SUIT_XRAY_CLIMB']
  },
  {
    name: 'Lava dive',
    vanilla: (ranges) => {
      return checkBit('GRAVITY_SUIT', ranges, equipmentRangeName)
        && checkBit('SPACE_JUMP', ranges, equipmentRangeName)
    },
    vanillaLabel: 'Gravity + Space',
    options: ['GO_MODE_LAVA_DIVE_GRAVITY_JUMP', 'GO_MODE_LAVA_DIVE_GRAVITY_HI_JUMP', 'GO_MODE_LAVA_DIVE', 'GO_MODE_LAVA_DIVE_HARD']
  },
  {
    name: 'Worst room',
    vanilla: (ranges) => {
      return checkBit('SPACE_JUMP', ranges, equipmentRangeName)
    },
    vanillaLabel: 'Space',
    options: ['GO_MODE_BOMB_JUMP', 'GO_MODE_WORST_ROOM_WALL_JUMP', 'GO_MODE_WORST_ROOM_SPRING_BALL_JUMP', 'GO_MODE_WORST_ROOM_FREEZE', 'GO_MODE_WORST_ROOM_INSANE_WALL_JUMP']
  },
  {
    name: 'Wrecked ship access',
    vanilla: (ranges) => {
      return checkBit('SPACE_JUMP', ranges, equipmentRangeName)
        || checkBit('GRAPPLING_BEAM', ranges, equipmentRangeName)
    },
    vanillaLabel: 'Space / Grapple',
    options: ['GO_MODE_WRECKED_SHIP_FORGOTTEN_HIGHWAY', 'GO_MODE_WRECKED_SHIP_SHINE_SPARK', 'GO_MODE_WRECKED_SHIP_SPRING_BALL_BOUNCE', 'GO_MODE_WRECKED_SHIP_CWJ']
  },
]

export const checkGoMode = (sessionDetails, getOptionValue, ranges, consumables) => {
  if (sessionDetails.game.name !== 'ITEM_RANDOMIZER') {
    return false
  }
  if (!getOptionValue('GO_MODE')) {
    return false
  }

  return gates.every(gate => {
    return gate.vanilla(ranges, consumables)
      || !!gate.options.find(option => checkCondition(getOptionValue, ranges, consumables, option))
  })
}

const checkMinimumEnergy = (ranges, consumables) => {
  const varia = checkBit('VARIA_SUIT', ranges, equipmentRangeName)
  const maxEnergy = consumables?.['Max Energy']?.value || 0
  const maxReserve = consumables?.['Max Reserve']?.value || 0

  if (varia) {
    return (maxEnergy >= 399)
      || (maxEnergy >= 299 && maxReserve >= 100)
      || (maxEnergy >= 199 && maxReserve >= 200)
  }

  return maxEnergy + maxReserve >= 699
}

const checkCrystalFlash = (consumables) => {
  const cfMissiles = (consumables?.['Max Missile']?.value || 0) >= 10
  const cfSuperMissiles = (consumables?.['Max Super Missile']?.value || 0) >= 10
  const cfPowerBombs = (consumables?.['Max Powerbomb']?.value || 0) >= 15
  return cfMissiles && cfSuperMissiles && cfPowerBombs
}

export const checkCondition = (getOptionValue, ranges, consumables, optionName) => {
  const canDo = !!getOptionValue(optionName)
  if (!canDo) {
    return false
  }
  switch (optionName) {
    case 'GO_MODE_SUITLESS_MARIDIA': {
      return checkBit('HI_JUMP_BOOTS', ranges, equipmentRangeName)
        && checkBit('ICE_BEAM', ranges, equipmentRangeName)
        && checkBit('GRAPPLING_BEAM', ranges, equipmentRangeName)
    }
    case 'GO_MODE_SUITLESS_MARIDIA_HARD': {
      return checkBit('HI_JUMP_BOOTS', ranges, equipmentRangeName)
        && checkBit('SPRING_BALL', ranges, equipmentRangeName)
        && checkBit('GRAPPLING_BEAM', ranges, equipmentRangeName)
    }
    case 'GO_MODE_SUITLESS_MARIDIA_HARD2': {
      return checkBit('HI_JUMP_BOOTS', ranges, equipmentRangeName)
        && checkBit('SPRING_BALL', ranges, equipmentRangeName)
        && checkBit('ICE_BEAM', ranges, equipmentRangeName)
        && checkBit('SPACE_JUMP', ranges, equipmentRangeName)
    }
    case 'GO_MODE_BOTWOON_ICE_CLIP': {
      return checkBit('ICE_BEAM', ranges, equipmentRangeName)
    }
    case 'GO_MODE_BOTWOON_SUITLESS_CF_CLIP': {
      return checkCrystalFlash(consumables)
    }
    case 'GO_MODE_BOTWOON_CF_CLIP': {
      return checkBit('GRAVITY_SUIT', ranges, equipmentRangeName)
        && checkBit('BOMBS', ranges, equipmentRangeName)
        && checkCrystalFlash(consumables)
    }
    case 'GO_MODE_DRAYGON_GRAVITY_JUMP': {
      return checkBit('GRAVITY_SUIT', ranges, equipmentRangeName)
    }
    case 'GO_MODE_DOUBLE_SPRING_BALL_JUMP': {
      return checkBit('SPRING_BALL', ranges, equipmentRangeName)
    }
    case 'GO_MODE_BLUE_SUIT_GRAPPLE_JUMP': {
      return checkBit('GRAPPLING_BEAM', ranges, equipmentRangeName)
        && checkCrystalFlash(consumables)
    }
    case 'GO_MODE_SPIKE_SUIT_SPRING_BALL': {
      return checkBit('SPRING_BALL', ranges, equipmentRangeName)
        && checkCrystalFlash(consumables)
    }
    case 'GO_MODE_SPIKE_SUIT_XRAY_CLIMB': {
      return checkBit('X_RAY_SCOPE', ranges, equipmentRangeName)
        && checkCrystalFlash(consumables)
    }
    case 'GO_MODE_LAVA_DIVE_GRAVITY_JUMP': {
      return checkBit('GRAVITY_SUIT', ranges, equipmentRangeName)
        && checkBit('HI_JUMP_BOOTS', ranges, equipmentRangeName)
    }
    case 'GO_MODE_LAVA_DIVE_GRAVITY_HI_JUMP': {
      return checkBit('GRAVITY_SUIT', ranges, equipmentRangeName)
    }
    case 'GO_MODE_LAVA_DIVE': {
      return checkBit('HI_JUMP_BOOTS', ranges, equipmentRangeName)
    }
    case 'GO_MODE_LAVA_DIVE_HARD': {
      const varia = checkBit('VARIA_SUIT', ranges, equipmentRangeName)
      const maxEnergy = consumables?.['Max Energy']?.value || 0
      return (varia && maxEnergy >= 199) || maxEnergy >= 299
    }
    case 'GO_MODE_BOMB_JUMP': {
      return checkBit('BOMBS', ranges, equipmentRangeName)
    }
    case 'GO_MODE_WORST_ROOM_WALL_JUMP': {
      return checkBit('HI_JUMP_BOOTS', ranges, equipmentRangeName)
    }
    case 'GO_MODE_WORST_ROOM_SPRING_BALL_JUMP': {
      return checkBit('SPRING_BALL', ranges, equipmentRangeName)
    }
    case 'GO_MODE_WORST_ROOM_FREEZE': {
      return checkBit('CHARGE_BEAM', ranges, equipmentRangeName)
        && checkBit('ICE_BEAM', ranges, equipmentRangeName)
    }
    case 'GO_MODE_WORST_ROOM_INSANE_WALL_JUMP': {
      return true
    }
    case 'GO_MODE_WRECKED_SHIP_FORGOTTEN_HIGHWAY': {
      return checkBit('GRAVITY_SUIT', ranges, equipmentRangeName)
    }
    case 'GO_MODE_WRECKED_SHIP_SHINE_SPARK': {
      return checkBit('SPEED_BOOSTER', ranges, equipmentRangeName)
    }
    case 'GO_MODE_WRECKED_SHIP_SPRING_BALL_BOUNCE': {
      return checkBit('SPRING_BALL', ranges, equipmentRangeName)
    }
    case 'GO_MODE_WRECKED_SHIP_CWJ': {
      return true
    }
    default:
      return false
  }
}
