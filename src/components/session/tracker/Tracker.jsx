import React from 'react'

import chargeImage from '../../../images/items/charge.png'
import iceImage from '../../../images/items/ice.png'
import waveImage from '../../../images/items/wave.png'
import spazerImage from '../../../images/items/spazer.png'
import plasmaImage from '../../../images/items/plasma.png'
import variaImage from '../../../images/items/varia.png'
import gravityImage from '../../../images/items/gravity.png'
import morphImage from '../../../images/items/morph.png'
import bombImage from '../../../images/items/bomb.png'
import springImage from '../../../images/items/springball.png'
import hiImage from '../../../images/items/hijump.png'
import speedImage from '../../../images/items/speed.png'
import spaceImage from '../../../images/items/space.png'
import screwImage from '../../../images/items/screw.png'
import xrayImage from '../../../images/items/xray.png'
import grappleImage from '../../../images/items/grappling.png'

import dashHeatShield from '../../../images/items/dash/heatshield.png'
import dashPressureValve from '../../../images/items/dash/pressurevalve.png'
import dashDoubleJump from '../../../images/items/dash/doublejump.png'

import g4 from '../../../images/G4/golden_four2.png'
import kraidImage from '../../../images/G4/kraid.png'
import ridleyImage from '../../../images/G4/ridley.png'
import draygonImage from '../../../images/G4/draygon.png'
import phantoonImage from '../../../images/G4/phantoon.png'

import animalsImage from '../../../images/animals.png'
import biblethump from '../../../images/emotes/biblethump.png'
import TrackerEquipmentItem from './TrackerEquipmentItem'
import TrackerEventImage from './TrackerEventImage'
import RangeContext from '../../../context/RangeContext'
import SessionDetailsContext from '../../../context/SessionDetailsContext'
import OptionsContext from '../../../context/OptionsContext'
import ConsumableContext from '../../../context/ConsumableContext'
import { checkGoMode } from '../../../util/gomode'
import { useContextSelector } from 'use-context-selector'
import { roms } from '../../../util/roms'


export default React.memo(() => {

  const ranges = useContextSelector(RangeContext, r => r)
  const consumables = useContextSelector(ConsumableContext, c => c)
  const sessionDetails = useContextSelector(SessionDetailsContext, sd => sd)
  const getOptionValue = useContextSelector(OptionsContext, o => o.getOptionValue)
  const rom = roms.find(rom => rom.value === sessionDetails?.game?.name)

  if (!ranges['EQUIPMENT'] ||
    !ranges['EQUIPMENT'].range ||
    !ranges['EVENT'] ||
    !ranges['EVENT'].range
  ) {
    return null
  }

  const goMode = checkGoMode(sessionDetails, getOptionValue, ranges, consumables)

  let animals = false
  let escape = false

  const eventRangeDescriptor = ranges['EVENT']
  eventRangeDescriptor.bitDescriptors.forEach((bitDescriptor) => {
    const { index, mask, name } = bitDescriptor
    const triggered = (eventRangeDescriptor.range[index] & mask) !== 0
    if (name === 'Rescued_Animals' && triggered) {
      animals = true
    } else if (name === 'Escape' && triggered) {
      escape = true
    }
  })

  return <div className="p-4 position-relative">
    <div className="d-inline-block">
      <div className="mb-2">
        <TrackerEquipmentItem bitDescriptorName={'CHARGE_BEAM'} image={chargeImage}/>
        <TrackerEquipmentItem bitDescriptorName={'ICE_BEAM'} image={iceImage}/>
        <TrackerEquipmentItem bitDescriptorName={'WAVE_BEAM'} image={waveImage}/>
        <TrackerEquipmentItem bitDescriptorName={'SPAZER'} image={spazerImage}/>
        <TrackerEquipmentItem bitDescriptorName={'PLASMA_BEAM'} image={plasmaImage}/>
      </div>

      <div className="mb-2">
        <TrackerEquipmentItem bitDescriptorName={'MORPHING_BALL'} image={morphImage}/>
        <TrackerEquipmentItem bitDescriptorName={'BOMBS'} image={bombImage}/>
        <TrackerEquipmentItem bitDescriptorName={'SPRING_BALL'} image={springImage}/>
        <TrackerEquipmentItem bitDescriptorName={'SCREW_ATTACK'} image={screwImage}/>
      </div>

      <div className="mb-2">
        <TrackerEquipmentItem bitDescriptorName={'HI_JUMP_BOOTS'} image={hiImage}/>
        <TrackerEquipmentItem bitDescriptorName={'SPEED_BOOSTER'} image={speedImage}/>
        <TrackerEquipmentItem bitDescriptorName={'SPACE_JUMP'} image={spaceImage}/>
      </div>

      <div className="mb-2">
        <TrackerEquipmentItem bitDescriptorName={'VARIA_SUIT'} image={variaImage}/>
        <TrackerEquipmentItem bitDescriptorName={'GRAVITY_SUIT'} image={gravityImage}/>
        <span style={{ width: '32px', display: 'inline-block' }} className="me-2"/>
        <TrackerEquipmentItem bitDescriptorName={'GRAPPLING_BEAM'} image={grappleImage}/>
        <TrackerEquipmentItem bitDescriptorName={'X_RAY_SCOPE'} image={xrayImage}/>
      </div>

      {rom?.value === 'DASH' && <div className="mb-2">
        <TrackerEquipmentItem rangeName={'DashEquipment'} bitDescriptorName={'HeatShield'} image={dashHeatShield}/>
        <TrackerEquipmentItem rangeName={'DashEquipment'} bitDescriptorName={'PressureValve'} image={dashPressureValve}/>
        <TrackerEquipmentItem rangeName={'DashEquipment'} bitDescriptorName={'DoubleJump'} image={dashDoubleJump}/>
      </div>}
    </div>

    <div className="d-inline-block align-top position-relative mt-2">
      <div className="d-inline-block ps-2">
        <img style={{
          top: 64,
          right: 150,
          zIndex: 0,
          opacity: animals ? 1 : 0.4,
          filter: animals ? '' : 'grayscale(100%)',
        }} src={animalsImage}/>
        {animals && <div className="animals">
          SAVED!
        </div>}
        {escape && !animals &&
          <img style={{ top: 40, right: 130, zIndex: 4, position: 'absolute' }} src={biblethump}/>}
      </div>

      <div className="d-inline-block">
        <img style={{ opacity: 0.8 }} src={g4}/>
        <TrackerEventImage bitDescriptorName={'Kraid'} top={53} right={64} zIndex={2} image={kraidImage}/>
        <TrackerEventImage bitDescriptorName={'Phantoon'} top={65} right={40} zIndex={3} image={phantoonImage}/>
        <TrackerEventImage bitDescriptorName={'Draygon'} top={56} right={0} zIndex={2} image={draygonImage}/>
        <TrackerEventImage bitDescriptorName={'Ridley'} top={0} right={13} zIndex={4} image={ridleyImage}/>
      </div>
    </div>

    {goMode && <div className="go-mode">GO-MODE</div>}

  </div>

})
