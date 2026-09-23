import { images } from "./images";
import { formatPrice, singleProductPrice } from "./pricing";

export type ProductId = "hair" | "skin" | "eye";

export type Product = {
  id: ProductId;
  number: string;
  name: string;
  ingredient: string;
  description: string;
  price: number;
  priceLabel: string;
  image: { src: string; placeholder: string };
  cta: string;
};

export const products: Product[] = [
  {
    id: "hair",
    number: "01",
    name: "روتين الشعر",
    ingredient: "علكات · بيوتين",
    description: "خطوة يومية بسيطة — عناية للشعر من الداخل.",
    price: singleProductPrice,
    priceLabel: formatPrice(singleProductPrice),
    image: images.products.hair,
    cta: "اكتشفي التفاصيل",
  },
  {
    id: "skin",
    number: "02",
    name: "روتين البشرة",
    ingredient: "علكات · غلوتاثيون",
    description: "لحظة إشراق — في روتين لا يُرهقكِ.",
    price: singleProductPrice,
    priceLabel: formatPrice(singleProductPrice),
    image: images.products.skin,
    cta: "اكتشفي التفاصيل",
  },
  {
    id: "eye",
    number: "03",
    name: "محيط العين",
    ingredient: "سيروم · فيتامين E",
    description: "عناية مركّزة — حيث يظهر تعب اليوم.",
    price: singleProductPrice,
    priceLabel: formatPrice(singleProductPrice),
    image: images.products.eye,
    cta: "اكتشفي التفاصيل",
  },
];

export const bundle = {
  title: "روتين VELORA الكامل",
  subtitle: "ثلاث لحظات. روتين واحد.",
  savingsLine: "عناية متكاملة — بقيمة أوضح",
  priceLabel: formatPrice(339),
  cta: "اكتشفي المجموعة",
  image: images.products.bundle,
} as const;
