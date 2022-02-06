const PRODUCTS_PER_PAGE = 5 // adjust to your liking

const productContainer = document.getElementById("product-container")
const productStore = {...productContainer.children}
const paginationList = document.getElementById("pagination-list")
const categoryList = document.getElementById("category-list")
const brandList = document.getElementById("brand-list")

function paginate() {
  paginationList.innerHTML = ""

  const productsArray = Array.from(productContainer.children)
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
      paginationList
        .querySelectorAll(":not(:last-child):not(:nth-last-child(2))")
        .forEach((el) => el.removeAttribute("class"))
      paginationList
        .querySelector(`:nth-child(${currentPage})`)
        .setAttribute("class", "current-page")
    }
  }

  for (let i = 1; i <= pageAmount; i++) {
    const pageButton = document.createElement("span")
    const pageNumber = document.createTextNode(i.toString())
    pageButton.appendChild(pageNumber)
    pageButton.addEventListener("click", openPage(i))
    paginationList.appendChild(pageButton)
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

  paginationList.appendChild(nextPageButton)
  paginationList.appendChild(lastPageButton)

  openPage(1)()
}

const categoryNames = []
const brandNames = []
const activeFilters = {
  categories: [],
  brands: [],
}

for (const {
  dataset: {categories, brands},
} of productContainer.children) {
  categories?.length && categoryNames.push(...categories.split(/ /))
  brands?.length && brandNames.push(...brands.split(/ /))
}

function filter({target}) {
  const [filterType, filterValue] = target.name.split(/-/)

  target.checked
    ? activeFilters[filterType].push(filterValue)
    : activeFilters[filterType].splice(
        activeFilters[filterType].indexOf(filterValue),
        1
      )

  productContainer.innerHTML = ""

  if (!activeFilters.categories.length && !activeFilters.brands.length)
    for (const product of Object.values(productStore))
      productContainer.appendChild(product)
  else {
    const matchingProducts = Object.values(productStore).filter(({dataset}) =>
      dataset.categories
        ?.split(/ /)
        .some(
          (category) =>
            activeFilters.categories.includes(category) ||
            dataset.brands
              ?.split(/ /)
              .some((brand) => activeFilters.brands.includes(brand))
        )
    )
    for (const matchingProduct of matchingProducts) {
      productContainer.appendChild(matchingProduct)
    }
  }
  paginate()
}

function createFilterCheckbox(type, name) {
  const listItem = document.createElement("li")
  listItem.dataset[type] = name
  const input = document.createElement("input")
  input.setAttribute("type", "checkbox")
  input.setAttribute("name", `${type}-${name}`)
  input.setAttribute("id", input.name)
  input.addEventListener("click", filter)
  const label = document.createElement("label")
  label.setAttribute("for", input.name)
  const span = document.createElement("span")
  span.appendChild(document.createTextNode(name))
  const small = document.createElement("small")
  small.appendChild(
    document.createTextNode(
      `(${
        Array.from(productContainer.children).filter(({dataset}) =>
          dataset[type]?.split(/ /).includes(name)
        ).length
      })`
    )
  )
  label.appendChild(span)
  label.appendChild(small)
  listItem.appendChild(input)
  listItem.appendChild(label)
  return listItem
}

for (const categoryName of categoryNames) {
  categoryList.appendChild(createFilterCheckbox("categories", categoryName))
}

for (const brandName of brandNames) {
  brandList.appendChild(createFilterCheckbox("brands", brandName))
}

paginate()