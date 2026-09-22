import type { ProductId } from "./products";

export type ProductForm = "gummy" | "serum";

export type ProductPageConfig = {
  slug: string;
  form: ProductForm;
  seoTitle: string;
  seoDescription: string;
  headlineQuestion: string;
  subhook: string;
  statChips: { value: string; label: string }[];
  urgencyLine: string;
  hook: string;
  hookSub: string;
  problemImagePlaceholder: string;
  painEyebrow: string;
  painTitle: string;
  painLead: string;
  painItems: { problem: string; solution: string }[];
  formulaEyebrow: string;
  formulaTitle: string;
  formulaSubtitle: string;
  formulaCards: { title: string; lines: string[] }[];
  notIncludedTitle: string;
  notIncluded: string[];
  timelineTitle: string;
  timelineNote: string;
  timelineSteps: { step: string; title: string; text: string }[];
  galleryPlaceholders: string[];
  faq: { question: string; answer: string }[];
};

const sharedNotIncluded = [
  "بدون وعود طبية مبالغ فيها",
  "بدون ادعاءات غير مؤكدة",
  "بدون مكونات غير مذكورة",
];

export const productPages: Record<ProductId, ProductPageConfig> = {
  hair: {
    slug: "hair-gummies",
    form: "gummy",
    seoTitle: "علكات صحة ونمو الشعر | فيلورا بيوتي",
    seoDescription:
      "علكات بالبيوتين — روتين يومي أنيق لدعم مظهر الشعر، مع توصيل داخل الإمارات.",
    headlineQuestion: "شعرك يحتاج دعماً يومياً — بدون روتين معقد؟",
    subhook:
      "علكات صحة ونمو الشعر بالبيوتين — خطوة بسيطة كل يوم، بتجربة فاخرة تناسب إيقاعك في الإمارات.",
    statChips: [
      { value: "01", label: "روتين الشعر" },
      { value: "بالبيوتين", label: "المكوّن الأساسي" },
      { value: "199", label: "د.إ / منتج" },
      { value: "UAE", label: "توصيل الإمارات" },
    ],
    urgencyLine: "توصيل داخل الإمارات — الدفع بالبطاقة أو عند الاستلام",
    hook: "شعرك يستحق روتيناً واضحاً",
    hookSub: "عناية من الداخل بخطوة واحدة — ضمن أسلوب فيلورا الفاخر.",
    problemImagePlaceholder: "[ضع صورة الحملة — الشعر]",
    painEyebrow: "هل تعانين من هذا؟",
    painTitle: "مشاكل تعرفينها — وحلول بسيطة",
    painLead: "الشعر وروتينك اليومي",
    painItems: [
      {
        problem: "«روتين الشعر معقد وما عندي وقت»",
        solution: "علكة يومية سهلة — خطوة واحدة ضمن يومك.",
      },
      {
        problem: "«بغيت شي واضح ومو ثقيل»",
        solution: "تركيز على البيوتين — بدون تعقيد.",
      },
      {
        problem: "«بغيت أتكامل مع باقي العناية»",
        solution: "ينسجم مع علكات البشرة وسيروم العين في المجموعة.",
      },
    ],
    formulaEyebrow: "التركيبة",
    formulaTitle: "تركيز على البيوتين — بوضوح",
    formulaSubtitle: "مكوّن واحد بارز — بدون ادعاءات إضافية غير مؤكدة.",
    formulaCards: [
      {
        title: "البيوتين",
        lines: ["المكوّن المميز في هذا المنتج", "ضمن تركيبة علكات الشعر"],
      },
      {
        title: "روتين يومي",
        lines: ["استخدام بسيط", "تجربة فاخرة من فيلورا"],
      },
    ],
    notIncludedTitle: "وش ما راح تلقين",
    notIncluded: [...sharedNotIncluded, "بدون مكونات سرية"],
    timelineTitle: "وش راح تشوفين مع الاستمرار؟",
    timelineNote: "النتيجة تختلف — الاستمرار هو المفتاح.",
    timelineSteps: [
      { step: "1", title: "أول أسبوع", text: "بداية روتين واضح — عناية بسيطة كل يوم." },
      { step: "2", title: "الأسبوع الثاني", text: "ثبات الروتين يرافق إيقاعك اليومي." },
      { step: "3", title: "مع العروض", text: "منتجان أو المجموعة — قيمة أوضح لروتين أطول." },
    ],
    galleryPlaceholders: [
      "[ضع صورة المنتج — رئيسية]",
      "[ضع صورة المنتج — 2]",
      "[ضع صورة المنتج — 3]",
    ],
    faq: [
      {
        question: "كم مرة في اليوم؟",
        answer: "اتبعي التعليمات على العلبة — روتين بسيط وواضح.",
      },
      {
        question: "هل يمكن الجمع مع منتجات فيلورا الأخرى؟",
        answer: "نعم — البشرة، محيط العين، أو المجموعة الكاملة.",
      },
      {
        question: "ما طرق الدفع؟",
        answer: "الدفع بالبطاقة بدون رسوم إضافية، أو COD +20 د.إ.",
      },
    ],
  },
  skin: {
    slug: "skin-gummies",
    form: "gummy",
    seoTitle: "علكات إشراقة ونضارة البشرة | فيلورا بيوتي",
    seoDescription:
      "علكات بالغلوتاثيون — لمسة إشراق في روتين يومي، مع توصيل داخل الإمارات.",
    headlineQuestion: "بشرتك تستحق إشراقة — بدون عشر خطوات؟",
    subhook:
      "علكات إشراقة ونضارة البشرة بالغلوتاثيون — عناية يومية أنيقة بخطوة واحدة.",
    statChips: [
      { value: "02", label: "روتين البشرة" },
      { value: "بالغلوتاثيون", label: "المكوّن الأساسي" },
      { value: "199", label: "د.إ / منتج" },
      { value: "UAE", label: "توصيل الإمارات" },
    ],
    urgencyLine: "توصيل داخل الإمارات — الدفع بالبطاقة أو عند الاستلام",
    hook: "بشرتك تستحق إشراقة تليق بك",
    hookSub: "لمسة يومية فاخرة — من فيلورا بيوتي.",
    problemImagePlaceholder: "[ضع صورة الحملة — البشرة]",
    painEyebrow: "هل تعانين من هذا؟",
    painTitle: "مشاكل تعرفينها — وحلول بسيطة",
    painLead: "البشرة وروتينك",
    painItems: [
      {
        problem: "«ما عندي وقت لروتين طويل»",
        solution: "علكة يومية — سهلة وتلائم يومك.",
      },
      {
        problem: "«بغيت تركيز على الإشراق»",
        solution: "الغلوتاثيون — المكوّن البارز في هذا المنتج.",
      },
      {
        problem: "«بغيت أكتمل روتيني»",
        solution: "مع علكات الشعر وسيروم العين في عروض فيلورا.",
      },
    ],
    formulaEyebrow: "التركيبة",
    formulaTitle: "تركيز على الغلوتاثيون — بوضوح",
    formulaSubtitle: "مكوّن واحد بارز — بدون ادعاءات إضافية غير مؤكدة.",
    formulaCards: [
      {
        title: "الغلوتاثيون",
        lines: ["المكوّن المميز في هذا المنتج", "ضمن تركيبة علكات البشرة"],
      },
      {
        title: "روتين يومي",
        lines: ["خطوة واحدة", "تجربة فاخرة من فيلورا"],
      },
    ],
    notIncludedTitle: "وش ما راح تلقين",
    notIncluded: [...sharedNotIncluded],
    timelineTitle: "رحلة العناية مع الاستمرار",
    timelineNote: "النتيجة تختلف — الاستمرار هو المفتاح.",
    timelineSteps: [
      { step: "1", title: "البداية", text: "روتين بسيط يومياً." },
      { step: "2", title: "الثبات", text: "عناية تلائم إيقاعك." },
      { step: "3", title: "العروض", text: "2 أو 3 منتجات — أسعار أوضح." },
    ],
    galleryPlaceholders: [
      "[ضع صورة المنتج — رئيسية]",
      "[ضع صورة المنتج — 2]",
      "[ضع صورة المنتج — 3]",
    ],
    faq: [
      {
        question: "هل تناسب كل أنواع البشرة؟",
        answer: "اختاري ما يناسب احتياجك — للحالات الخاصة استشيري مختصاً.",
      },
      {
        question: "هل يمكن طلب أكثر من منتج؟",
        answer: "نعم — عروض 249 و 339 د.إ للمنتجين أو الثلاثة.",
      },
      {
        question: "الدفع بالبطاقة؟",
        answer: "نعم — بدون رسوم إضافية.",
      },
    ],
  },
  eye: {
    slug: "eye-serum",
    form: "serum",
    seoTitle: "سيروم العناية بمحيط العين | فيلورا بيوتي",
    seoDescription:
      "سيروم بفيتامين E — عناية مركّزة بمحيط العين، مع توصيل داخل الإمارات.",
    headlineQuestion: "محيط العين — تفصيلة تكمل جمالك؟",
    subhook:
      "سيروم العناية بمحيط العين بفيتامين E — تركيبة مركّزة بخطوة واحدة راقية.",
    statChips: [
      { value: "03", label: "محيط العين" },
      { value: "بفيتامين E", label: "المكوّن الأساسي" },
      { value: "199", label: "د.إ / منتج" },
      { value: "UAE", label: "توصيل الإمارات" },
    ],
    urgencyLine: "توصيل داخل الإمارات — الدفع بالبطاقة أو عند الاستلام",
    hook: "محيط العين يستحق عناية مركّزة",
    hookSub: "سيروم فيلورا — يكمل علكات الشعر والبشرة.",
    problemImagePlaceholder: "[ضع صورة الحملة — السيروم]",
    painEyebrow: "هل تعانين من هذا؟",
    painTitle: "مشاكل تعرفينها — وحلول بسيطة",
    painLead: "محيط العين",
    painItems: [
      {
        problem: "«بغيت خطوة مركّزة للعين»",
        solution: "سيروم بفيتامين E — خطوة واحدة.",
      },
      {
        problem: "«ما بغيت كريمات ثقيلة»",
        solution: "تركيبة سيروم خفيفة ضمن روتين فيلورا.",
      },
      {
        problem: "«بغيت روتين متكامل»",
        solution: "مع علكات الشعر والبشرة أو المجموعة الكاملة.",
      },
    ],
    formulaEyebrow: "التركيبة",
    formulaTitle: "تركيز على فيتامين E — بوضوح",
    formulaSubtitle: "مكوّن واحد بارز — بدون ادعاءات إضافية غير مؤكدة.",
    formulaCards: [
      {
        title: "فيتامين E",
        lines: ["المكوّن المميز في هذا المنتج", "ضمن تركيبة سيروم محيط العين"],
      },
      {
        title: "سيروم",
        lines: ["استخدام موضّع", "تكامل مع روتين فيلورا"],
      },
    ],
    notIncludedTitle: "وش ما راح تلقين",
    notIncluded: [...sharedNotIncluded],
    timelineTitle: "كيف يخدمك السيروم في روتينك؟",
    timelineNote: "النتيجة تختلف — الاستمرار هو المفتاح.",
    timelineSteps: [
      { step: "1", title: "الخطوة الأولى", text: "طبّقي حسب التعليمات." },
      { step: "2", title: "مع العناية اليومية", text: "بجانب علكاتك إن رغبتِ." },
      { step: "3", title: "العروض", text: "جمعي 2 أو 3 منتجات بسعر أوضح." },
    ],
    galleryPlaceholders: [
      "[ضع صورة السيروم — رئيسية]",
      "[ضع صورة السيروم — 2]",
      "[ضع صورة السيروم — 3]",
    ],
    faq: [
      {
        question: "هل أستخدمه وحدي؟",
        answer: "نعم، أو ضمن المجموعة مع الشعر والبشرة.",
      },
      {
        question: "رسوم COD؟",
        answer: "+20 د.إ على الطلب.",
      },
      {
        question: "الدفع بالبطاقة؟",
        answer: "متاح — بدون رسوم إضافية.",
      },
    ],
  },
};

export function getProductIdBySlug(slug: string): ProductId | undefined {
  return (Object.keys(productPages) as ProductId[]).find(
    (id) => productPages[id].slug === slug,
  );
}

export const productSlugs = (Object.keys(productPages) as ProductId[]).map(
  (id) => productPages[id].slug,
);
