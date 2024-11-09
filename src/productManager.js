const fs = require("fs").promises;

class productManager {
  #path = `${__dirname}/data/products.json`;
  #encoder = "utf-8";
  constructor() {}
  #readFile = async () => {
    const string = await fs.readFile(this.#path, this.#encoder);
    return JSON.parse(string);
  };
  #writeFile = async (data) => {
    await fs.writeFile(this.#path, JSON.stringify(data));
  };
  getProduct = async () => {
    return await this.#readFile();
  };
  getProductById = async (pid) => {
    const data = await this.#readFile();
    return data.find((product) => product.pid === +pid);
  };
  postProduct = async (data) => {
    const products = await this.#readFile();
    try {
      data.pid = products[products.length - 1].pid + 1;
    } catch (e) {
      data.pid = 1;
    }
    data.status = true;
    products.push(data);
    await this.#writeFile(products);
  };
  putProduct = async (pid, product) => {
    const data = await this.#readFile();
    const index = data.findIndex((product) => product.pid === +pid);
    const newProduct = { pid: +pid, ...product };
    data[index] = newProduct;
    await this.#writeFile(data);
    return index;
  };
  deleteProduct = async (pid) => {
    const data = await this.#readFile();
    const index = data.findIndex((product) => product.pid === +pid);
    data.splice(index, 1);
    await this.#writeFile(data);
  };
}

module.exports = productManager;
