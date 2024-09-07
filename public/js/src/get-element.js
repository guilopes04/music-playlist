export const addEventListenerToElement = (
  elementId,
  method,
  useIndex = false,
  retries = 5,
  delay = 200
) => {
  const attempt = () => {
    const elements = document.getElementsByName(elementId)
    if (elements.length) {
      elements.forEach((element, index) =>
        element.addEventListener('click', () => {
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
