export const IFRAME_LOG = `console.log = (...args) => {
  parent.window.postMessage({ type: 'log', args }, '*')
}
console.error = (...args) => {
  parent.window.postMessage({ type: 'error', args }, '*')
}
console.warn = (...args) => {
  parent.window.postMessage({ type: 'warn', args }, '*')
}
console.info = (...args) => {
  parent.window.postMessage({ type: 'info', args }, '*')
}`