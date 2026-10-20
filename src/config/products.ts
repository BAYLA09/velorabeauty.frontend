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
    name: "علكات فيلورا للبشرة",
    ingredient: "بفيتامين C والكولاجين والبيوتين",
    description:
      "خطوة يومية بسيطة لروتين العناية — ترطيب ومظهر بشرة مرتاحة، بلا ادعاءات طبية.",
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
