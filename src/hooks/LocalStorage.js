import { useEffect, useState } from 'react'


const getValueFromLocalStorage = (key, initialValue) => {
  const value = window.localStorage.getItem(key)
  return value ? JSON.parse(value) : initialValue
}

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      return getValueFromLocalStorage(key, initialValue)
    } catch (error) {
      console.log(error)
      return initialValue
    }
  })

  const setValue = value => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const fn = (event) => {
      if (event.storageArea === localStorage && event.key === key) {
        setStoredValue(JSON.parse(event.newValue))
      }
    }
    window.addEventListener('storage', fn, false);
    return () => {
      window.removeEventListener('storage', fn)
    }
  }, [key, initialValue])

  return [storedValue, setValue]
}
