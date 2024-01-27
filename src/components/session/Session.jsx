import React, { useCallback, useState } from 'react'
import { useContextSelector } from 'use-context-selector'
import loadable from '@loadable/component'
import TopBar from './TopBar'
import { commitHash } from '../../main'
import Tracker from './tracker/Tracker'
import Options from './options/Options'
import Challenge from './Challenge'
import Status from './status/Status'
import Panel from '../Panel'
import OptionsContext from '../../context/OptionsContext'
import SessionDetailsContext from '../../context/SessionDetailsContext'
import Clients from './clients/Clients'

const Map = loadable(() => import('./map/Map'))
const RoutePlanner = loadable(() => import('./routeplanner/RoutePlanner'))
const Bingo = loadable(() => import('./Bingo'))
const Ranges = loadable(() => import('./range/Ranges'))
const Chat = loadable(() => import('./Chat'))
const CinematicBossFights = loadable(() => import('./button/CinematicBossFights'))
const GoModeReference = loadable(() => import('./GoModeReference'))
const BrowserSourceLinks = loadable(() => import('./BrowserSourceLinks'))
const RoutePlannerPanel = loadable(() => import('./routeplanner/RoutePlannerPanel'))

export default React.memo(() => {

  const mode = useContextSelector(SessionDetailsContext, sd => sd.mode)
  const gameName = useContextSelector(SessionDetailsContext, sd => sd.game.name)
  const [showOptions, setShowOptions] = useState(false)
  const toggleOptions = useCallback(() => setShowOptions(!showOptions), [showOptions])

  const showBrowserSourceLinks = useContextSelector(OptionsContext, o => o.getOptionValue('BrowserSourceLinks'))
  const showRoutePlanner = useContextSelector(OptionsContext, o => o.getOptionValue('RoutePlanner'))
  const showMap = useContextSelector(OptionsContext, o => o.getOptionValue('MAP'))
  const showChat = useContextSelector(OptionsContext, o => o.getOptionValue('CHAT'))
  const showCinematicBossFights = useContextSelector(OptionsContext, o => o.getOptionValue('CINEMATIC_BOSS_FIGHTS'))
  const showGoModeReference = useContextSelector(OptionsContext, o => o.getOptionValue('GO_MODE_REFERENCE'))
  const showBingo = mode === 'BINGO' || mode === 'LOCKOUT_BINGO'
  const showChallenge = mode && mode.startsWith('CHALLENGE_')
  const itemRandomizer = gameName === 'ITEM_RANDOMIZER' || gameName === 'VARIA'
  const vanillaNormal = gameName === 'VANILLA' && mode === 'NORMAL'

  return <div className="session-container">

    {showCinematicBossFights && <CinematicBossFights/>}

    <TopBar showOptions={showOptions} setShowOptions={toggleOptions}/>

    <hr className="mt-0"/>

    <div className="px-3">

      {showOptions && <div className="border mb-3">
        <Options showOptions={showOptions} setShowOptions={setShowOptions}/>
      </div>}

      <Clients setShowOptions={toggleOptions}/>

      <div>
        <div className="panel-grid">
          <div>
            <div>
              <Status/>
            </div>
            <Panel>
              <div>
                <Tracker/>
              </div>
            </Panel>
            {showBrowserSourceLinks && <div className="mt-3">
              <Panel>
                <BrowserSourceLinks/>
              </Panel>
            </div>}
          </div>
          {itemRandomizer && showGoModeReference && <div>
            <Panel>
              <GoModeReference/>
            </Panel>
          </div>}
          {showMap && <Map/>}
          {showRoutePlanner && vanillaNormal && <div>
            <Panel>
              <RoutePlannerPanel showPopup/>
            </Panel>
          </div>}
          {showChat && <div>
            <Panel>
              <Chat/>
            </Panel>
          </div>}
          {showBingo && <div className="span2h span2v">
            <Panel>
              <Bingo/>
            </Panel>
          </div>}
          {showChallenge && <div>
            <Panel>
              <Challenge/>
            </Panel>
          </div>}
          <Ranges/>
        </div>
      </div>

    </div>

    <footer className="text-center p-4 text-secondary">
      <div><small>Version {commitHash}</small></div>
      <div>
        <small>Copyright &copy; {new Date().getFullYear()}</small>
        <small>&nbsp;<a href="http://ostehovel.com" rel="noreferrer">OsteHovel</a> & Lurern</small>
      </div>
    </footer>

  </div>

})
