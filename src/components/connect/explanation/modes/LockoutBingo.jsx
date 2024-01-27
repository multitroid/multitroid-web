import samusBingo from '../../../../images/ai/samus_bingo.png'

export default () => <>
  <img className="explanation-image" alt="Samus explaining bingo" src={samusBingo}/>

  <p className="text-secondary">
    Lockout bingo is similar to bingo, but two (or more) sessions race each other to complete tiles. The team with
    the most fulfilled tiles wins.
  </p>

  <p className="text-secondary">
    ID/seed is used to generate the bingo board. If two sessions use the same id/seed, they will be racing each
    other. So to get a race going:
  </p>

  <ol className="text-secondary">
    <li>Team 1 creates a lockout bingo session.</li>
    <li>Team 1 looks at their bingo board and there should be a bingo ID underneath. Give this ID to the other teams.</li>
    <li>Every other team creates a lockout bingo session and uses this ID in the id/seed input.</li>
  </ol>

  <p className="text-secondary">
    The bingo tiles will be colored based on if the tile was completed by your session (green),
    a different session (red), or impossible to complete by any session (gray). There will also be a scoreboard
    underneath the bingo board in each session.
  </p>
</>
