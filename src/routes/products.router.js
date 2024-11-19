const { Router } = require("express");
const Manager = require("../productManager.js");
const router = Router();
const manager = new Manager();

router.get("/", async (req, res) => {
  let limit = req.query.limit;
  const products = await manager.getProduct();
  if (limit) {
    let limitedProducts = [];
    limit > products.length ? (limit = products.length) : limit;
    for (let i = 0; i < limit; i++) {
      limitedProducts.push(products[i]);
    }
    return res.render("home", {
      limitedProducts,
      limit,
    });
  }
  res.render("home", {
    products,
    limit,
  });
});

router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  const product = await manager.getProductById(+pid);
  if (!product) {
    return res.status(404).json({ message: "Produto não encontrado" });
  }
  res.render("search", {
    product,
  });
});

router.post("/", async (req, res) => {
  const product = req.body;
  // if (
  //   !product.title ||
  //   !product.description ||
  //   !product.code ||
  //   !product.price ||
  //   !product.stock ||
  //   !product.category
  // ) {
  //   return res.status(400).json({ message: "Requisição inválida" });
  // }
  // product.price = +product.price;
  // product.stock = +product.stock;
  const products = await manager.postProduct(product);

  res.status(201).json(products);
});

router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const product = req.body;
  const result = await manager.putProduct(+pid, product);
  if (result === 0) {
    return res.status(400).json({ Erro: "Produto não encontrado" });
  }
  res.status(200).json({ Atualização: `Produto ${pid} atualizado` });
});

router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  await manager.deleteProduct(+pid);
  res.status(204).end();
});

module.exports = router;
