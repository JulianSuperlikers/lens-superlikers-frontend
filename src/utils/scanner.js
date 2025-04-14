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
        enableSubmit: true,
        customSubmitHandler: async (image) => {
          const deviceData = await VeryfiLens.getDeviceData()
          await this.submitDocument(deviceData, image)
        },
        debug_mode: false,
        enableLongReceiptPreview: flavor === 'long_document',
        documentModalMessage: 'No se encontró ningún documento en la imagen, por favor intenta de nuevo',
        blurModalMessage: 'La imagen está demasiado borrosa, por favor intenta de nuevo',
        retakeButtonText: 'Reintentar',
        submitButtonText: 'Enviar',
        cropButtonText: 'Recortar',
        resetButtonText: 'Reiniciar',
        dropZoneText: 'Haz clic o arrastra y suelta para subir una imagen'
      })

      await VeryfiLens.showCamera()
    } catch (error) {
      this.handleError('Initialization failed', error)
    }
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
