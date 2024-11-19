export const addEventListenerToElement = (
  elementId,
  method,
  eventType = 'click'
) => {
  const element = document.getElementById(elementId)

  if (!element) {
    console.error(`Elemento com ID "${elementId}" não encontrado.`)
    return
  }

  if (element.dataset.eventAdded === 'true') {
    return
  }

  element.addEventListener(eventType, (event) => {
    method(event)
  })

  element.dataset.eventAdded = 'true'
}
