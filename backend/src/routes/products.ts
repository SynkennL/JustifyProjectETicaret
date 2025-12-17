import { Router } from "express";
import { listProducts, createProduct, deleteProduct, getPopularProducts, getProductById, updateProduct } from "../controllers/productController";
import { authenticateToken } from "../middlewares/auth";

const router = Router();


router.get("/popular", getPopularProducts);
router.get("/:id", getProductById);
router.get("/", listProducts);

router.post("/", authenticateToken, createProduct);
router.patch("/:id", authenticateToken, updateProduct);
router.delete("/:id", authenticateToken, deleteProduct);

export default router;