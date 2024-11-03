const fs = require("fs").promises;

class productManager {
  #path = `${__dirname}/data/products.json`;
  #encoder = "utf-8";
  constructor() {}

  #readFile = async () => {
    const string = await fs.readFile(this.#path, this.#encoder);
    return JSON.parse(string);
  };

  getProduct = async () => {
    return await this.#readFile();
  };

  getProductById = async (id) => {
    const data = await this.#readFile();
    return data.find((product) => product.id === +id);
  };
}

module.exports = productManager;
