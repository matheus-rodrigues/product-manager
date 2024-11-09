const { Router } = require("express");
const Manager = require("../cartManager.js");
const router = Router();
const manager = new Manager();

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = await manager.getProductsInCart(cid);
  if (cart === 0) {
    return res.status(400).json({ erro: "Carrinho não encontrado" });
  }
  res.status(200).json(cart);
});

router.post("/", async (req, res) => {
  await manager.postCart();
  return res.status(201).json("Carrinho criado com sucesso");
});

router.post("/:cid/product/:pid", async (req, res) => {
  let qty = req.query.qty;
  const { cid } = req.params;
  const { pid } = req.params;
  qty ? qty : (qty = 1);
  const status = await manager.postProductInCart(+cid, +pid, +qty);
  if (status) {
    return res.status(201).json({ success: "Produto adicionado ao carrinho" });
  } else {
    return res.status(400).json({ error: "Produto não encontrado" });
  }
});

module.exports = router;
