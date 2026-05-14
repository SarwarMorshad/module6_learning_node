import type { IncomingMessage, ServerResponse } from "http";
import { insertProduct, readProduct } from "../service/product.service";
import type { IProduct } from "../types/product.type";
import { parseBody } from "../utility/parsebody";

export const productController = async (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url;
  const method = req.method;

  const urlParts = url?.split("/");
  // console.log(urlParts);

  const id = urlParts && urlParts[1] === "products" ? Number(urlParts[2]) : null;
  // console.log("This is actual id:", id);

  // Get All Products
  if (url === "/products" && method === "GET") {
    const products = readProduct();

    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Product Data Retrieved Successfully",
        data: products,
      }),
    );
  }
  // Get a Single Product
  else if (method === "GET" && id !== null) {
    const products = readProduct();
    const product = products.find((p: IProduct) => p.id === id);
    // console.log(product);
    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Product Data Retrieved Successfully",
        data: product,
      }),
    );
  }
  // Create a Product
  else if (method === "POST" && url === "/products") {
    const body = await parseBody(req);
    // console.log(body);
    const products = readProduct();
    const newProduct = {
      id: Date.now(),
      ...body,
    };
    // console.log(newProduct);
    products.push(newProduct);
    insertProduct(products);

    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Product created Successfully",
        data: newProduct,
      }),
    );
  }
  // Update a Product
  else if (method === "PUT" && id !== null) {
    const body = await parseBody(req);
    const products = readProduct();

    const productIndex = products.findIndex((p: IProduct) => p.id === id);
    // console.log(productIndex);
    if (productIndex < 0) {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Product not found",
        }),
      );
      return;
    }
    products[productIndex] = { id: products[productIndex].id, ...body };
    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Product updated Successfully",
        data: products[productIndex],
      }),
    );
    insertProduct(products);
  }
};
