const fs = require("fs").promises;
const Manager = require("./productManager.js");
const _dirname = require("./utils.js");

class cartManager {
  #productManager = new Manager();
  #path = `${_dirname}/data/carts.json`;
  #encoder = "utf-8";
  constructor() {}
  #readFile = async () => {
    const string = await fs.readFile(this.#path, this.#encoder);
    return JSON.parse(string);
  };
  #writeFile = async (data) => {
    await fs.writeFile(this.#path, JSON.stringify(data));
  };
  #getCartById = async (cid) => {
    const data = await this.#readFile();
    return data.find((cart) => cart.cid === +cid);
  };
  getProductsInCart = async (cid) => {
    const selectedCart = await this.#getCartById(+cid);
    const productsInCart = [];
    try {
      for (const e of selectedCart.products) {
        const product = await this.#productManager.getProductById(+e.produto);
        productsInCart.push(product.title);
      }
    } catch (e) {
      //carrinho não encontrado
      return 0;
    }

    return productsInCart;
  };
  postCart = async () => {
    const carts = await this.#readFile();
    const newCart = {};
    try {
      newCart.cid = carts[carts.length - 1].cid + 1; //incremento automático de cid
      newCart.products = [];
    } catch (e) {
      //nenhum carrinho ainda
      newCart.cid = 1;
      newCart.products = [];
    }
    carts.push(newCart);
    await this.#writeFile(carts);
  };
  postProductInCart = async (cid, pid, qty) => {
    const product = await this.#productManager.getProductById(pid);
    const data = await this.#readFile();
    const index = data.findIndex((cart) => cart.cid === +cid);
    const cart = data.find((cart) => cart.cid === +cid);
    let check = 0;
    let status = 1;
    cart.products.forEach((e) => {
      try {
        if (product.pid === e.produto) {
          // produto no carrinho
          e.quantidade += qty;
        } else {
          check++;
        }
      } catch (e) {
        status = 0;
      }
    });
    if (cart.products.length === check) {
      // sem produto no carrinho
      const productToAdd = {
        produto: product.pid,
        quantidade: qty,
      };
      cart.products.push(productToAdd);
    }
    data[index] = { ...cart };
    await this.#writeFile(data);
    return status;
  };
}

module.exports = cartManager;
