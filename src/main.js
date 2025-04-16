import './css/styles.css'
import { MICROSITES } from './utils/config'
import { loadMicrositeContent } from './utils/dom-loader'
import { ScannerApp } from './utils/scanner'
import { printError } from './utils/handle-messages'

const init = async () => {
  try {
    const params = new URLSearchParams(window.location.search)
    const campaign = params.get('campaign')
    const uid = params.get('uid')

    // Check if campaign is valid and exists in MICROSITES
    if (!campaign || !MICROSITES[campaign]) {
      console.error(`Campaign not found: ${campaign}`)
      return
    }

    const microsite = MICROSITES[campaign]

    // Load microsite content (html and css)
    try {
      await loadMicrositeContent(microsite)
    } catch (error) {
      printError('Failed to load microsite content', error)
      return
    }

    // Check if required parameters exist
    if (!uid) {
      console.warn('Missing uid parameter, redirecting to microsite URL')
      window.location = microsite.url
      return
    }

    // Initialize scanner
    const scannerApp = new ScannerApp(microsite.clientId)

    // Only attempt to auto-start if both required properties exist
    if (microsite.autoStart && microsite.defaultType) {
      console.log(`Auto-starting scanner with type: ${microsite.defaultType}`)

      setTimeout(async () => {
        await scannerApp.initializeScanner(microsite.defaultType || 'document')
      }, 100)
    }
  } catch (error) {
    printError('Initialization error', error)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  init()
})
