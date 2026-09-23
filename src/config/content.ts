import { codFee, currencyLabel, formatPrice } from "./pricing";

export const navigation = [
  { label: "الرئيسية", href: "/" },
  { label: "المنتجات", href: "/#products" },
  { label: "المجموعة", href: "/#bundle" },
  { label: "الأسئلة الشائعة", href: "/#faq" },
] as const;

export const hero = {
  headline: "جمالكِ، يبدأ منكِ.",
  subheadline: "روتين عناية واحد — للشعر، البشرة، ومحيط العين.",
  primaryCta: "اكتشفي روتينك",
  secondaryCta: "تعرّفي على VELORA",
  primaryHref: "#bundle",
  secondaryHref: "#products",
  trustBadges: [
    { label: "روتين واضح", icon: "routine" as const },
    { label: "عناية يومية", icon: "leaf" as const },
    { label: "توصيل الإمارات", icon: "delivery" as const },
  ],
} as const;

export const productSection = {
  title: "روتينكِ",
  introTitle: "ثلاث لحظات. روتين واحد.",
} as const;

export const whyVelora = {
  title: "لماذا VELORA؟",
  items: [
    { title: "عناية بلا تعقيد", icon: "routine" as const },
    { title: "مكوّن بارز في كل منتج", icon: "diamond" as const },
    { title: "مصمّم لإيقاع حياتكِ", icon: "spark" as const },
    { title: "توصيل داخل الإمارات", icon: "delivery" as const },
  ],
} as const;

export const howToOrder = {
  title: "كيف تبدأين؟",
  support: "ثلاث خطوات — بكل بساطة.",
  steps: [
    { number: "01", title: "اختاري روتينك" },
    { number: "02", title: "أكملي بياناتك" },
    { number: "03", title: "استلمي بكل راحة" },
  ],
} as const;

export const trustStrip = {
  items: [
    "توصيل داخل الإمارات",
    "الدفع بالبطاقة",
    "الدفع عند الاستلام",
    "دعم بالعربية",
  ],
  codBanner: "الدفع عند الاستلام — براحة تامة",
} as const;

export const faq = {
  title: "أسئلة قد تخطر ببالكِ",
  items: [
    {
      question: "ما طرق الدفع؟",
      answer: "البطاقة بدون رسوم إضافية، أو الدفع عند الاستلام داخل الإمارات.",
    },
    {
      question: "هل الدفع عند الاستلام متاح؟",
      answer: "نعم — للطلبات داخل الإمارات.",
    },
    {
      question: "كم يستغرق التوصيل؟",
      answer: "نوصّل داخل الإمارات، ونُبلّغكِ بالمدة عند تأكيد طلبكِ.",
    },
    {
      question: "رسوم الدفع عند الاستلام؟",
      answer: `رسوم ${formatPrice(codFee)} إضافية على قيمة الطلب.`,
    },
    {
      question: "أي منتج يناسبني؟",
      answer: "اختاري ما يلائم احتياجكِ: الشعر، البشرة، محيط العين — أو المجموعة الكاملة.",
    },
    {
      question: "هل يمكن طلب أكثر من منتج؟",
      answer: "نعم — عروض الروتين متوفرة في صفحة كل منتج.",
    },
  ],
} as const;

export const finalCta = {
  title: "ابدئي من نفسكِ.",
  text: "اكتشفي روتين VELORA.",
  cta: "اكتشفي المنتجات",
  href: "#products",
} as const;

export const footer = {
  links: [
    { label: "الرئيسية", href: "/" },
    { label: "المنتجات", href: "/#products" },
    { label: "عن VELORA", href: "/#why" },
    { label: "الأسئلة الشائعة", href: "/#faq" },
    { label: "تواصل معنا", href: "/#contact" },
    { label: "سياسة الخصوصية", href: "/" },
    { label: "الشروط والأحكام", href: "/" },
    { label: "سياسة الاسترجاع", href: "/" },
  ],
  socialPlaceholder: true,
} as const;

export const checkout = {
  title: "إتمام طلبك",
  bundleLabel: "اختاري روتينك",
  paymentLabel: "طريقة الدفع",
  cardNote: "الدفع بالبطاقة — بدون رسوم إضافية",
  codNote: `الدفع عند الاستلام — +${codFee} ${currencyLabel}`,
  submit: "إتمام الطلب",
  summaryTitle: "ملخص الطلب",
} as const;
