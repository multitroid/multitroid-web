export function getOptionFromLocalStorage(name, defaultValue) {
  if (!window.localStorage) {
    return defaultValue
  }
  const value = localStorage.getItem('option.' + name)
  if (value === null) {
    return defaultValue
  }
  return JSON.parse(value)
}

export const setOptionInLocalStorage = (name, value) => {
  if (window.localStorage) {
    localStorage.setItem('option.' + name, JSON.stringify(value))
  }
}
