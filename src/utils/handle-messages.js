export const printError = (context, error, redirect) => {
  const statusDisplay = document.getElementById('status-display')

  statusDisplay.innerHTML = `
    <div class="error">
      ${context}: ${error}
    </div>
    <a class="back" href="${redirect}">Volver</a>
 `
}

export const printSuccess = (message) => {
  const resultDisplay = document.getElementById('result-display')
  resultDisplay.innerHTML = `<div class="success">${message}</div>`
}
