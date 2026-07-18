var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
var import_vite = require("vite");
var import_square = require("square");
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var squareClient = new import_square.Client({
  environment: process.env.SQUARE_ENVIRONMENT || "sandbox",
  accessToken: process.env.SQUARE_PRODUCTION_API_KEY || process.env.SQUARE_SANDBOX_API_KEY || ""
});
var orders = [];
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: (/* @__PURE__ */ new Date()).toISOString() });
});
app.post("/api/process-payment", async (req, res) => {
  try {
    const {
      sourceId,
      // Square nonce/token
      customerName,
      customerEmail,
      customerPhone,
      deliveryMethod,
      address,
      items,
      subtotal,
      deliveryFee,
      total
    } = req.body;
    if (!sourceId || !customerName || !customerEmail || !items || items.length === 0) {
      return res.status(400).json({ error: "Missing required payment or order details" });
    }
    const calculatedTotal = Math.round(subtotal + deliveryFee);
    if (Math.abs(calculatedTotal - total) > 100) {
      return res.status(400).json({ error: "Order total does not match. Please try again." });
    }
    const orderId = "VF-" + Math.floor(1e5 + Math.random() * 9e5);
    const paymentsApi = squareClient.paymentsApi;
    const paymentResult = await paymentsApi.createPayment({
      sourceId,
      amountMoney: {
        amount: BigInt(total),
        // Amount in cents
        currency: "USD"
      },
      idempotencyKey: orderId,
      // Prevent duplicate charges
      customerId: `${customerEmail}`,
      receiptEmail: customerEmail,
      note: `Order from ${customerName}`
    });
    if (!paymentResult.result?.payment) {
      throw new Error("Payment processing failed");
    }
    const payment = paymentResult.result.payment;
    const newOrder = {
      id: orderId,
      customerName,
      customerEmail,
      customerPhone,
      deliveryMethod,
      address: deliveryMethod === "delivery" ? address : void 0,
      items,
      subtotal,
      deliveryFee,
      total,
      status: "Pending",
      payment: {
        status: "completed",
        transactionId: payment.id,
        method: payment.sourceType || "card",
        last4: payment.cardDetails?.card?.last4 || "XXXX"
      },
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    orders.unshift(newOrder);
    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    console.error("Payment processing error:", error);
    const errorMsg = error?.errors?.[0]?.detail || error?.message || "Payment processing failed";
    res.status(402).json({
      error: "Payment failed",
      details: errorMsg
    });
  }
});
app.post("/api/orders", (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, deliveryMethod, address, items, subtotal, deliveryFee, total } = req.body;
    if (!customerName || !customerEmail || !customerPhone || !items || items.length === 0) {
      return res.status(400).json({ error: "Missing required order details" });
    }
    const newOrder = {
      id: "VF-" + Math.floor(1e5 + Math.random() * 9e5),
      customerName,
      customerEmail,
      customerPhone,
      deliveryMethod,
      address,
      items,
      subtotal,
      deliveryFee,
      total,
      status: "Pending",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    orders.unshift(newOrder);
    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    res.status(500).json({ error: "Failed to place order", details: error?.message || error });
  }
});
app.get("/api/orders", (req, res) => {
  res.json({ orders });
});
app.patch("/api/orders/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = orders.find((o) => o.id === id);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  order.status = status;
  res.json({ success: true, order });
});
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware integrated.");
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
    console.log("Production static asset serving configured.");
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Viar Farms backend listening on http://0.0.0.0:${PORT}`);
  });
}
start().catch((err) => {
  console.error("Failed to start server:", err);
});
//# sourceMappingURL=server.cjs.map
