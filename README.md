# extract-pdf-by-coordinates

Extract text from a specific area by coordinates in PDF files.

```console
$ npm install extract-pdf-by-coordinates
```

---

## Usage

### `convert(file, options)`

- `file`: string of the PDF file path
- `options`: object with [PDF.js options](https://github.com/ffalt/pdf.js-extract#options)

Returns a Promise which resolves into an array where each item is a page from the PDF. Each page is an array which contains all the text elements extracted from it. The text elements are objects with `x`, `y`, and `str` properties.

### `extract(page, start, end)`

- `page`: array of text elements
- `start` & `end`: object with `x` and `y` properties

Returns a string which contains the texts extracted from the set of coordinates. Texts are separated by a new line.

---

## Example

A good case for where this will be useful is if you are working with PDF files which have a consistent template, like bills for example.

Suppose we have an archive with a bunch of electricity bills and we want to know how much energy was consumed for the entire time period:

Given that all of the files have the same structure, we can simply pinpoint the area that we want to extract the text from.

![Electricity bill example](https://raw.githubusercontent.com/sujpdo/extract-pdf-by-coordinates/master/Electricity%20bill%20example.png)

In this case, since we only care about the total kW⋅h of each electricity bill, our set of coordinates will only include one text element. But normally if you wish to extract a group of text elements, the module will return everything inside your defined coordinates with each text element separated by line.

```javascript
import { convert, extract } from "extract-pdf-by-coordinates"

let totalConsumed = 0

convert("./bills.pdf")
  .then(pages => {
    for (const page of pages) {
      const monthConsumption = extract(
        page,
        { x: 300, y: 520 },
        { x: 345, y: 540 }
      )
      totalConsumed += monthConsumption
    }
  })
  .catch(error => {
    console.log(error)
  })
```
