const extractor = new (require("pdf.js-extract")).PDFExtract()

module.exports.convert = (file, options) => {
  options = options || {}

  return new Promise((resolve, reject) => {
    extractor.extract(file, options, (error, result) => {
      if (error) reject(error)

      const pages = result.pages.reduce((pagesArray, page) => {
        const pageContent = page.content.reduce((textsArray, text) => {
          const textContent = {
            x: text.x,
            y: text.y,
            str: text.str,
          }
          textsArray.push(textContent)
          return textsArray
        }, [])
        pagesArray.push(pageContent)
        return pagesArray
      }, [])

      resolve(pages)
    })
  })
}
