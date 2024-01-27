import samusPlaying from '../../../../images/ai/samus_playing.png'

export default () => <>
  <img className="explanation-image" alt="Samus playing" src={samusPlaying}/>

  <p className="text-secondary">
    Normal is the classic multitroid mode, where players cooperate to win the game. They will share energy, ammo,
    equipment, map completion, events, etc.
  </p>
  <p className="text-secondary">
    If one player gets hit and loses 40 energy, everyone loses 40 energy. When a player picks up speed booster,
    everyone gets speed booster. If one player dies, everyone dies.
  </p>
  <p className="text-secondary">
    As soon as one player kills mother brain and starts the escape sequence, it starts for everyone.
  </p>
</>
