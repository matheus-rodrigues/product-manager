const express = require("express");
const _dirname = require("./utils.js");
const handlebars = require("express-handlebars");
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const { Server } = require("socket.io");
const http = require("http");
const app = express();
const realTimeRouter = require("./routes/realTime.router.js");
const obj = {};
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = new Server(server);

app.engine("handlebars", handlebars.engine());
app.set("views", _dirname + "/views");
app.set("view engine", "handlebars");

const socketRouter = realTimeRouter(io, obj);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/realtimeproducts", socketRouter);

io.on("connection", (socket) => {
  console.log("Usuário conectado");
  socket.on("products", (products) => {
    Object.assign(obj, products);
    fetch("http://localhost:8080/api/realtimeproducts", {
      method: "POST",
    });
  });
  socket.on("disconnect", () => {
    console.log("Usuário desconectado");
  });
});

server.listen(8080, () => {});
