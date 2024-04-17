import samusQuestion from '../../images/ai/samus_question.png'

export default () => <>
  <img className="explanation-image" alt="Samus being confused" src={samusQuestion}/>

  <ul className="mt-3 list-unstyled">
    <li className="mb-3">
      <div className="fwb">Can I play this on my SNES console?</div>
      <div className="text-secondary">Yes! You need an SD2SNES cartridge.</div>
    </li>
    <li className="mb-3">
      <div className="fwb">Can I play this on an emulator on my PC?</div>
      <div className="text-secondary">Yes! You need to use the emulator we provide, which is modified to allow us to communicate with it.</div>
    </li>
    <li className="mb-3">
      <div className="fwb">Is there crossplay between emulator and SNES consoles?</div>
      <div className="text-secondary">Yep.</div>
    </li>
    <li className="mb-3">
      <div className="fwb">Can I use multiple emulators and/or consoles from the same PC?</div>
      <div className="text-secondary">Absolutely.</div>
    </li>
    <li className="mb-3">
      <div className="fwb">I created a session! How do my friends connect to it?</div>
      <div className="text-secondary">See the address on top of your browser? (i.e. multitroid.com/123-123-123) Copy that to the other players and they can paste it in their browsers to connect to it.</div>
    </li>
    <li className="mb-3">
      <div className="fwb">How many people can play together in the same session?</div>
      <div className="text-secondary">Technically there is no limit. We know it works with 8. Let us know :)</div>
    </li>
    <li className="mb-3">
      <div className="fwb">Can we use the same session ID multiple times?</div>
      <div className="text-secondary">Yes. If you paste the same address in your browser we will create the session again with the same settings.</div>
    </li>
    <li className="mb-3">
      <div className="fwb">Does multitroid support ROM hacks?</div>
      <div className="text-secondary">Maybe. Some. We have support for item randomizers, map counter, ascent, and others. The best way to find out would be to ask if anyone knows on <a href="https://discord.gg/yQmPm46">discord</a>, or just try it yourself.</div>
    </li>
    <li className="mb-3">
      <div className="fwb">Can we see each other in game?</div>
      <div className="text-secondary">No.</div>
    </li>
    <li className="mb-3">
      <div className="fwb">Can we see each other on the map?</div>
      <div className="text-secondary">You can see each other on the web page map, but not in game.</div>
    </li>
    <li className="mb-3">
      <div className="fwb">What is shared between players?</div>
      <ul>
        <li className="text-secondary">Energy</li>
        <li className="text-secondary">E-tanks</li>
        <li className="text-secondary">Reserve tanks</li>
        <li className="text-secondary">Missile, super missile and power bombs</li>
        <li className="text-secondary">Missile, super missile and power bomb upgrades</li>
        <li className="text-secondary">All upgrades for Samus (morph ball, hi-jump, beams, etc.)</li>
        <li className="text-secondary">Map completion</li>
        <li className="text-secondary">Opening of colored doors</li>
        <li className="text-secondary">Events (boss kills, escape sequence start, animal rescue, etc.)</li>
        <li className="text-secondary">Any item pickup, so that only one player can pick up each item.</li>
      </ul>
    </li>
    <li className="mb-3">
      <div className="fwb">What are those weird names that pop up in the lua script or on the webpage?</div>
      <div className="text-secondary">Those are to identify the console/emulators, in case you have more than one.</div>
    </li>
    <li className="mb-3">
      <div className="fwb">Does the GT-code work?</div>
      <div className="text-secondary">Yes.</div>
    </li>
    <li className="mb-3">
      <div className="fwb">What is the dot next to my name after I connect?</div>
      <div className="text-secondary">That&apos;s your map marker. You can see the same dot on the map after you start playing.</div>
    </li>
    <li className="mb-3">
      <div className="fwb">Why doesn&apos;t the webpage use https? Isn&apos;t this less secure?</div>
      <div className="text-secondary">That is correct, but unfortunately it is a limitation because we have to connect to a local websocket (SNI/QUsb2snes) to communicate with the game, and browsers won&apos;t allow this from a https site, so there is no way around it.</div>
    </li>
    <li className="mb-3">
      <div className="fwb">I just had the best idea in the history of ideas! How do I let the world know?</div>
      <div className="text-secondary">Come hang out in the &#35;multitroid channel on our <a href="https://discord.gg/yQmPm46">discord</a> server! No promises though :)</div>
    </li>
  </ul>
</>
