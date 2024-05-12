var productColor, productLength, productWidth;
const STOREFRONT_ACCESS_TOKEN = "57f859c53ed397a2b6efeccb4176f44d";
const shopStore = "ba94b7";
const GRAPHQL_URL = `https://${shopStore}.myshopify.com/api/2023-01/graphql.json`;
var mainData
const newProdData = {}

async function fetchCurrentProduct() {

    const productQuery = () => `query {
          product(handle: "mogul-in-stiletto-gold-card-l") {
              id
              title
              tags
        }
      } `;

    const GRAPHQL_BODY = () => {
        return {
            async: true,
            crossDomain: true,
            method: "POST",
            headers: {
                "X-Shopify-Storefront-Access-Token": STOREFRONT_ACCESS_TOKEN,
                "Content-Type": "application/graphql",
            },
            body: productQuery(),
        };
    };

    const res = await fetch(GRAPHQL_URL, GRAPHQL_BODY());
    const data = await res.json();
    console.log("data", data.data.product.tags);
    // Given array of tags
    const tags = data.data.product.tags;

    // Initialize variables
    let productShape;

    // Iterate through each tag in the array
    tags.forEach((tag) => {
        if (tag.startsWith("color_")) {
            // Extract everything after "color_"
            productColor = tag.split("color_")[1];
        } else if (tag.startsWith("shape_")) {
            // Extract everything after "shape_"
            productShape = tag.split("shape_")[1];
        } else if (tag.startsWith("width_")) {
            // Extract everything after "shape_"
            productWidth = tag.split("width_")[1];
        } else if (tag.startsWith("size_")) {
            // Extract everything after "size_"
            productLength = tag.split("size_")[1];
        }
    });
    newProdData["productColor"] = productColor
    newProdData["productShape"] = productShape
    newProdData["productLength"] = productLength
    newProdData["productWidth"] = productWidth
    // Output the results to console
    console.log("Product Color:", productColor); // ultra_violet
    console.log("Product Shape:", productShape); // coffin
    console.log("Product Length:", productLength); // s
    console.log("Product Width:", productWidth); //
}
const showColors = async (color, activeCol) => {
    console.log('activeCol', activeCol);
    const response = await fetchColor()
    document.querySelector("#color-title").innerHTML = ""
    color?.map(obj => {
        const button = document.createElement("button")
        button.type = "button"
        button.classList.add("btn-pill")
        button.setAttribute("active-data", obj)
        if ((activeCol === obj) || !activeCol && (newProdData.productColor === obj.slice(6))) {

            button.classList.add("active")
        }
        button.style.background = response[obj]
        button.addEventListener("click", () => {
            const active = document.querySelector("#color-title .active")
            if (active) {
                active.classList.remove("active")
            }
            button.classList.add("active")
            activeId()


        })
        document.querySelector("#color-title").appendChild(button)
    })
}
const activeId = () => {
    const color = document.querySelector("#color-title .active")
    const length = document.querySelector("#length-title .active")
    const width = document.querySelector("#width-title .active")
    const avaliableColors = mainData.filter(obj => {
        if (obj.tags.includes(length.getAttribute("active-data")) && (width == null ? true : obj.tags.includes(width.getAttribute("active-data")))) {
            return obj
        }
    }).map(obj => obj.tags.find(x => x.includes("color")))
    showColors(avaliableColors, avaliableColors.includes(color.getAttribute("active-data")) ? color.getAttribute("active-data") : avaliableColors[0])
    setTimeout(() => {
        console.log(mainData.find(obj => obj.tags.includes(length.getAttribute("active-data")) && (width == null ? true : obj.tags.includes(width.getAttribute("active-data"))) && obj.tags.includes(document.querySelector("#color-title .active").getAttribute("active-data")))?.id.split("/")[4]);
        Tapcart.actions.openProduct({
            productId: `${mainData.find(obj => obj.tags.includes(length.getAttribute("active-data")) && (width == null ? true : obj.tags.includes(width.getAttribute("active-data"))) && obj.tags.includes(document.querySelector("#color-title .active").getAttribute("active-data")))?.id.split("/")[4]}`,
            isRelatedProduct: true
        })
    }, 1000)
}

async function fetchColor() {
    const getMetaData = () => `query {
    metaobjects(first: 100, type: "color") {
      edges {
        node {
          id
          handle
          fields {
            reference {
              ... on MediaImage {
                image {
                  url
                }
              }
            }
            value
            key
          }
        }
      }
    }
  }
`;

    const GRAPHQL_BODY = () => {
        return {
            async: true,
            crossDomain: true,
            method: "POST",
            headers: {
                "X-Shopify-Storefront-Access-Token": STOREFRONT_ACCESS_TOKEN,
                "Content-Type": "application/graphql",
            },
            body: getMetaData(),
        };
    };
    const res = await fetch(GRAPHQL_URL, GRAPHQL_BODY());
    const data = await res.json();
    console.log("colors data", data.data.metaobjects.edges.reduce((pre, next) => {
        const newObj = { ...pre }
        newObj[next.node.fields.find(x => x.key === "tag").value] = next.node.fields.find(x => x.key === "color").value
        return newObj
    }, {}))
    return data.data.metaobjects.edges.reduce((pre, next) => {
        const newObj = { ...pre }
        newObj[next.node.fields.find(x => x.key === "tag").value] = next.node.fields.find(x => x.key === "color").value
        return newObj
    }, {})

}
async function fetchProductGroup() {
    //     const productType = Tapcart.variables.product.tags.filter((item) =>
    //       item.startsWith("product_")
    //     )[0]; // [0] to get the first match

    //     // Extract the full values that start with "shape_"
    //     const productShape = Tapcart.variables.product.tags.filter((item) =>
    //       item.startsWith("shape_")
    //     )[0];

    //     console.log("shappee", productShape)
    //   console.log("typeeee", productType)

    const productQuery = () => `query {
          products(first:20, query:"tag:product_mogul AND tag:shape_stiletto") {
edges {
node {

              id
              title
              tags
}
}
        }
      } `;

    const GRAPHQL_BODY = () => {
        return {
            async: true,
            crossDomain: true,
            method: "POST",
            headers: {
                "X-Shopify-Storefront-Access-Token": STOREFRONT_ACCESS_TOKEN,
                "Content-Type": "application/graphql",
            },
            body: productQuery(),
        };
    };

    const res = await fetch(GRAPHQL_URL, GRAPHQL_BODY());
    const data = await res.json();
    await fetchCurrentProduct();
    let arr = [];
    console.log("productssss", data);
    mainData = data.data.products.edges.map(obj => ({ id: obj.node.id, title: obj.node.title, tags: obj.node.tags }))

    const filterData = data.data.products.edges.reduce((pre, obj) => ([...new Set([...pre, ...obj.node.tags])]), []).reduce((x, y) => {
        const newx = { ...x }
        const key = y.includes("color") ? "color" : y.includes("width") ? "width" : y.includes("size") ? "size" : y.includes("product") ? "product" : "other"
        newx[key] = [...(newx[key] || []), y]
        return newx;

    }, [])

    // console.log("data", filterData)
    document.querySelector("#length-title").innerHTML = ""
    filterData.size?.map((obj) => {
        const button = document.createElement("button")
        button.type = "button"
        button.classList.add("btn-pill")
        button.setAttribute("active-data", obj)
        console.log(newProdData.productLength, obj.split("_")[1])
        if (newProdData.productLength === obj.split("_")[1]) {
            button.classList.add("active")
        }
        button.innerHTML = obj.split("_")[1] || ""
        button.addEventListener("click", () => {
            const active = document.querySelector("#length-title .active")
            if (active) {
                active.classList.remove("active")
            }
            button.classList.add("active")
            activeId()
        })
        document.querySelector("#length-title").appendChild(button)

    })
    if (filterData.width)
        filterData.width?.map(obj => {
            const button = document.createElement("button")
            button.type = "button"
            button.classList.add("btn-pill")
            button.setAttribute("active-data", obj)
            if (newProdData.productWidth === obj.split("_")[1]) {
                button.classList.add("active")
            }
            button.innerHTML = obj.split("_")[1] || ""
            button.addEventListener("click", () => {
                const active = document.querySelector("#width-title .active")
                if (active) {
                    active.classList.remove("active")
                }
                button.classList.add("active")
                activeId()

            })
            document.querySelector("#width-title").appendChild(button)

        })
    else
        document.querySelector(".width").style.display = "none"
    showColors(filterData.color)

    const productLength = arr
        .filter((item) => item.startsWith("size_"))
        .map((item) => item.split("size_")[1]);

    // Extract all values after "width_"
    const productWidth = arr
        .filter((item) => item.startsWith("width_"))
        .map((item) => item.split("width_")[1]);

    // Extract all values after "color_"
    const productColor = arr
        .filter((item) => item.startsWith("color_"))
        .map((item) => item.split("color_")[1]);

    // Display the results
    // console.log("Product Length:", productLength);
    // console.log("Product Width:", productWidth);
    // console.log("Product Color:", productColor);
}

fetchProductGroup();

// document.querySelector("#mainButton").addEventListener("click", () => {
//     const color = document.querySelector("#color-title .active")
//     const length = document.querySelector("#length-title .active")
//     const width = document.querySelector("#width-title .active")
//     console.log('mainData', mainData.find(obj => obj.tags.includes(length.getAttribute("active-data")) && obj.tags.includes(width.getAttribute("active-data")) && obj.tags.includes(color.getAttribute("active-data"))));
// })
// setTimeout(() => fetchColor(), 500);
