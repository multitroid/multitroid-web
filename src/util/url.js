export const wsProtocol = () => {
  if (location.href.startsWith('https')) {
    return 'wss'
  }
  return 'ws'
}

export const getHost = () => {
  const parser = document.createElement('a')
  parser.href = location.href
  return parser.host
}
