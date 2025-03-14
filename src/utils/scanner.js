import VeryfiLens from 'veryfi-lens-wasm'
import { createSpinner } from '../components/spinner'
import { processDocument } from './process-document'
import { printError } from './handle-messages'

export class ScannerApp {
  constructor (clientId) {
    this.statusDisplay = document.getElementById('status-display')
    this.clientId = clientId

    this.captureDocument = null

    this.initializeEventListeners()
  }

  async initializeScanner (flavor) {
    try {
      await VeryfiLens.init(this.clientId, {
        lensFlavor: flavor,
        torchButton: true,
        blurModal: true,
        isDocumentModal: true,
        exitButton: true,
        enableSubmit: false,
        debug_mode: false,
        enableLongReceiptPreview: flavor === 'long_document',
        documentModalMessage: 'No se encontró ningún documento en la imagen, por favor intenta de nuevo',
        blurModalMessage: 'La imagen está demasiado borrosa, por favor intenta de nuevo',
        retakeButtonText: 'Reintentar',
        submitButtonText: 'Enviar de todas formas'
      })

      this.setupEventHandlers()

      this.updateStatus('Scanner initialized')

      await VeryfiLens.showCamera((item) => {
        if (item.image) {
          setTimeout(() => this.createSubmitButton(), 0)
          this.captureDocument = item.image
        }
      })
    } catch (error) {
      this.handleError('Initialization failed', error)
    }
  }

  setupEventHandlers () {
    VeryfiLens.onSuccess((result) => {
      this.updateStatus('Scan completed')
    })

    VeryfiLens.onFailure((error) => {
      this.handleError('Scan failed', error)
    })

    VeryfiLens.onUpdate((status) => {
      this.updateStatus(`Status: ${status.status}`)
    })
  }

  updateStatus (message) {
    this.statusDisplay.textContent = message
  }

  handleError (context, error) {
    printError(context, error)
  }

  initializeEventListeners () {
    document.querySelectorAll('.scan-btn').forEach(button => {
      button.addEventListener('click', () => {
        const scanType = button.dataset.type
        this.initializeScanner(scanType)
      })
    })
  }

  createSubmitButton () {
    const originalButton = document.querySelector('#veryfi-submit-button')
    const overlay = document.querySelector('#veryfi-video-overlay')

    const submitButton = originalButton.cloneNode()
    submitButton.style.display = 'block'
    submitButton.textContent = 'Submit'

    overlay.appendChild(submitButton)

    submitButton.addEventListener('click', async () => {
      const deviceData = await VeryfiLens.getDeviceData()
      const document = this.captureDocument

      await this.submitDocument(deviceData, document)
    })
  }

  async submitDocument (deviceData, document) {
    VeryfiLens.stop()

    const spinner = createSpinner(window.document.body, 'Subiendo el documento...')
    spinner.show()

    try {
      await processDocument(deviceData, document)
    } finally {
      spinner.hide()
    }
  }
}
