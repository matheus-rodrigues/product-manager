const express = require("express");
const app = express();
const productManager = require("./productManager");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const manager = new productManager();

app.get("/products", async (req, res) => {
  let limit = req.query.limit;
  const products = await manager.getProduct();
  if (limit) {
    let limitedProducts = [];
    limit > products.length ? (limit = products.length) : limit;
    for (let i = 0; i < limit; i++) {
      limitedProducts.push(products[i]);
    }
    return res.status(200).json(limitedProducts);
  }
  res.status(200).json(products);
});

app.get("/products/:pid", async (req, res) => {
  const { pid } = req.params;
  const product = await manager.getProductById(+pid);
  if (!product) {
    return res.status(404).json({ message: "Produto não encontrado" });
  }
  res.status(200).json(product);
});

app.listen(8080, () => {
  console.log(`Ouvindo na porta 8080`);
});
