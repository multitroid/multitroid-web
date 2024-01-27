import { icons } from '../components/session/map/icon/Icon'

export const iconFromName = (name) => {
  const iconFromName = icons.find(icon => icon.names.includes(name.toLowerCase()))
  if (iconFromName) {
    return name.toLowerCase()
  }
  return 'dot'
}
