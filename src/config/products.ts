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
    name: "علكات الشعر",
    ingredient: "بالبيوتين",
    description:
      "روتين الشعر من الداخل — واضح ويلائم إيقاعك، بلا عشر زيوت.",
    price: singleProductPrice,
    priceLabel: formatPrice(singleProductPrice),
    image: images.products.hair,
    cta: "اطلبي الآن",
  },
  {
    id: "skin",
    number: "02",
    name: "علكات البشرة",
    ingredient: "بالغلوتاثيون",
    description:
      "إشراق من الداخل — روتين بسيط يلائم يومك، بلا قوائم منتجات طويلة.",
    price: singleProductPrice,
    priceLabel: formatPrice(singleProductPrice),
    image: images.products.skin,
    cta: "اطلبي الآن",
  },
  {
    id: "eye",
    number: "03",
    name: "سيروم محيط العين",
    ingredient: "بفيتامين E",
    description:
      "خطوة مركّزة حول العين — تكمل علكات الشعر والبشرة في روتين واحد.",
    price: singleProductPrice,
    priceLabel: formatPrice(singleProductPrice),
    image: images.products.eye,
    cta: "اطلبي الآن",
  },
];

export const bundle = {
  title: "المجموعة الكاملة",
  subtitle: "شعر، بشرة، ومحيط العين — روتين فيلورا بثلاث خطوات.",
  savingsLine: "قيمة أوضح عند اختيار المجموعة",
  priceLabel: formatPrice(339),
  cta: "اختاري المجموعة",
  image: images.products.bundle,
} as const;
