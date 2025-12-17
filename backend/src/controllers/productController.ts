import { Request, Response } from "express";
import { pool } from "../db";

export async function listProducts(req: Request, res: Response) {
  try {
    const { category } = req.query;
    let q;

    if (category) {
      q = await pool.query(
        `SELECT p.*, c.name as category_name, c.slug as category_slug, u.email as seller_email, u.name as seller_name
         FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
         LEFT JOIN users u ON p.seller_id = u.id
         WHERE c.slug = $1
         ORDER BY p.id`,
        [category]
      );
    } else {
      q = await pool.query(
        `SELECT p.*, c.name as category_name, c.slug as category_slug, u.email as seller_email, u.name as seller_name
         FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
         LEFT JOIN users u ON p.seller_id = u.id
         ORDER BY p.id`
      );
    }

    res.json(q.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
}

// YENİ FONKSİYON: Tekil ürün detayı
export async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    const q = await pool.query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug, u.email as seller_email, u.name as seller_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN users u ON p.seller_id = u.id
       WHERE p.id = $1`,
      [id]
    );

    if (q.rows.length === 0) {
      return res.status(404).json({ error: "Ürün bulunamadı" });
    }

    res.json(q.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
}

export async function getPopularProducts(req: Request, res: Response) {
  try {
    const q = await pool.query(
      `SELECT 
        p.*, 
        c.name as category_name, 
        c.slug as category_slug, 
        u.email as seller_email, 
        u.name as seller_name,
        COALESCE(SUM(o.quantity), 0) as total_sales
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN users u ON p.seller_id = u.id
       LEFT JOIN orders o ON p.id = o.product_id AND o.status != 'cancelled'
       GROUP BY p.id, c.name, c.slug, u.email, u.name
       ORDER BY total_sales DESC, p.id DESC
       LIMIT 5`
    );

    res.json(q.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
}

export async function createProduct(req: Request, res: Response) {
  const { title, description, price, category_id, images, features, sizes } = req.body;
  const seller_id = (req as any).user?.id;

  if (!title || price == null) return res.status(400).json({ error: "title & price required" });
  if (!seller_id) return res.status(401).json({ error: "Unauthorized" });

  const featuresObj = features && typeof features === 'object' ? { ...features } : (features ? JSON.parse(features) : {});
  if (sizes && Array.isArray(sizes)) {
    featuresObj.sizes = sizes;
  }
  const featuresJson = Object.keys(featuresObj).length ? JSON.stringify(featuresObj) : null;

  // images array'i JSON string'e çevir
  const imagesJson = images && Array.isArray(images) && images.length > 0 ? JSON.stringify(images) : null;

  const q = await pool.query(
    "INSERT INTO products (title, description, price, category_id, image_url, seller_id, features) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
    [title, description || null, price, category_id || null, imagesJson, seller_id, featuresJson]
  );

  res.status(201).json(q.rows[0]);
}

export async function deleteProduct(req: Request, res: Response) {
  const { id } = req.params;
  const user_id = (req as any).user?.id;
  const user_role = (req as any).user?.role;

  try {
    let query;
    if (user_role === 'admin') {
      query = await pool.query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);
    } else {
      query = await pool.query("DELETE FROM products WHERE id = $1 AND seller_id = $2 RETURNING *", [id, user_id]);
    }

    if (query.rows.length === 0) {
      return res.status(404).json({ error: "Ürün bulunamadı veya silme yetkiniz yok" });
    }

    res.json({ message: "Ürün başarıyla silindi" });
  } catch (err: any) {
    console.error(err);
    if (err.code === '23503') {
      return res.status(400).json({ error: "Bu ürünle ilişkili siparişler var, silinemez" });
    }
    res.status(500).json({ error: "Sunucu hatası" });
  }
}

export async function updateProduct(req: Request, res: Response) {
  const { id } = req.params;
  const { title, description, price, discount_price, category_id, images, features, sizes } = req.body;
  const user_id = (req as any).user?.id;
  const user_role = (req as any).user?.role;

  if (!user_id) return res.status(401).json({ error: "Unauthorized" });

  try {
    // Check if product exists and user has permission
    const productCheck = await pool.query(
      "SELECT id, seller_id FROM products WHERE id = $1",
      [id]
    );

    if (productCheck.rows.length === 0) {
      return res.status(404).json({ error: "Ürün bulunamadı" });
    }

    const product = productCheck.rows[0];
    if (user_role !== 'admin' && product.seller_id !== user_id) {
      return res.status(403).json({ error: "Bu ürünü düzenleme yetkiniz yok" });
    }

    // Validate discount_price
    if (discount_price !== null && discount_price !== undefined) {
      if (price && discount_price >= price) {
        return res.status(400).json({ error: "İndirimli fiyat normal fiyattan düşük olmalıdır" });
      }
    }

    // Prepare features
    const featuresObj = features && typeof features === 'object' ? { ...features } : (features ? JSON.parse(features) : {});
    if (sizes && Array.isArray(sizes)) {
      featuresObj.sizes = sizes;
    }
    const featuresJson = Object.keys(featuresObj).length ? JSON.stringify(featuresObj) : null;

    // Prepare images
    const imagesJson = images && Array.isArray(images) && images.length > 0 ? JSON.stringify(images) : null;

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramIndex++}`);
      values.push(title);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(description || null);
    }
    if (price !== undefined) {
      updates.push(`price = $${paramIndex++}`);
      values.push(price);
    }
    if (discount_price !== undefined) {
      updates.push(`discount_price = $${paramIndex++}`);
      values.push(discount_price || null);
    }
    if (category_id !== undefined) {
      updates.push(`category_id = $${paramIndex++}`);
      values.push(category_id || null);
    }
    if (images !== undefined) {
      updates.push(`image_url = $${paramIndex++}`);
      values.push(imagesJson);
    }
    if (features !== undefined || sizes !== undefined) {
      updates.push(`features = $${paramIndex++}`);
      values.push(featuresJson);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "Güncellenecek alan belirtilmedi" });
    }

    values.push(id);
    const query = await pool.query(
      `UPDATE products SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    // Fetch full product with joins
    const fullProduct = await pool.query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug, u.email as seller_email, u.name as seller_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN users u ON p.seller_id = u.id
       WHERE p.id = $1`,
      [id]
    );

    res.json(fullProduct.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
}