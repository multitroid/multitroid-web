import React from 'react'
import ChallengeContext from '../../context/ChallengeContext'
import SessionDetailsContext from '../../context/SessionDetailsContext'
import { useContextSelector } from 'use-context-selector'

export default React.memo(() => {

  const sessionId = useContextSelector(SessionDetailsContext, sd => sd.id)
  const challenge = useContextSelector(ChallengeContext, c => c)

  if (!challenge || Object.entries(challenge.objectives).length === 0) {
    return null
  }

  const objectives = Object.entries(challenge.objectives)

  return <>
    <div>Challenge</div>
    {objectives.map(objective => {
      const status = objective[1] === sessionId ? 'Done!' : objective[1] ? 'Failed!' : 'In progress'
      const color = objective[1] === sessionId ? 'limegreen' : objective[1] ? 'red' : 'gray'
      return <div key={objective[0]} className="mb-2">
        <div>{objective[0]}</div>
        <div style={{ color: color }}>{status}</div>
      </div>
    })}
  </>
})
