import express from "express";
import cors from "cors";
import postgres from "postgres";
import fs from "fs/promises";
import path from "path";
import "dotenv/config";

const sql = postgres(process.env.DATABASE_URL);

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const cartFile = path.join(__dirname, "../backend/carrito.json");

const app = express();
app.use(cors());
app.use(express.json());


app.get("/api/productos", async (req, res) => {
  try {
    const productos = await sql`SELECT * FROM productos`;
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});



app.get("/api/cart", async (req, res) => {
  try {
    await fs.access(cartFile);
    const data = await fs.readFile(cartFile, "utf8");
    const cart = JSON.parse(data);
    res.json(cart || { items: [] });
  } catch (error) {
    res.json({ items: [] });
  }
});

app.post("/api/cart", async (req, res) => {
  try {
    const { id, cantidad = 1 } = req.body;
    const data = await fs.readFile(cartFile, "utf8").catch(() => "[]");
    const cart = JSON.parse(data || "[]");
    
    const existing = cart.items.find(item => item.id === id);
    if (existing) {
      existing.cantidad += cantidad;
    } else {
      cart.items.push({ id, cantidad });
    }
    
    await fs.writeFile(cartFile, JSON.stringify(cart, null, 2));
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error saving cart" });
  }
});

app.listen(3001, () => {
  console.log("Servidor backend funcionando en puerto 3001");
});