const extractor = new (require("pdf.js-extract")).PDFExtract()
const sortBy = require("lodash.sortby")
const inRange = require("lodash.inrange")

module.exports.convert = (file, options) => {
  options = options || {} // https://github.com/ffalt/pdf.js-extract#options
  /*
    OPTION                  | TYPE    | DEFAULT | DESCRIPTION
    -------------------------------------------------------------------------------------------------------------------
    firstPage               | number  | 1       | start extract at page #
    lastPage                | number  |         | stop extract at page #
    password                | string  |         | for decrypting password protected PDFs
    verbosity               | number  | -1      | log level of pdf.js
    normalizeWhitespace     | boolean | false   | replaces all occurrences of whitespace with standard spaces (0x20)
    disableCombineTextItems | boolean | false   | do not attempt to combine same line {@link TextItem}s
  */

  // Surround pdf.js-extract's callback-based function in a promise
  return new Promise((resolve, reject) => {
    extractor.extract(file, options, (error, result) => {
      if (error) reject(error)

      const pages = result.pages.reduce((pagesArray, page) => {
        let pageContent = sortBy(page.content, ["y", "x"]) // Sort text objects by position (top left)

        pageContent = pageContent.reduce((textsArray, text) => {
          const textContent = {
            x: text.x,
            y: text.y,
            str: text.str.trim(),
          }

          // Filter out empty text objects
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
  return extracted
}
