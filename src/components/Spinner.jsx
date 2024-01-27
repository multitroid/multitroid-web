import React, { Component } from 'react'
import { randomInclusive } from '../util/random'

const variants = ['spazer', 'wave', 'plasma']
const variant = variants[randomInclusive(0, variants.length - 1)]

export default class Spinner extends Component {

  render() {
    return (
      <div className="spinner-container">
        <div className={`spinner ${variant}`}>
          <div className="rect1"></div>
          <div className="rect2"></div>
          <div className="rect3"></div>
          <div className="rect4"></div>
          <div className="rect5"></div>
        </div>
      </div>
    )
  }

}
