const { Router } = require("express");
const Manager = require("../productManager.js");
const manager = new Manager();

module.exports = (io, obj) => {
  const router = Router();

  router.get("/", async (req, res) => {
    const products = await manager.getProduct();
    res.render("realTime", { products });
  });
  router.post("/", async (req, res) => {
    const product = obj;
    if (
      !product.title ||
      !product.description ||
      !product.code ||
      !product.price ||
      !product.stock ||
      !product.category
    ) {
      return res.status(400).json({ erro: "Requisição inválida." });
    }
    product.price = +product.price;
    product.stock = +product.stock;
    const products = await manager.postProduct(product);
    io.emit("products", products);
    res.status(201).json(products);
  });
  return router;
};
