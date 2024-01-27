import React from 'react'
import OptionsContext from '../../../context/OptionsContext'
import Option from './Option'
import SessionDetailsContext from '../../../context/SessionDetailsContext'
import { useContextSelector } from 'use-context-selector'
import { snesToPc } from '../../../util/snes'
import fileDownload from 'js-file-download'

const defaultPorts = {
  'Super Nintendo Interface': 23074,
  'QUsb2snes': 23074,
  'Crowd Control': 36952,
  'usb2snes': 8080,
}

const downloadPatch = (game) => {
  const { hijackCode, hijackLocation } = game.code
  const size = hijackCode.length
  const offset = snesToPc(hijackLocation)

  const data = [
    0x50, 0x41, 0x54, 0x43, 0x48, //header
    (offset >> 18), (offset >> 8), (offset & 0xFF), //location to patch in the file
    (size >> 8), size,
    ...hijackCode,
    0x45, 0x4F, 0x46 //EOF
  ]

  fileDownload(new Uint8Array(data), `multitroid-${game.name.toLowerCase()}-patch.ips`)
}

export default React.memo(({ showOptions, setShowOptions }) => {

  const game = useContextSelector(SessionDetailsContext, sessionDetails => sessionDetails?.game)
  const itemRandomizer = game?.name === 'ITEM_RANDOMIZER' || game?.name === 'VARIA'
  const showGoMode = useContextSelector(OptionsContext, o => o.getOptionValue('GO_MODE'))
  const showGoModeReference = useContextSelector(OptionsContext, o => o.getOptionValue('GO_MODE_REFERENCE'))
  const setOptionValue = useContextSelector(OptionsContext, o => o.setOptionValue)

  return <div className="p-4 bg-black position-relative">
    <div className="position-absolute top-0 end-0 me-2" style={{ zIndex: 100 }}>
      <span title="Close options" className="ms-2 align-middle">
        <span className="fmt fs-4 align-middle hand text-secondary" onClick={() => setShowOptions(!showOptions)}>
          &#10007;
        </span>
      </span>
    </div>

    <div className="options-grid">
      <div>
        <h5>Connectivity</h5>
        <Option name="DefaultClientName"/>
        <Option name="SD2SNES_URI"/>
        <Option name="SD2SNES_Port"/>

        {Object.entries(defaultPorts).map((entry) =>
          <div key={entry[0]}>
            <span className="link-primary hand" onClick={() => setOptionValue('SD2SNES_Port', entry[1])}>
              Use {entry[0]} ({entry[1]})
            </span>
          </div>
        )}
      </div>

      <div className="">
        <h5>Panels</h5>
        <Option name="MAP"/>
        <Option name="RoutePlanner"/>
        <Option name="CHAT"/>
        <Option name="EQUIPMENT"/>
        <Option name="EVENT"/>
        <Option name="ITEM"/>
        <Option name="DOOR"/>
        <Option name="BrowserSourceLinks"/>
      </div>

      <div>
        <h5>Map</h5>
        <Option name="MAP_ZOOM_SMALL"/>
        <Option name="MAP_MARKER_PULSE"/>
        <Option name="MAP_MARKER_SIZE"/>
        <Option name="MapColorUnvisited"/>
        <Option name="MapColorVisited"/>
      </div>

      {itemRandomizer && <div>
        <div className="pb-4">
          <h5>Go-mode</h5>
          <Option name="GO_MODE"/>
          <Option name="GO_MODE_REFERENCE"/>
        </div>
      </div>}

      <div>
        <div className="pb-4">
          <h5>Misc</h5>
          <Option name="CINEMATIC_BOSS_FIGHTS"/>
          <Option name="Debug"/>
          <Option name="Disconnect_Sound"/>
          {window.speechSynthesis && <Option name="TextToSpeech"/>}
        </div>
        {game && <div className="pb-4">
          <h5>Manual patch</h5>
          <div className="text-secondary">(if automatic patching isn&apos;t working)</div>
          <div className="link-primary hand" onClick={() => downloadPatch(game)}>Download .ips patch</div>
        </div>}
      </div>

    </div>

    {itemRandomizer && (showGoMode || showGoModeReference) && <div>
      <hr/>
      <h5>We can do these tricks and minor glitches (for go-mode)</h5>
      <div className="options-grid mt-3">
        <div>
          <h6>Maridia</h6>
          <Option name="GO_MODE_SUITLESS_MARIDIA"/>
          <Option name="GO_MODE_SUITLESS_MARIDIA_HARD"/>
          <Option name="GO_MODE_SUITLESS_MARIDIA_HARD2"/>
        </div>

        <div>
          <h6>Botwoon access</h6>
          <Option name="GO_MODE_BOTWOON_ICE_CLIP"/>
          <Option name="GO_MODE_BOTWOON_CF_CLIP"/>
          <Option name="GO_MODE_BOTWOON_SUITLESS_CF_CLIP"/>
        </div>

        <div>
          <h6>Draygon escape</h6>
          <Option name="GO_MODE_DRAYGON_GRAVITY_JUMP"/>
          <Option name="GO_MODE_DRAYGON_GRAVITY_JUMP"/>
          <Option name="GO_MODE_DOUBLE_SPRING_BALL_JUMP"/>
          <Option name="GO_MODE_BLUE_SUIT_GRAPPLE_JUMP"/>
          <Option name="GO_MODE_SPIKE_SUIT_XRAY_CLIMB"/>
        </div>

        <div>
          <h6>Lava dive</h6>
          <Option name="GO_MODE_LAVA_DIVE_GRAVITY_HI_JUMP"/>
          <Option name="GO_MODE_LAVA_DIVE_GRAVITY_JUMP"/>
          <Option name="GO_MODE_LAVA_DIVE"/>
          <Option name="GO_MODE_LAVA_DIVE_HARD"/>
        </div>

        <div>
          <h6>Worst room</h6>
          <Option name="GO_MODE_BOMB_JUMP"/>
          <Option name="GO_MODE_WORST_ROOM_WALL_JUMP"/>
          <Option name="GO_MODE_WORST_ROOM_SPRING_BALL_JUMP"/>
          <Option name="GO_MODE_WORST_ROOM_INSANE_WALL_JUMP"/>
          <Option name="GO_MODE_WORST_ROOM_FREEZE"/>
        </div>

        <div>
          <h6>Wrecked ship access</h6>
          <Option name="GO_MODE_WRECKED_SHIP_FORGOTTEN_HIGHWAY"/>
          <Option name="GO_MODE_WRECKED_SHIP_SHINE_SPARK"/>
          <Option name="GO_MODE_WRECKED_SHIP_SPRING_BALL_BOUNCE"/>
          <Option name="GO_MODE_WRECKED_SHIP_CWJ"/>
        </div>

      </div>
    </div>}

  </div>

})
