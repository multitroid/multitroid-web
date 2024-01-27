import samusBingo from '../../../../images/ai/samus_bingo.png'

export default () => <>
  <img className="explanation-image" alt="Samus explaining bingo" src={samusBingo}/>

  <p className="text-secondary">
    Multitroid bingo lets you fill out bingo board tiles by completing in-game objectives.
    For example, you can be tasked to collect 40 super missiles, or killing a boss without picking up certain
    equipment.
  </p>

  <p className="text-secondary">
    ID/seed is used to generate the bingo board. Keep it blank for a randomized one, or you can input a seed to
    get the same board every time that seed is used.
  </p>

  <p className="text-secondary">
    Bingos needed to win means how many rows/columns/diagonals need to be fulfilled to win the bingo mode.
    All players will automatically be transported to the credits (in-game) when the number is met.
  </p>
</>
