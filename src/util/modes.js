import React from 'react'
import Bingo from '../components/connect/explanation/modes/Bingo'
import LockoutBingo from '../components/connect/explanation/modes/LockoutBingo'
import Normal from '../components/connect/explanation/modes/Normal'
import Challenge from '../components/connect/explanation/modes/Challenge'

export const modes = [
  {
    name: 'Normal',
    value: 'NORMAL',
    seed: false,
    modeExplanation: <Normal/>
  },
  {
    name: 'Bingo',
    value: 'BINGO',
    seed: true,
    intConfig: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12],
    modeExplanation: <Bingo/>
  },
  {
    name: 'Lockout Bingo',
    value: 'LOCKOUT_BINGO',
    seed: true,
    modeExplanation: <LockoutBingo/>
  },
  {
    name: 'Challenge #1 - Kill Ridley (GT code banned)',
    value: 'CHALLENGE_KILL_RIDLEY',
    seed: false,
    modeExplanation: <Challenge/>
  }
]
