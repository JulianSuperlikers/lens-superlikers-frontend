/**
 * Genera un UUID v4 a partir de un string
 * Esto asegura que el mismo string siempre produzca el mismo UUID
 * @param input - String a convertir en UUID
 * @returns UUID v4 string
 */
export async function generateUserUuid (input) {
  // Crear un hash SHA-256 del input usando Web Crypto API
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)

  // Convertir el hash a string hexadecimal
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

  // Tomar los primeros 32 caracteres del hash
  const hexString = hashHex.substring(0, 32)

  // Formatear como UUID v4
  // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  // donde y es 8, 9, A, o B
  const uuid = [
    hexString.substring(0, 8),
    hexString.substring(8, 12),
    '4' + hexString.substring(13, 16), // Versión 4
    ((parseInt(hexString.substring(16, 17), 16) & 0x3) | 0x8).toString(16) + hexString.substring(17, 20), // Variant bits
    hexString.substring(20, 32)
  ].join('-')

  return uuid
}
