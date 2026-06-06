"use server";

import { prisma } from "@/lib/prisma";
import {
  ADMIN_COOKIE,
  getAdminPassword,
  getAdminSecret,
  requireAdmin,
  slugify,
} from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

  const [ordersCount, pendingCount, productsCount, revenue] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "pending" } }),
    prisma.product.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
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

  const orderItems = await prisma.orderItem.count({ where: { productId: id } });

  if (orderItems > 0) {
    await prisma.product.update({
      where: { id },
      data: { inStock: false, featured: false },
    });
    revalidatePath("/");
    revalidatePath("/admin/products");
    return {
      success: true,
      message: "Produit désactivé (présent dans des commandes passées).",
    };
  }

  await prisma.product.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/products");

  return { success: true, message: "Produit supprimé." };
}
