const PRODUCTS_PER_PAGE = 5 // adjust to your liking

const productContainer = document.querySelector("div.product-layout")
const productsArray = Object.values(productContainer.children)
const pageButtonList = document.querySelector("ul.pagination")

const pageAmount = Math.ceil(productsArray.length / PRODUCTS_PER_PAGE)

let currentPage

function openPage(pageNumber) {
  return function () {
    productContainer.innerHTML = ""
    currentPage = pageNumber
    const productsForCurrentPage = productsArray.slice(
      PRODUCTS_PER_PAGE * (currentPage - 1),
      PRODUCTS_PER_PAGE * (currentPage - 1) + PRODUCTS_PER_PAGE
    )
    for (const product of productsForCurrentPage)
      productContainer.appendChild(product)
    pageButtonList
      .querySelectorAll(":not(:last-child):not(:nth-last-child(2))")
      .forEach((el) => el.removeAttribute("class"))
    pageButtonList
      .querySelector(`:nth-child(${currentPage})`)
      .setAttribute("class", "current-page")
  }
}

for (let i = 1; i <= pageAmount; i++) {
  const pageButton = document.createElement("span")
  const pageNumber = document.createTextNode(i.toString())
  pageButton.appendChild(pageNumber)
  pageButton.addEventListener("click", openPage(i))
  pageButtonList.appendChild(pageButton)
}

const nextPageButton = document.createElement("span")
const lastPageButton = document.createElement("span")

nextPageButton.appendChild(document.createTextNode("››"))
nextPageButton.setAttribute("class", "icon")
nextPageButton.addEventListener("click", function () {
  currentPage < pageAmount && openPage(currentPage + 1)()
})

lastPageButton.appendChild(document.createTextNode("Último »"))
lastPageButton.setAttribute("class", "last")
lastPageButton.addEventListener("click", openPage(pageAmount))

pageButtonList.appendChild(nextPageButton)
pageButtonList.appendChild(lastPageButton)

openPage(1)()
