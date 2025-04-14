# Superlikers Lens Frontend

## Descripción del Proyecto

Este proyecto es una aplicación frontend para el escaneo de documentos utilizando la tecnología de Veryfi. Permite integrar capacidades de escaneo en diferentes micrositios a través de una configuración específica para cada campaña.

## Funcionalidades

- Integración con Veryfi para el escaneo de documentos
- Soporte para múltiples micrositios/campañas
- Configuración personalizada para cada micrositio
- Redirección automática al sitio correspondiente cuando no hay parámetros válidos

## Requisitos

- Node.js 18+
- Variables de entorno para los ID de cliente de Veryfi

## Configuración de Variables de Entorno

Es necesario configurar las siguientes variables en el archivo `.env`:

```
VITE_VERYFI_CLIENT_ID_SABA=tu_client_id_para_saba
VITE_VERYFI_CLIENT_ID_TENA=tu_client_id_para_tena
```

## Cómo Configurar un Nuevo Programa/Microsite

Para configurar un nuevo programa o microsite, sigue estos pasos:

1. Añade el nuevo Client ID de Veryfi en el archivo `.env`:
   ```
   VITE_VERYFI_CLIENT_ID_NUEVO_PROGRAMA=tu_client_id
   ```

2. Actualiza el objeto `MICROSITES` en `src/utils/config.js` añadiendo la nueva configuración:
   ```javascript
   export const MICROSITES = {
     // Configuraciones existentes...
     
     codigo_campania: {
       id: 'uid_programa',
       clientId: VITE_VERYFI_CLIENT_ID_NUEVO_PROGRAMA,
       url: 'https://url.del.microsite/',
       autoStart: false, // o true si quieres iniciar el escáner automáticamente
       defaultType: 'document' // opcional, tipo de escaneo por defecto
     }
   }
   ```

3. Asegúrate de que el `id` sea único y que el `clientId` corresponda con la variable de entorno definida.

## Uso

La aplicación se inicializa mediante parámetros de URL:
- `campaign`: Código de la campaña (debe coincidir con una clave en el objeto MICROSITES)
- `uid`: ID de usuario

Ejemplo de URL:
```
https://tuaplicacion.com/?campaign=ua&uid=123456
```

Si los parámetros no son válidos, la aplicación redirigirá al usuario al URL definido para el microsite correspondiente.