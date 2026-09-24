import type { ProductId } from "./products";
import { sharedProductPageBlocks } from "./productPageShared";

export type ProductForm = "gummy" | "serum";

type SharedBlocks = ReturnType<typeof sharedProductPageBlocks>;

export type ProductPageConfig = SharedBlocks & {
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
  highlightStat: { value: string; label: string };
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
  brandQuoteTitle: string;
  brandQuote: string;
  statHighlightGrid: { value: string; label: string }[];
  timelineTitle: string;
  timelineNote: string;
  timelineSteps: { step: string; title: string; text: string }[];
  usageTitle: string;
  usageSubtitle: string;
  usageSteps: { title: string; text: string }[];
  galleryPlaceholders: string[];
  faq: { question: string; answer: string }[];
  emotionalProof: { title: string; subtitle: string; lines: string[] };
};

const sharedNotIncluded = [
  "بدون وعود طبية مبالغ فيها",
  "بدون ادعاءات غير مؤكدة",
  "بدون مكونات غير مذكورة",
];

export const productPages: Record<ProductId, ProductPageConfig> = {
  hair: {
    ...sharedProductPageBlocks("gummy"),
    slug: "hair-gummies",
    form: "gummy",
    seoTitle: "علكات صحة ونمو الشعر | فيلورا بيوتي",
    seoDescription:
      "علكات بالبيوتين — روتين يومي أنيق لدعم مظهر الشعر، مع توصيل داخل الإمارات.",
    headlineQuestion: "شعركِ يستحق عناية تبدأ من الداخل.",
    subhook: "علكتان يومياً بالبيوتين — لحظة صغيرة، وروتين يليق بكِ.",
    statChips: [
      { value: "01", label: "روتين الشعر" },
      { value: "بالبيوتين", label: "المكوّن الأساسي" },
      { value: "199", label: "د.إ / منتج" },
      { value: "UAE", label: "توصيل الإمارات" },
    ],
    urgencyLine: "توصيل داخل الإمارات — الدفع بالبطاقة أو عند الاستلام",
    hook: "شعرك يستحق روتيناً واضحاً",
    hookSub: "عناية من الداخل بخطوة واحدة — ضمن أسلوب فيلورا الفاخر.",
    highlightStat: {
      value: "3",
      label: "عنايات في المجموعة الكاملة — شعر، بشرة، ومحيط العين",
    },
    problemImagePlaceholder: "[ضع صورة الحملة — الشعر]",
    painEyebrow: "لحظة صدق",
    painTitle: "في زحمة يومكِ… متى اخترتِ نفسكِ؟",
    painLead: "الشعر جزء منكِ — يستحق أن يكون في روتينك، لا في آخر قائمة المهام.",
    painItems: [
      {
        problem: "«أيامي مليئة — والعناية تتأجل»",
        solution: "علكة واحدة. دقيقة. لكِ.",
      },
      {
        problem: "«أريد شيئاً بسيطاً أثق به»",
        solution: "بيوتين — محور واضح في كل علكة.",
      },
      {
        problem: "«أريد روتيناً متكاملاً»",
        solution: "شعر، بشرة، عين — عناية واحدة من VELORA.",
      },
    ],
    formulaEyebrow: "التركيبة",
    formulaTitle: "البيوتين. بوضوح.",
    formulaSubtitle: "مكوّن واحد — روتين واحد.",
    formulaCards: [
      {
        title: "البيوتين",
        lines: ["محور علكات الشعر.", "خطوة يومية في روتينكِ."],
      },
    ],
    notIncludedTitle: "ما نعد به",
    notIncluded: [...sharedNotIncluded, "بدون مكونات سرية"],
    brandQuoteTitle: "VELORA",
    brandQuote: "العناية ليست رفاهية — هي طريقة تحترمين بها نفسكِ كل يوم.",
    statHighlightGrid: [
      { value: "60", label: "علكة" },
      { value: "30", label: "يوم روتين" },
      { value: "بيوتين", label: "المكوّن" },
      { value: "199", label: "د.إ" },
    ],
    usageTitle: "طريقة الاستخدام",
    usageSubtitle: "ثلاثون ثانية لكِ.",
    usageSteps: [
      { title: "01", text: "خذي الجرعة حسب العلبة." },
      { title: "02", text: "اجعليها عادة." },
      { title: "03", text: "استمري." },
    ],
    timelineTitle: "روتينكِ، على إيقاعكِ.",
    timelineNote: "ليس كل تغيير يُرى من أول يوم — الاستمرار هو الجمال.",
    timelineSteps: [
      { step: "1", title: "البداية", text: "خطوة صغيرة — إحساس جديد بالعناية." },
      { step: "2", title: "الاستمرار", text: "حين يصبح الروتين جزءاً من يومكِ." },
      { step: "3", title: "الاكتمال", text: "روتين VELORA — شعر، بشرة، عين." },
    ],
    emotionalProof: {
      title: "لأنكِ تستحقين الاستمرار",
      subtitle: "كلمات من روتين VELORA — ليست آراء وهمية",
      lines: [
        "العناية حين تصبح عادة، يتغيّر شعوركِ قبل أي شيء آخر.",
        "ليس كل يوم مثالياً — لكن كل يوم يمكن أن يكون لكِ.",
        "شعركِ يستحق أن يرافقكِ — لا أن ينتظركِ.",
      ],
    },
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
    ...sharedProductPageBlocks("gummy"),
    slug: "skin-gummies",
    form: "gummy",
    seoTitle: "علكات إشراقة ونضارة البشرة | فيلورا بيوتي",
    seoDescription:
      "علكات بالغلوتاثيون — لمسة إشراق في روتين يومي، مع توصيل داخل الإمارات.",
    headlineQuestion: "امنحي بشرتكِ اللحظة التي تستحقها.",
    subhook: "علكتان بالغلوتاثيون — إشراق يبدأ من روتين بسيط.",
    statChips: [
      { value: "02", label: "روتين البشرة" },
      { value: "بالغلوتاثيون", label: "المكوّن الأساسي" },
      { value: "199", label: "د.إ / منتج" },
      { value: "UAE", label: "توصيل الإمارات" },
    ],
    urgencyLine: "توصيل داخل الإمارات — الدفع بالبطاقة أو عند الاستلام",
    hook: "بشرتك تستحق إشراقة تليق بك",
    hookSub: "لمسة يومية فاخرة — من فيلورا بيوتي.",
    highlightStat: {
      value: "249",
      label: "د.إ — عرض منتجين (بطاقة) لروتين أوضح",
    },
    problemImagePlaceholder: "[ضع صورة الحملة — البشرة]",
    painEyebrow: "لحظة صدق",
    painTitle: "الشمس، التكييف، وإيقاع لا يتوقف…",
    painLead: "بشرتكِ تحكي عن يومكِ — وتستحق لطفاً، لا استعجالاً.",
    painItems: [
      {
        problem: "«لا وقت لعشر خطوات»",
        solution: "علكة. روتين. انتهى.",
      },
      {
        problem: "«أريد عناية أثق بها»",
        solution: "غلوتاثيون — واضح في كل علكة.",
      },
      {
        problem: "«أكمل روتيني»",
        solution: "مع الشعر ومحيط العين — روتين واحد.",
      },
    ],
    formulaEyebrow: "التركيبة",
    formulaTitle: "الغلوتاثيون. بوضوح.",
    formulaSubtitle: "مكوّن واحد — لمسة يومية.",
    formulaCards: [
      {
        title: "الغلوتاثيون",
        lines: ["محور علكات البشرة.", "روتين خفيف يلائم يومكِ."],
      },
    ],
    notIncludedTitle: "ما نعد به",
    notIncluded: [...sharedNotIncluded],
    brandQuoteTitle: "VELORA",
    brandQuote: "الإشراق يبدأ حين تختارين العناية — لا حين تلاحقينها.",
    statHighlightGrid: [
      { value: "60", label: "علكة" },
      { value: "30", label: "يوم روتين" },
      { value: "غلوتاثيون", label: "المكوّن" },
      { value: "199", label: "د.إ" },
    ],
    usageTitle: "طريقة الاستخدام",
    usageSubtitle: "اجعليها لحظتك.",
    usageSteps: [
      { title: "01", text: "خذي الجرعة حسب العلبة." },
      { title: "02", text: "في وقت ثابت من يومكِ." },
      { title: "03", text: "استمري." },
    ],
    timelineTitle: "روتينكِ، على إيقاعكِ.",
    timelineNote: "ليس كل تغيير يُرى من أول يوم — الاستمرار هو الجمال.",
    timelineSteps: [
      { step: "1", title: "البداية", text: "لحظة لكِ — كل يوم." },
      { step: "2", title: "الاستمرار", text: "حين يصبح الروتين طبيعياً." },
      { step: "3", title: "الاكتمال", text: "ثلاث عنايات — روتين VELORA." },
    ],
    emotionalProof: {
      title: "جمالكِ يبدأ من الداخل",
      subtitle: "كلمات من روتين VELORA — ليست آراء وهمية",
      lines: [
        "البشرة التي تُعتنى بها يومياً، يُحسّ بها من الداخل.",
        "لطفٌ مع نفسكِ — أجمل من أي قائمة منتجات.",
        "إشراقكِ قصة — والروتين فصلها الأول.",
      ],
    },
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
    ...sharedProductPageBlocks("serum"),
    slug: "eye-serum",
    form: "serum",
    seoTitle: "سيروم العناية بمحيط العين | فيلورا بيوتي",
    seoDescription:
      "سيروم بفيتامين E — عناية مركّزة بمحيط العين، مع توصيل داخل الإمارات.",
    headlineQuestion: "لأن التفاصيل الصغيرة تصنع الفرق.",
    subhook: "سيروم بفيتامين E — لطفٌ مركّز حول العين.",
    statChips: [
      { value: "03", label: "محيط العين" },
      { value: "بفيتامين E", label: "المكوّن الأساسي" },
      { value: "199", label: "د.إ / منتج" },
      { value: "UAE", label: "توصيل الإمارات" },
    ],
    urgencyLine: "توصيل داخل الإمارات — الدفع بالبطاقة أو عند الاستلام",
    hook: "محيط العين يستحق عناية مركّزة",
    hookSub: "سيروم فيلورا — يكمل علكات الشعر والبشرة.",
    highlightStat: {
      value: "339",
      label: "د.إ — المجموعة الكاملة (3 عنايات)",
    },
    problemImagePlaceholder: "[ضع صورة الحملة — السيروم]",
    painEyebrow: "لحظة صدق",
    painTitle: "الشاشات، السهر، وتعب يظهر في العينين…",
    painLead: "محيط العين رقيق — يستحق لطفاً، لا إهمالاً.",
    painItems: [
      {
        problem: "«أريد خطوة للعين — لا عشر كريمات»",
        solution: "سيروم واحد. فيتامين E.",
      },
      {
        problem: "«بشرة حساسة تحتاج لطفاً»",
        solution: "تركيبة خفيفة — مركّزة.",
      },
      {
        problem: "«أكمل روتيني»",
        solution: "مع علكات الشعر والبشرة.",
      },
    ],
    formulaEyebrow: "التركيبة",
    formulaTitle: "فيتامين E. بوضوح.",
    formulaSubtitle: "محور سيروم محيط العين.",
    formulaCards: [
      {
        title: "فيتامين E",
        lines: ["المكوّن البارز في السيروم.", "للاستخدام الموضّع بلطف."],
      },
    ],
    notIncludedTitle: "ما نعد به",
    notIncluded: [...sharedNotIncluded],
    brandQuoteTitle: "VELORA",
    brandQuote: "التفاصيل الصغيرة — حيث تبدأ العناية الحقيقية.",
    statHighlightGrid: [
      { value: "30", label: "مل" },
      { value: "1", label: "خطوة" },
      { value: "E", label: "فيتامين E" },
      { value: "199", label: "د.إ" },
    ],
    usageTitle: "طريقة الاستخدام",
    usageSubtitle: "لحظة هادئة.",
    usageSteps: [
      { title: "01", text: "كمية صغيرة حول محيط العين." },
      { title: "02", text: "طبّقي حسب العبوة." },
      { title: "03", text: "استمري — بلطف." },
    ],
    timelineTitle: "روتينكِ، على إيقاعكِ.",
    timelineNote: "ليس كل تغيير يُرى من أول يوم — الاستمرار هو الجمال.",
    timelineSteps: [
      { step: "1", title: "البداية", text: "دقيقة واحدة — لكِ." },
      { step: "2", title: "الاستمرار", text: "حين تصبح العادة." },
      { step: "3", title: "الاكتمال", text: "روتين VELORA الكامل." },
    ],
    emotionalProof: {
      title: "لطفٌ حول العينين",
      subtitle: "كلمات من روتين VELORA — ليست آراء وهمية",
      lines: [
        "العينان أول ما يحكيان عن تعبكِ — واللطف أول ما يستحقانه.",
        "خطوة صغيرة — إحساس أكبر بالراحة.",
        "العناية الحقيقية في التفاصيل.",
      ],
    },
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
