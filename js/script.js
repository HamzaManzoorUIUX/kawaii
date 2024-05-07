const STOREFRONT_ACCESS_TOKEN = "57f859c53ed397a2b6efeccb4176f44d";
const shopStore = "ba94b7";
const GRAPHQL_URL = `https://${shopStore}.myshopify.com/api/2023-01/graphql.json`;
var productColor, productLength, productWidth;

async function fetchCurrentProduct() {

    const productQuery = () => `query {
          product(handle: "kawaii-in-square-shibuya-xxl-l") {
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

    // Output the results to console
    console.log("Product Color:", productColor); // ultra_violet
    console.log("Product Shape:", productShape); // coffin
    console.log("Product Length:", productLength); // s
    console.log("Product Width:", productWidth); //
}

fetchCurrentProduct();

async function fetchProductGroup() {
    // const productType = Tapcart.variables.product.tags.filter((item) =>
    //   item.startsWith("product_")
    // )[0]; // [0] to get the first match

    // // Extract the full values that start with "shape_"
    // const productShape = Tapcart.variables.product.tags.filter((item) =>
    //   item.startsWith("shape_")
    // )[0];

    const productQuery = () => `query {
          products(first:20, query:"tag:product_kawaii and tag:shape_square") {
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
    let arr = [];
    //   console.log("productsss", data.data.products.edges);
    console.log("productsss", data.data.products.edges.map(obj => ({ id: obj.node.id, title: obj.node.title, tags: obj.node.tags })));
    console.log("productsss", data.data.products.edges.reduce((pre, obj) => {
        console.log('abc', obj.node.tags.reduce((x, y) => {
            const newx = { ...x }
            const key = y.includes("color") ? "color" : y.includes("width") ? "width" : y.includes("size") ? "size" :y.includes("product") ? "product": "other"
            newx[key] = [...(newx[key] || []), y]
            return newx;
        }, []))
        return [...new Set([...pre, ...obj.node.tags])]
    }, []));

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
    console.log("data3", data.data.metaobjects.edges);
    // console.log("data2", data.data.metaobjects.edges.filter(node => {
    //   // console.log(node.node.handle)
    //   return node.handle == productColor;

    // }))
    const colorCodeData = data.data.metaobjects.edges.filter((node) => {
        // console.log("aa", node.node.handle)
        // console.log("bb", productColor)
        return node.node.handle == productColor.replace(/_/g, "-");
    });

    console.log("code", colorCodeData);
    const hexCode = colorCodeData[0].node.fields.filter((color) => {
        return color.key == "color";
    });

    document.querySelector(
        "#color-title"
    ).style.background = `${hexCode[0].value}`;
    document.querySelector(
        "#length-title"
    ).innerHTML = `${productLength.toUpperCase()}`;
    document.querySelector(
        "#width-title"
    ).innerHTML = `${productWidth.toUpperCase()}`;

    // hexCode[0].value
}
setTimeout(() => fetchColor(), 500);
