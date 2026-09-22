import { codFee, currencyLabel, formatPrice } from "./pricing";

export const navigation = [
  { label: "الرئيسية", href: "/" },
  { label: "المنتجات", href: "/#products" },
  { label: "المجموعة", href: "/#bundle" },
  { label: "الأسئلة الشائعة", href: "/#faq" },
] as const;

export const hero = {
  headline: "جمالك، بطابعٍ مختلف.",
  subheadline:
    "ثلاث عنايات صُممت لترافق روتينك اليومي، من الشعر إلى البشرة ومحيط العين.",
  primaryCta: "اكتشفي المجموعة",
  secondaryCta: "تصفحي المنتجات",
  primaryHref: "#bundle",
  secondaryHref: "#products",
} as const;

export const productSection = {
  title: "اكتشفي عنايتك",
  introTitle: "ثلاثة حلول لمشاكل جمالك الأساسية",
} as const;

export const whyVelora = {
  title: "لماذا فيلورا؟",
  items: [
    { title: "مكونات مختارة بعناية", icon: "diamond" as const },
    { title: "روتين بسيط وواضح", icon: "routine" as const },
    { title: "تجربة مصممة للمرأة العصرية", icon: "spark" as const },
    { title: "توصيل داخل الإمارات", icon: "delivery" as const },
  ],
} as const;

export const testimonials = {
  title: "آراء عميلاتنا",
  items: [
    {
      quote: "اكتبي تجربة عميلة حقيقية هنا.",
      name: "اسم العميلة — المدينة",
      imageKey: "customer01" as const,
    },
    {
      quote: "اكتبي تجربة عميلة حقيقية هنا.",
      name: "اسم العميلة — المدينة",
      imageKey: "customer02" as const,
    },
  ],
} as const;

export const howToOrder = {
  title: "كيف تطلبين؟",
  support: "تجربة طلب بسيطة وسريعة داخل الإمارات.",
  steps: [
    { number: "01", title: "اختاري منتجاتك" },
    { number: "02", title: "أكملي بياناتك" },
    { number: "03", title: "استلمي طلبك" },
  ],
} as const;

export const trustStrip = {
  items: [
    "شحن سريع داخل الإمارات",
    "الدفع بالبطاقة",
    "الدفع عند الاستلام",
    "دعم مخصص",
  ],
  codBanner: "دفع عند الاستلام — بدون تعقيد",
} as const;

export const faq = {
  title: "الأسئلة الشائعة",
  items: [
    {
      question: "ما هي طرق الدفع المتاحة؟",
      answer:
        "نوفر الدفع بالبطاقة والدفع عند الاستلام داخل الإمارات العربية المتحدة.",
    },
    {
      question: "هل الدفع عند الاستلام متاح داخل الإمارات؟",
      answer: "نعم، الدفع عند الاستلام متاح للطلبات داخل الإمارات.",
    },
    {
      question: "كم يستغرق التوصيل؟",
      answer:
        "نوصّل داخل الإمارات، وتُبلَّغين بمدة التوصيل المتوقعة عند تأكيد طلبك.",
    },
    {
      question: "كم تبلغ رسوم الدفع عند الاستلام؟",
      answer: `رسوم الدفع عند الاستلام ${formatPrice(codFee)} إضافية على قيمة الطلب.`,
    },
    {
      question: "كيف أختار المنتج المناسب لي؟",
      answer:
        "اختاري العناية التي تناسب احتياجك: الشعر، البشرة، أو محيط العين — أو المجموعة الكاملة لروتين متكامل.",
    },
    {
      question: "هل يمكنني طلب أكثر من منتج؟",
      answer:
        "نعم، يمكنك طلب منتجاً واحداً أو اختيار عروض متعددة المنتجات بأسعار أوضح في صفحة الدفع.",
    },
  ],
} as const;

export const finalCta = {
  title: "ابدئي روتينك مع فيلورا",
  text: "اختاري ما يناسبك، واجعلي العناية جزءاً من يومك.",
  cta: "اكتشفي المنتجات",
  href: "#products",
} as const;

export const footer = {
  links: [
    { label: "الرئيسية", href: "/" },
    { label: "المنتجات", href: "/#products" },
    { label: "عن فيلورا", href: "/#why" },
    { label: "الأسئلة الشائعة", href: "/#faq" },
    { label: "تواصل معنا", href: "/#contact" },
    { label: "سياسة الخصوصية", href: "/" },
    { label: "الشروط والأحكام", href: "/" },
    { label: "سياسة الاسترجاع", href: "/" },
  ],
  socialPlaceholder: true,
} as const;

export const checkout = {
  title: "إتمام الطلب",
  bundleLabel: "اختيار العرض",
  paymentLabel: "طريقة الدفع",
  cardNote: "الدفع بالبطاقة — بدون رسوم إضافية",
  codNote: `الدفع عند الاستلام — +${codFee} ${currencyLabel} رسوم الشحن`,
  submit: "إتمام الطلب",
  summaryTitle: "ملخص الطلب",
} as const;
