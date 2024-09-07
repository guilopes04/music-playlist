export const addEventListenerToElement = (
  elementId,
  method,
  useIndex = false,
  eventType = 'click',
  retries = 5,
  delay = 200
) => {
  const attempt = () => {
    const elements = document.getElementsByName(elementId)
    if (elements.length) {
      elements.forEach((element, index) =>
        element.addEventListener(eventType, () => {
          elementId === 'search-users-btn'
            ? console.log('elemnt', element)
            : null
          useIndex ? method(index) : method()
        })
      )
      return
    } else if (retries > 0) {
      setTimeout(() => attempt(--retries), delay)
    } else {
    }
  }

  attempt()
}
