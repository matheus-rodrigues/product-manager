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
    return products;
  };
  putProduct = async (pid, updates) => {
    const data = await this.#readFile();
    const product = data.find((product) => product.pid === +pid);
    if (product) {
      for (const [key, newValue] of Object.entries(updates)) {
        product[key] = newValue;
      }
    } else {
      return 0;
    }
    await this.#writeFile(data);
  };
  deleteProduct = async (pid) => {
    const data = await this.#readFile();
    const index = data.findIndex((product) => product.pid === +pid);
    data.splice(index, 1);
    await this.#writeFile(data);
  };
}

module.exports = productManager;
