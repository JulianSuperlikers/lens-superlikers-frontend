const {
  VITE_VERYFI_CLIENT_ID_SABA,
  VITE_VERYFI_CLIENT_ID_TENA,
  VITE_VERYFI_CLIENT_ID_PERNOD
} = import.meta.env

export const MICROSITES = {
  sz: {
    id: 'tena',
    clientId: VITE_VERYFI_CLIENT_ID_TENA,
    url: 'https://www.circulotena.com.mx/',
    autoStart: true,
    defaultType: 'document'
  },
  ua: {
    id: 'saba',
    clientId: VITE_VERYFI_CLIENT_ID_SABA,
    url: 'https://sabaclub.com.mx/',
    autoStart: false
  },
  ti: {
    id: 'pernod',
    clientId: VITE_VERYFI_CLIENT_ID_PERNOD,
    url: 'https://www.pernodchallenge.com/',
    autoStart: false
  }
}
