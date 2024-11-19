const socket = io();

socket.on("products", (products) => {
  const productsList = document.getElementById("products-list");
  productsList.innerHTML = "";

  products.forEach((p) => {
    const product = document.createElement("li");
    product.textContent = `ID: ${p.pid}\n, Produto:${p.title}`;
    productsList.appendChild(product);
  });
});
