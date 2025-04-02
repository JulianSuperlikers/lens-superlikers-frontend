const {
  VITE_VERYFI_CLIENT_ID_SABA,
  VITE_VERYFI_CLIENT_ID_TENA
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
  }
}
