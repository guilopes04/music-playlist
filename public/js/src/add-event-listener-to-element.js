export const addEventListenerToElement = (
  elementId,
  method,
  useIndex = false,
  eventType = 'click'
) => {
  const element = document.getElementById(elementId)

  if (!element) {
    console.error(`Elemento com ID "${elementId}" não encontrado.`)
    return
  }

  // Adiciona o evento
  element.addEventListener(eventType, (event) => {
    if (useIndex) {
      const index = Array.from(element.parentNode.children).indexOf(element)
      method(index, event)
    } else {
      method(event)
    }
  })
}
