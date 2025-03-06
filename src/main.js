import './css/styles.css'
import { MICROSITES } from './utils/config'
import { loadMicrositeContent } from './utils/dom-loader'
import { ScannerApp } from './utils/scanner'

const init = async () => {
  const params = new URLSearchParams(window.location.search)
  const campaign = params.get('campaign')
  const uid = params.get('uid')

  const microsite = MICROSITES[campaign]
  await loadMicrositeContent(microsite)

  if (!campaign || !uid) {
    window.location = microsite.url
    return
  }

  const scannerApp = new ScannerApp(microsite.clientId)

  if (microsite.autoStart && microsite.defaultType) {
    scannerApp.initializeScanner(microsite.defaultType)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  init()
})
