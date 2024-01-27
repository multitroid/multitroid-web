export const sleep = ms => new Promise(resolve => {
  if (ms > 0) {
    setTimeout(resolve, ms)
  } else {
    resolve()
  }
})
