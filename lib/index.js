const extractor = new (require("pdf.js-extract")).PDFExtract()
const sortBy = require("lodash.sortby")
const inRange = require("lodash.inrange")

module.exports.convert = (file, options) => {
  options = options || {}

  return new Promise((resolve, reject) => {
    extractor.extract(file, options, (error, result) => {
      if (error) reject(error)

      const pages = result.pages.reduce((pagesArray, page) => {
        let pageContent = sortBy(page.content, ["y", "x"])

        pageContent = pageContent.reduce((textsArray, text) => {
          const textContent = {
            x: text.x,
            y: text.y,
            str: text.str.trim(),
          }

          if (textContent.str) textsArray.push(textContent)
          return textsArray
        }, [])

        pagesArray.push(pageContent)
        return pagesArray
      }, [])

      resolve(pages)
    })
  })
}

module.exports.extract = (page, coordinatesStart, coordinatesEnd) => {
  const extracted = page
    .reduce((textInsideCoordinates, text) => {
      if (
        inRange(text.x, coordinatesStart.x, coordinatesEnd.x) &&
        inRange(text.y, coordinatesStart.y, coordinatesEnd.y)
      ) {
        textInsideCoordinates += text.str + "\n"
      }
      return textInsideCoordinates
    }, "")
    .trim()
  return extracted
}
