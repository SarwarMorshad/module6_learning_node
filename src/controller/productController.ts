import type { IncomingMessage, ServerResponse } from "http";
import { insertProduct, readProduct } from "../service/product.service";
import type { IProduct } from "../types/product.type";
import { parseBody } from "../utility/parsebody";
import { sendResponse } from "../utility/sendResponse";

export const productController = async (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url;
  const method = req.method;

  const urlParts = url?.split("/");
  // console.log(urlParts);

  const id = urlParts?.[2] ? Number(urlParts[2]) : null;
  // console.log("This is actual id:", id);

  // Get All Products
  if (url === "/products" && method === "GET") {
    try {
      const products = readProduct();
      return sendResponse(res, 200, true, "Products Data Retrieved Successfully", products);
    } catch (error) {
      return sendResponse(res, 500, false, "Failed to retrieve products", null);
    }
  }
  // Get a Single Product
  else if (method === "GET" && id !== null) {
    try {
      const products = readProduct();
      const product = products.find((p: IProduct) => p.id === id);
      // console.log(product);
      // if product not found
      if (!product) {
        return sendResponse(res, 404, false, "Product not found", null);
      }

      return sendResponse(res, 200, true, "Product Data Retrieved Successfully", product);
    } catch (error) {
      return sendResponse(res, 500, false, "Failed to retrieve product", null);
    }
  }
  // Create a Product
  else if (method === "POST" && url === "/products") {
    try {
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

      return sendResponse(res, 201, true, "Product created Successfully", newProduct);
    } catch (error) {
      return sendResponse(res, 500, false, "Failed to create product", null);
    }
  }
  // Update a Product
  else if (method === "PUT" && id !== null) {
    try {
      const body = await parseBody(req);
      const products = readProduct();

      const productIndex = products.findIndex((p: IProduct) => p.id === id);
      // console.log(productIndex);
      if (productIndex < 0) {
        return sendResponse(res, 404, false, "Product not found", null);
      }
      products[productIndex] = { id: products[productIndex].id, ...body };
      insertProduct(products);
      return sendResponse(res, 200, true, "Product updated Successfully", products[productIndex]);
    } catch (error) {
      return sendResponse(res, 500, false, "Failed to update product", null);
    }
  }
  // Delete a Product
  else if (method === "DELETE" && id !== null) {
    try {
      const products = readProduct();
      const productIndex = products.findIndex((p: IProduct) => p.id === id);
      if (productIndex < 0) {
        return sendResponse(res, 404, false, "Product not found", null);
      }
      const deletedProduct = products.splice(productIndex, 1);
      insertProduct(products);
      return sendResponse(res, 200, true, "Product deleted Successfully", deletedProduct[0]);
    } catch (error) {
      return sendResponse(res, 500, false, "Failed to delete product", null);
    }
  }
};
