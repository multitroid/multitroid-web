import React, { useEffect } from 'react'
import { roms } from '../../util/roms'
import { useForm } from 'react-hook-form'
import { modes } from '../../util/modes'
import Instructions from './Instructions'
import { commitHash } from '../../main'
import Logo from '../Logo'
import FAQ from './FAQ'
import { useScrollToLocation } from '../../hooks/ScrollToLocation'
import Discord from '../../images/icons/Discord'
import { useNavigate } from 'react-router'


const romOptions = roms.map(rom => <option key={rom.value} value={rom.value}>{rom.name}</option>)
const modeOptions = modes.map(mode => <option key={mode.value} value={mode.value}>{mode.name}</option>)

export default () => {
  useScrollToLocation()
  const { register, handleSubmit, watch, setValue } = useForm()
  const navigate = useNavigate()
  const romFormValue = watch('rom', 'VANILLA')
  const modeFormValue = watch('mode', 'NORMAL')
  const cheatChecked = watch('cheat', false)
  const rom = roms.find(rom => rom.value === romFormValue)
  const mode = modes.find(mode => mode.value === modeFormValue)
  const showModes = rom.modes
  const showSeed = mode?.seed
  const showIntConfig = mode?.intConfig
  const romExplanation = rom?.romExplanation
  const modeExplanation = mode?.modeExplanation

  useEffect(() => {
    if (romFormValue && romFormValue !== 'VANILLA' && modeFormValue && modeFormValue !== 'NORMAL') {
      setValue('mode', 'NORMAL')
      setValue('seed', undefined)
      setValue('intConfig', undefined)
    }
  }, [setValue, romFormValue, modeFormValue])

  const onSubmit = data => {
    const queryParams = {
      rom: data.rom,
      cheat: data.cheat || false
    }
    if (data.mode) queryParams.mode = data.mode
    if (data.seed) queryParams.seed = data.seed
    if (data.intConfig) queryParams.intConfig = data.intConfig
    const uri = '/new?' + new URLSearchParams(queryParams).toString()
    navigate(uri)
  }

  return <div className="connect-container">
    <div className="p-4">
      <div className="text-center my-1 overflow-hidden">
        <Logo/>
      </div>

      <div className="container mb-5">
        <div className="text-center mb-4">
          <div className="text-secondary text-shadow-1">
            <span className="me-2 text-nowrap">[ <a href="#instructions">Instructions</a> ]</span>
            <span className="me-2 text-nowrap">[ <a href="#faq" className="me2">FAQ</a> ]</span>
            <span className="text-nowrap">[ <a target="_blank" rel="noreferrer nofollow"
              href="https://discord.gg/yQmPm46"><Discord
              className="link-icon" fill="#aaaaaa"/>Discord</a> ]</span>
          </div>
        </div>

        <div className="row g-lg-5 py-4">

          <div className="col-md-10 mx-auto col-lg-5 mb-4">
            <form className="p-4 border rounded-3 bg-black" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label className="form-label">Rom</label>
                <select
                  className="form-select"
                  {...register('rom')}>
                  {romOptions}
                </select>
              </div>

              {showModes && <div className="mb-3">
                <label className="form-label">Mode</label>
                <select
                  className="form-select"
                  {...register('mode')}>
                  {modeOptions}
                </select>
              </div>}

              {showSeed && <div className="mb-3">
                <label className="form-label">ID/Seed</label>
                <input
                  className="form-control"
                  type="text"
                  {...register('seed')}/>
              </div>}

              {showIntConfig && <div className="mb-3">
                <label className="form-label">Number of bingos needed to win</label>
                <select
                  className="form-select"
                  {...register('intConfig')}>
                  {showIntConfig.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>}

              <div className="mb-3">
                <input {...register('cheat')} className="form-check-input" type="checkbox" id="cheat"/>
                <label className="form-check-label ps-2" htmlFor="cheat">Enable cheats</label>
              </div>

              <button className="w-100 btn btn-primary mt-2" type="submit">Create session</button>

            </form>
          </div>

          <div className="col-lg-7 text-lg-start">
            {romExplanation && <>
              <h5 className="text-shadow-2 mts">Rom: {rom.name}</h5>
              {romExplanation}
            </>}

            {modeExplanation && rom?.modes && <>
              <h5 className="text-shadow-2">Game mode: {mode.name}</h5>
              {modeExplanation}
            </>}

            {cheatChecked && <>
              <h5 className="text-shadow-2">Cheats</h5>
              <div className="text-secondary">
                Cheats allow you to give everyone items, energy, ammo, events, etc. with the click of a button. We
                will show in-game that you have cheated though.
              </div>
            </>}
          </div>

        </div>

      </div>
    </div>


    <div className="bg-black p-4" id="instructions">
      <div className="container my-5">
        <h3 className="text-shadow-2">Instructions</h3>
        <Instructions/>
      </div>
    </div>

    <div className="p-4" id="faq">
      <div className="container my-5">
        <h3 className="text-shadow-2">Frequently Asked Questions</h3>
        <FAQ/>
      </div>
    </div>

    <footer className="text-center p-4 text-secondary">
      <div><small>Version {commitHash}</small></div>
      <div>
        <small>Copyright &copy; {new Date().getFullYear()}</small>
        <small>&nbsp;<a href="http://ostehovel.com" rel="noreferrer nofollow">OsteHovel</a> & Lurern</small>
      </div>
    </footer>
  </div>

}
