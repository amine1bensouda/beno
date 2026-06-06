"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";

export type OrderInput = {
  customerName: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
};

export async function createOrder(data: OrderInput) {
  if (!data.customerName.trim() || !data.phone.trim() || !data.city.trim() || !data.address.trim()) {
    return { success: false, error: "Veuillez remplir tous les champs obligatoires." };
  }

  if (data.items.length === 0) {
    return { success: false, error: "Votre panier est vide." };
  }

  const total = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = await prisma.order.create({
    data: {
      customerName: data.customerName.trim(),
      phone: data.phone.trim(),
      city: data.city.trim(),
      address: data.address.trim(),
      notes: data.notes?.trim() || null,
      total,
      paymentMethod: "cod",
      items: {
        create: data.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
  });

  revalidatePath("/admin/orders");

  return { success: true, orderId: order.id };
}

export async function getFeaturedProducts() {
  noStore();
  return prisma.product.findMany({
    where: { featured: true, inStock: true },
    include: { category: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function getAllProducts() {
  noStore();
  return prisma.product.findMany({
    where: { inStock: true },
    include: { category: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function getProductBySlug(slug: string) {
  noStore();
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
}

export async function getCategories() {
  return prisma.category.findMany({
    include: {
      products: {
        where: { inStock: true },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });
}
