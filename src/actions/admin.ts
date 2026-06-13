"use server";

import { prisma } from "@/lib/prisma";
import {
  ADMIN_COOKIE,
  getAdminPassword,
  getAdminSecret,
  requireAdmin,
  slugify,
} from "@/lib/admin-auth";
import { STATIC_PRODUCT_IMAGES } from "@/lib/product-images";
import { getSupabaseAdmin, isSupabaseStorageConfigured } from "@/lib/supabase-admin";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const PRODUCTS_BUCKET = "products";

type UploadedFile = Blob & { name?: string; type: string; size: number };

function getUploadedFile(formData: FormData, fieldName: string): UploadedFile | null {
  const entry = formData.get(fieldName);
  if (
    !entry ||
    typeof entry !== "object" ||
    !("arrayBuffer" in entry) ||
    typeof entry.arrayBuffer !== "function" ||
    !("size" in entry) ||
    typeof entry.size !== "number" ||
    entry.size === 0
  ) {
    return null;
  }

  return entry as UploadedFile;
}

export type ProductInput = {
  name: string;
  nameAr: string;
  slug?: string;
  description: string;
  descriptionAr: string;
  price: number;
  compareAtPrice?: number | null;
  image: string;
  categoryId: string;
  featured?: boolean;
  inStock?: boolean;
};

export async function loginAdmin(password: string) {
  if (password !== getAdminPassword()) {
    return { success: false, error: "Mot de passe incorrect." };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, getAdminSecret(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return { success: true };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

export async function getAdminStats() {
  await requireAdmin();

  const activeOrders = { status: { not: "cancelled" } };

  const [ordersCount, pendingCount, productsCount, revenue] = await Promise.all([
    prisma.order.count({ where: activeOrders }),
    prisma.order.count({ where: { status: "pending" } }),
    prisma.product.count(),
    prisma.order.aggregate({ where: activeOrders, _sum: { total: true } }),
  ]);

  return {
    ordersCount,
    pendingCount,
    productsCount,
    revenue: revenue._sum.total ?? 0,
  };
}

export async function getAdminOrders() {
  await requireAdmin();

  return prisma.order.findMany({
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateOrderStatus(orderId: string, status: string) {
  await requireAdmin();

  const allowed = ["pending", "confirmed", "delivered", "cancelled"];
  if (!allowed.includes(status)) {
    return { success: false, error: "Statut invalide." };
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  revalidatePath("/admin/orders");
  revalidatePath("/admin");

  return { success: true };
}

export async function getAdminProducts() {
  await requireAdmin();

  return prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdminProduct(id: string) {
  await requireAdmin();

  return prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
}

export async function getAdminCategories() {
  await requireAdmin();

  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function getProductImages() {
  await requireAdmin();

  const dbImages = await prisma.product.findMany({
    select: { image: true },
    distinct: ["image"],
  });

  return [...new Set([...STATIC_PRODUCT_IMAGES, ...dbImages.map((p) => p.image)])];
}

export async function uploadProductImage(formData: FormData) {
  await requireAdmin();

  const file = getUploadedFile(formData, "file");
  if (!file) {
    return { success: false as const, error: "Aucun fichier sélectionné." };
  }

  const mimeType = file.type || "application/octet-stream";
  if (!ALLOWED_IMAGE_TYPES.has(mimeType)) {
    return { success: false as const, error: "Format non supporté (JPG, PNG, WebP, GIF)." };
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return { success: false as const, error: "Fichier trop volumineux (max. 5 Mo)." };
  }

  const originalName = typeof file.name === "string" ? file.name : "upload.jpg";
  const ext = originalName.split(".").pop()?.toLowerCase() || "jpg";
  const safeExt = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext) ? ext : "jpg";
  const fileName = `product-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (isSupabaseStorageConfigured()) {
    const supabase = getSupabaseAdmin()!;
    const { error } = await supabase.storage
      .from(PRODUCTS_BUCKET)
      .upload(fileName, buffer, { contentType: mimeType, upsert: false });

    if (error) {
      return {
        success: false as const,
        error: `Upload Supabase échoué : ${error.message}. Vérifiez le bucket « ${PRODUCTS_BUCKET} » (public).`,
      };
    }

    const { data } = supabase.storage.from(PRODUCTS_BUCKET).getPublicUrl(fileName);
    return { success: true as const, url: data.publicUrl };
  }

  if (process.env.VERCEL) {
    return {
      success: false as const,
      error:
        "Upload impossible sur Vercel sans Supabase Storage. Ajoutez NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY.",
    };
  }

  const uploadsDir = path.join(process.cwd(), "public", "products");
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, fileName), buffer);

  return { success: true as const, url: `/products/${fileName}` };
}

export async function createProduct(data: ProductInput) {
  await requireAdmin();

  const slug = data.slug?.trim() || slugify(data.name);
  if (!slug) {
    return { success: false, error: "Slug invalide." };
  }

  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) {
    return { success: false, error: "Ce slug existe déjà." };
  }

  await prisma.product.create({
    data: {
      name: data.name.trim(),
      nameAr: data.nameAr.trim(),
      slug,
      description: data.description.trim(),
      descriptionAr: data.descriptionAr.trim(),
      price: data.price,
      compareAtPrice: data.compareAtPrice ?? null,
      image: data.image.trim(),
      categoryId: data.categoryId,
      featured: data.featured ?? false,
      inStock: data.inStock ?? true,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/products");

  return { success: true };
}

export async function updateProduct(id: string, data: ProductInput) {
  await requireAdmin();

  const slug = data.slug?.trim() || slugify(data.name);
  const existing = await prisma.product.findFirst({
    where: { slug, NOT: { id } },
  });
  if (existing) {
    return { success: false, error: "Ce slug est déjà utilisé." };
  }

  await prisma.product.update({
    where: { id },
    data: {
      name: data.name.trim(),
      nameAr: data.nameAr.trim(),
      slug,
      description: data.description.trim(),
      descriptionAr: data.descriptionAr.trim(),
      price: data.price,
      compareAtPrice: data.compareAtPrice ?? null,
      image: data.image.trim(),
      categoryId: data.categoryId,
      featured: data.featured ?? false,
      inStock: data.inStock ?? true,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/products");
  revalidatePath(`/products/${slug}`);

  return { success: true };
}

export async function deleteProduct(id: string) {
  await requireAdmin();

  try {
    const orderItems = await prisma.orderItem.count({ where: { productId: id } });

    if (orderItems > 0) {
      await prisma.product.update({
        where: { id },
        data: { inStock: false, featured: false },
      });
      revalidatePath("/");
      revalidatePath("/admin/products");
      return {
        success: true as const,
        message: "Produit désactivé (présent dans des commandes passées).",
      };
    }

    await prisma.product.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/products");

    return { success: true as const, message: "Produit supprimé." };
  } catch {
    return { success: false as const, error: "Impossible de supprimer ce produit." };
  }
}
