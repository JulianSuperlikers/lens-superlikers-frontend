import VeryfiLens from 'veryfi-lens-wasm'
import { createSpinner } from '../components/spinner'
import { processDocument } from './process-document'
import { printError } from './handle-messages'
import { generateUserUuid } from './uuid'

export class ScannerApp {
  constructor (clientId, uid) {
    this.statusDisplay = document.getElementById('status-display')
    this.clientId = clientId
    this.uid = uid

    this.captureDocument = null

    this.initializeEventListeners()
  }

  async initializeScanner (flavor, debugMode = false) {
    try {
      // Add a spinner to indicate loading
      const spinner = createSpinner(document.body, 'Iniciando cámara...')
      spinner.show()

      // Add a delay to ensure DOM is fully ready before initializing
      await new Promise(resolve => setTimeout(resolve, 200))

      await VeryfiLens.init(this.clientId, {
        lensFlavor: flavor,
        torchButton: true,
        blurModal: true,
        isDocumentModal: true,
        exitButton: true,
        enableSubmit: true,
        customSubmitHandler: async (image) => {
          const deviceData = await VeryfiLens.getDeviceData()

          const userUuid = await generateUserUuid(this.uid)
          deviceData.user_uuid = userUuid

          await this.submitDocument(deviceData, image)
        },
        debug_mode: debugMode,
        enableLongReceiptPreview: flavor === 'long_document',
        documentModalMessage: 'No se encontró ningún documento en la imagen, por favor intenta de nuevo',
        blurModalMessage: 'La imagen está demasiado borrosa, por favor intenta de nuevo',
        retakeButtonText: 'Reintentar',
        submitButtonText: 'Enviar',
        cropButtonText: 'Recortar',
        resetButtonText: 'Reiniciar',
        dropZoneText: 'Haz clic o arrastra y suelta para subir una imagen'
      })

      // Add another short delay before showing camera
      await new Promise(resolve => setTimeout(resolve, 500))

      await VeryfiLens.showCamera()

      // Hide spinner after camera is shown
      spinner.hide()
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
