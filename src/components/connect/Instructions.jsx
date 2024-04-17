import samusDocument from '../../images/ai/samus_document.png'

export default () => <>
  <img className="explanation-image" alt="Samus showing you instructions" src={samusDocument}/>

  <div className="mt-3">
    <p className="fwb text-shadow-1">Download and start software that can communitcate with SNES/emulator. Preferably
      one of the following:</p>
    <ul className="text-secondary">
      <li><a href="https://github.com/alttpo/sni/releases/tag/v0.0.90">Super Nintendo Interface</a> - Use
        the <em>amd64</em> file. If that doesn&apos;t work, use the <em>386</em> file (assuming you&apos;re on windows).
      </li>
      <li><a href="https://github.com/Skarsnik/QUsb2snes/releases">QUsb2Snes</a></li>
    </ul>
  </div>

  <div>
    <p className="fwb text-shadow-1">SD2SNES - for those who play on a SNES console</p>
    <ul className="text-secondary">
      <li>Right
        click the tray icon of SNI/QUsb2Snes (bottom right of your screen) and check that the SNES is listed
        under <em>Devices</em>.
      </li>
      <li>Start the game</li>
      <li>Create a session on this webpage</li>
      <li>The SNES should be listed right under the header. Type your name in the box, then click Connect to play.</li>
    </ul>
    <p className="fwb text-shadow-1">Emulator - for those who play on a PC</p>
    <ul className="text-secondary">
      <li>Use the snes9x emulator from <a
        href="https://github.com/Skarsnik/snes9x-emunwa/tags" rel="noreferrer">here</a>. Regular snes9x will not work.
      </li>
      <li>If using QUsb2Snes; Right click the tray icon (bottom right of your screen) and make sure that <em>Devices-&gt;Enable
        EmuNetworkAccess</em> is enabled.
      </li>
      <li>Start the emulator</li>
      <li>Netplay-&gt;Enable Emu Network Control should be checked</li>
      <li>Start the game (load the rom file)</li>
      <li>Create a session on this webpage</li>
      <li>The emulator should listed right under the header. Type your name in the box, then click Connect to play.</li>
    </ul>
    <p className="fwb text-shadow-1">Troubleshooting</p>
    <ul className="text-secondary">
      <li>
        If you are using Chrome web browser, go into the settings and <span className="text-primary">turn off Memory
        Saver</span> (or make an exception for this site). Otherwise chrome might hibernate the webpage and you will
        disconnect.
      </li>
      <li>
        If you experience disconnects or not syncing properly, try to have <span className="text-primary">the
        browser tab visible</span> and preferably <span className="text-primary">in focus</span>. Browsers like to
        throttle tabs that are in the background.
      </li>
      <li>
        Some people have reported adblock making you disconnect or not syncing properly, so turning it off for this site
        might help. There are no ads.
      </li>
      <li>If the SNES/emulator isn&apos;t found, go into the Options menu on the webpage and click the option that says &ldquo;Use
        X&rdquo; with
        the program you used.
      </li>
      <li>In the options, for &ldquo;IP address to usb2snes software&rdquo;, for most people it should say &ldquo;localhost&rdquo;. If your
        SNI/QUsb2snes is running on a different computer, put in that computers ip-address here.
      </li>
      <li>If using QUsb2Snes, check for a popup message that asks if you want to allow multitroid to connect. It might
        be hiding behind all your open windows.
      </li>
    </ul>
    <p>
      If you need any more help, or want to give feedback, <br/>
      our Discord server is here: <a href="https://discord.gg/yQmPm46">Discord</a>
    </p>
  </div>
</>
