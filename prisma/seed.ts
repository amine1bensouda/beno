import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const bleuOceanic = await prisma.category.create({
    data: {
      name: "Bleu Océanic",
      nameAr: "Bleu Océanic",
      slug: "bleu-oceanic",
    },
  });

  const lavande = await prisma.category.create({
    data: {
      name: "Lavande",
      nameAr: "Lavande",
      slug: "lavande",
    },
  });

  const verdaFresh = await prisma.category.create({
    data: {
      name: "Verda Fresh",
      nameAr: "Verda Fresh",
      slug: "verda-fresh",
    },
  });

  await prisma.product.createMany({
    data: [
      {
        name: "BENO Aqua Matic Bleu Océanic — Lessive liquide 5L",
        nameAr: "BENO Aqua Matic Bleu Océanic — Lessive liquide 5L",
        slug: "beno-aqua-matic-bleu-oceanic-5l",
        description:
          "Lessive liquide 3 en 1 : élimine les taches, protège les fibres et préserve l'éclat des couleurs. Nouvelle formule plus concentrée, efficace dès 30°C. Format économique 5L — jusqu'à 110 lavages. Sans phosphates. Fabriqué au Maroc par Doro Industries.",
        descriptionAr:
          "منظف سائل 3 في 1: يزيل البقع، يحمي الألياف ويحافظ على لمعان الألوان. تركيبة مركزة جديدة، فعال من 30°م. عبوة اقتصادية 5 لتر — حتى 110 غسلة. بدون فوسفates. صنع في المغرب.",
        price: 129,
        compareAtPrice: 149,
        image: "/products/bleu-oceanic-poster.png",
        categoryId: bleuOceanic.id,
        featured: true,
      },
      {
        name: "BENO Aqua Matic Lavande — Lessive liquide 5L",
        nameAr: "BENO Aqua Matic Lavande — Lessive liquide 5L",
        slug: "beno-aqua-matic-lavande-5l",
        description:
          "Lessive liquide parfum lavande 3 en 1 pour un linge impeccable. Propreté en profondeur, protection des fibres et parfum longue durée. Formule concentrée, efficace dès 30°C. 5L — 110 lavages. Sans phosphates. Fabriqué au Maroc.",
        descriptionAr:
          "منظف سائل برائحة اللافندر 3 في 1 لملابس نظيفة تماماً. نظافة عميقة، حماية الألياف وعطر يدوم. تركيبة مركزة، فعال من 30°م. 5 لتر — 110 غسلة. بدون فوسفates. صنع في المغرب.",
        price: 129,
        compareAtPrice: 149,
        image: "/products/lavande-bottle.png",
        categoryId: lavande.id,
        featured: true,
      },
      {
        name: "BENO Aqua Matic Verda Fresh — Lessive liquide 5L",
        nameAr: "BENO Aqua Matic Verda Fresh — Lessive liquide 5L",
        slug: "beno-aqua-matic-verda-fresh-5l",
        description:
          "Lessive liquide parfum Verda Fresh 3 en 1 pour un linge impeccable. Propreté en profondeur, protection des fibres et fraîcheur durable. Formule concentrée à base d'aloé vera, efficace dès 30°C. 5L — 110 lavages. Sans phosphates. Fabriqué au Maroc.",
        descriptionAr:
          "منظف سائل برائحة Verda Fresh 3 في 1 لملابس نظيفة تماماً. نظافة عميقة، حماية الألياف وانتعاش يدوم. تركيبة مركزة، فعال من 30°م. 5 لتر — 110 غسلة. بدون فوسفates. صنع في المغرب.",
        price: 129,
        compareAtPrice: 149,
        image: "/products/verda-fresh.png",
        categoryId: verdaFresh.id,
        featured: true,
      },
    ],
  });

  console.log("Base de données BENO initialisée avec succès.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
