import express from "express";
import cors from "cors";
import postgres from "postgres";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const sql = postgres(process.env.DATABASE_URL);

const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   RUTA SEGURA DEL JSON
========================= */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 👉 SIEMPRE apunta correctamente al archivo
const cartFile = path.join(__dirname, "carrito.json");

/* =========================
   PRODUCTOS
========================= */

app.get("/api/productos", async (req, res) => {
  try {
    const productos = await sql`SELECT * FROM productos`;
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

/* =========================
   HELPERS
========================= */

const safeParseCart = (data) => {
  try {
    const parsed = JSON.parse(data);
    if (!parsed || !Array.isArray(parsed.items)) {
      return { items: [] };
    }
    return parsed;
  } catch {
    return { items: [] };
  }
};

/* =========================
   GET CART
========================= */

app.get("/api/cart", async (req, res) => {
  try {
    const data = await fs.readFile(cartFile, "utf8").catch(() => null);

    if (!data) {
      const empty = { items: [] };
      await fs.writeFile(cartFile, JSON.stringify(empty, null, 2));
      return res.json(empty);
    }

    const cart = safeParseCart(data);
    return res.json(cart);
  } catch (error) {
    console.error("GET CART ERROR:", error);
    return res.json({ items: [] });
  }
});

/* =========================
   POST CART (GUARDAR)
========================= */

app.post("/api/cart", async (req, res) => {
  try {
    const cart = {
      items: Array.isArray(req.body?.items)
        ? req.body.items
        : []
    };

    await fs.writeFile(
      cartFile,
      JSON.stringify(cart, null, 2)
    );

    return res.json(cart);
  } catch (error) {
    console.error("POST CART ERROR:", error);
    return res.status(500).json({ error: "Error saving cart" });
  }
});

/* =========================
   SERVER
========================= */

app.listen(3001, () => {
  console.log("Servidor backend funcionando en puerto 3001");
  console.log("Cart file:", cartFile);
});