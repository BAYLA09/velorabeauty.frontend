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
    name: "علكات صحة ونمو الشعر",
    ingredient: "بالبيوتين",
    description:
      "روتين يومي لدعم مظهر الشعر بثقة، ضمن عناية بسيطة تناسب إيقاعك.",
    price: singleProductPrice,
    priceLabel: formatPrice(singleProductPrice),
    image: images.products.hair,
    cta: "اكتشفي المنتج",
  },
  {
    id: "skin",
    number: "02",
    name: "علكات إشراقة ونضارة البشرة",
    ingredient: "بالغلوتاثيون",
    description:
      "لمسة عناية تمنح بشرتك حضوراً مشرقاً، في تجربة أنيقة وسهلة.",
    price: singleProductPrice,
    priceLabel: formatPrice(singleProductPrice),
    image: images.products.skin,
    cta: "اكتشفي المنتج",
  },
  {
    id: "eye",
    number: "03",
    name: "علكات العناية بمحيط العين",
    ingredient: "بفيتامين E",
    description:
      "عناية مركّزة بمحيط العين، لتكملي روتينك بخطوة واحدة راقية.",
    price: singleProductPrice,
    priceLabel: formatPrice(singleProductPrice),
    image: images.products.eye,
    cta: "اكتشفي المنتج",
  },
];

export const bundle = {
  title: "المجموعة الكاملة لجمالك",
  subtitle: "ثلاث عنايات في روتين واحد.",
  savingsLine: "وفّري أكثر مع المجموعة الكاملة",
  priceLabel: formatPrice(339),
  cta: "احصلي على المجموعة",
  image: images.products.bundle,
} as const;
