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
  heroMicroline: string;
  lifestyleTitle: string;
  lifestyleLine: string;
  transformationTitle: string;
  transformationPillars: string[];
  finalCtaTitle: string;
  finalCtaLine: string;
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
  faq: { question: string; answer: string }[];
};

const integrityLines = [
  "بدون وعود طبية",
  "بدون ادعاءات غير مدعومة",
  "بدون مكونات غير مذكورة",
  "بدون تعقيد",
];

const sharedTimelineNote = "ليس كل تغيير يُرى من أول يوم — الاستمرار هو الجمال.";

export const productPages: Record<ProductId, ProductPageConfig> = {
  hair: {
    ...sharedProductPageBlocks("gummy"),
    slug: "hair-gummies",
    form: "gummy",
    seoTitle: "روتين الشعر | VELORA — علكات بالبيوتين",
    seoDescription: "علكات يومية بالبيوتين — روتين عناية بسيط للشعر، توصيل داخل الإمارات.",
    headlineQuestion: "شعركِ يستحق عناية تبدأ من الداخل.",
    subhook: "علكات يومية بالبيوتين — لتصبح العناية جزءاً من يومكِ، لا مهمة إضافية.",
    heroMicroline: "من 199 د.إ · علبة · توصيل الإمارات",
    lifestyleTitle: "العناية بنفسكِ ليست مهمة أخرى.",
    lifestyleLine: "هي لحظة تختارين فيها نفسكِ.",
    transformationTitle: "اجعليها عادة.",
    transformationPillars: ["روتين بسيط.", "عناية يومية.", "لحظة لكِ."],
    finalCtaTitle: "ابدئي من نفسكِ.",
    finalCtaLine: "اكتشفي روتين VELORA للشعر.",
    painEyebrow: "لحظة صدق",
    painTitle: "بين العمل، البيت، وكل ما بينهما…",
    painLead: "متى كانت آخر مرة اخترتِ فيها نفسكِ؟",
    painItems: [
      {
        problem: "«أيامي ممتلئة — والعناية تتأجل»",
        solution: "علكة واحدة. روتين لا يطلب منكِ أكثر مما تستطيعين.",
      },
      {
        problem: "«أريد شيئاً بسيطاً — لا قائمة منتجات»",
        solution: "بيوتين. خطوة واحدة. VELORA.",
      },
      {
        problem: "«أريد روتيناً يكمل بعضه»",
        solution: "الشعر، البشرة، العين — روتين واحد متناسق.",
      },
    ],
    formulaEyebrow: "التركيبة",
    formulaTitle: "مكوّن واحد. بوضوح.",
    formulaSubtitle: "البيوتين — محور هذا المنتج.",
    formulaCards: [
      {
        title: "البيوتين",
        lines: ["المكوّن البارز في علكات الشعر.", "ضمن روتين يومي بسيط."],
      },
    ],
    notIncludedTitle: "ما نعد به",
    notIncluded: integrityLines,
    brandQuoteTitle: "من VELORA",
    brandQuote: "العناية ليست رفاهية — هي طريقة تحترمين بها نفسكِ.",
    statHighlightGrid: [
      { value: "60", label: "علكة في العلبة" },
      { value: "30", label: "يوماً من الروتين" },
      { value: "2", label: "علكة / يوم (حسب التعليمات)" },
      { value: "199", label: "د.إ · البداية" },
    ],
    usageTitle: "طريقة الاستخدام",
    usageSubtitle: "ثلاثون ثانية لكِ.",
    usageSteps: [
      { title: "01", text: "خذي الجرعة الموصى بها." },
      { title: "02", text: "اجعليها جزءاً من روتينك." },
      { title: "03", text: "استمري." },
    ],
    timelineTitle: "روتينكِ اليومي، بطريقتكِ.",
    timelineNote: sharedTimelineNote,
    timelineSteps: [
      { step: "1", title: "البداية", text: "خطوة صغيرة — إحساس جديد بالعناية." },
      { step: "2", title: "الاستمرار", text: "عندما يصبح الروتين عادة." },
      { step: "3", title: "الاكتمال", text: "روتين VELORA الكامل — شعر، بشرة، عين." },
    ],
    faq: [
      { question: "كم مرة في اليوم؟", answer: "اتبعي التعليمات على العلبة." },
      { question: "مع منتجات VELORA الأخرى؟", answer: "نعم — صُممت لتتكامل." },
      { question: "طرق الدفع؟", answer: "بطاقة أو عند الاستلام داخل الإمارات." },
    ],
  },
  skin: {
    ...sharedProductPageBlocks("gummy"),
    slug: "skin-gummies",
    form: "gummy",
    seoTitle: "روتين البشرة | VELORA — علكات بالغلوتاثيون",
    seoDescription: "علكات بالغلوتاثيون — روتين إشراق بسيط، توصيل داخل الإمارات.",
    headlineQuestion: "امنحي بشرتكِ اللحظة التي تستحقها.",
    subhook: "علكات يومية بالغلوتاثيون — عناية من الداخل، بخطوة واحدة أنيقة.",
    heroMicroline: "من 199 د.إ · علبة · توصيل الإمارات",
    lifestyleTitle: "جمالكِ لا يحتاج روتيناً معقّداً.",
    lifestyleLine: "يحتاج لحظة تختارين فيها نفسكِ.",
    transformationTitle: "روتين صغير.",
    transformationPillars: ["إشراق.", "ثبات.", "لطف."],
    finalCtaTitle: "ابدئي من نفسكِ.",
    finalCtaLine: "اكتشفي روتين VELORA للبشرة.",
    painEyebrow: "لحظة صدق",
    painTitle: "الشمس، التكييف، وإيقاع لا يتوقف…",
    painLead: "بشرتكِ تحكي قصة يومكِ — وتستحق أن تُسمع.",
    painItems: [
      {
        problem: "«لا وقت لعشر خطوات»",
        solution: "علكة. روتين. انتهى.",
      },
      {
        problem: "«أريد عناية أثق بها»",
        solution: "غلوتاثيون — محور هذا المنتج.",
      },
      {
        problem: "«أريد أن أكتمل»",
        solution: "مع الشعر ومحيط العين — روتين واحد.",
      },
    ],
    formulaEyebrow: "التركيبة",
    formulaTitle: "وضوح. لا زخرفة.",
    formulaSubtitle: "الغلوتاثيون — في قلب هذه العلبة.",
    formulaCards: [
      {
        title: "الغلوتاثيون",
        lines: ["المكوّن البارز في علكات البشرة.", "لروتين يومي خفيف."],
      },
    ],
    notIncludedTitle: "ما نعد به",
    notIncluded: integrityLines,
    brandQuoteTitle: "من VELORA",
    brandQuote: "الإشراق يبدأ حين تختارين العناية — لا حين تلاحقينها.",
    statHighlightGrid: [
      { value: "60", label: "علكة في العلبة" },
      { value: "30", label: "يوماً من الروتين" },
      { value: "2", label: "علكة / يوم (حسب التعليمات)" },
      { value: "199", label: "د.إ · البداية" },
    ],
    usageTitle: "طريقة الاستخدام",
    usageSubtitle: "اجعليها لحظتك اليومية.",
    usageSteps: [
      { title: "01", text: "خذي الجرعة الموصى بها." },
      { title: "02", text: "في وقت ثابت من يومكِ." },
      { title: "03", text: "استمري." },
    ],
    timelineTitle: "روتينكِ اليومي، بطريقتكِ.",
    timelineNote: sharedTimelineNote,
    timelineSteps: [
      { step: "1", title: "البداية", text: "لحظة لكِ — كل يوم." },
      { step: "2", title: "الاستمرار", text: "عندما يصبح الروتين طبيعياً." },
      { step: "3", title: "الاكتمال", text: "ثلاث عنايات — روتين VELORA." },
    ],
    faq: [
      { question: "لجميع أنواع البشرة؟", answer: "اتبعي التعليمات. للحالات الخاصة استشيري مختصاً." },
      { question: "عروض الروتين؟", answer: "249 د.إ لمنتجين · 339 د.إ لثلاثة (بطاقة)." },
      { question: "الدفع؟", answer: "بطاقة أو عند الاستلام." },
    ],
  },
  eye: {
    ...sharedProductPageBlocks("serum"),
    slug: "eye-serum",
    form: "serum",
    seoTitle: "محيط العين | VELORA — سيروم بفيتامين E",
    seoDescription: "سيروم محيط العين بفيتامين E — خطوة مركّزة في روتينكِ.",
    headlineQuestion: "لأن التفاصيل الصغيرة تصنع الفرق.",
    subhook: "سيروم بفيتامين E — لطفٌ مركّز حول العين، في روتينكِ اليومي.",
    heroMicroline: "من 199 د.إ · عبوة · توصيل الإمارات",
    lifestyleTitle: "محيط العين يستحق هدوءاً.",
    lifestyleLine: "خطوة واحدة — قبل أن ينام يومكِ.",
    transformationTitle: "عناية دقيقة.",
    transformationPillars: ["لطف.", "تركيز.", "استمرار."],
    finalCtaTitle: "ابدئي من نفسكِ.",
    finalCtaLine: "اكتشفي روتين VELORA لمحيط العين.",
    painEyebrow: "لحظة صدق",
    painTitle: "الشاشات، السهر، والتفاصيل التي لا تُخفى…",
    painLead: "محيط العين أول ما يحكي عن تعبكِ — ويستحق عناية لطيفة.",
    painItems: [
      {
        problem: "«أريد خطوة للعين — لا عشر كريمات»",
        solution: "سيروم واحد. فيتامين E. VELORA.",
      },
      {
        problem: "«بشرة رقيقة تحتاج لطفاً»",
        solution: "تركيبة سيروم — خفيفة ومركّزة.",
      },
      {
        problem: "«أكمل روتيني»",
        solution: "مع علكات الشعر والبشرة — روتين متكامل.",
      },
    ],
    formulaEyebrow: "التركيبة",
    formulaTitle: "فيتامين E. بوضوح.",
    formulaSubtitle: "محور سيروم محيط العين.",
    formulaCards: [
      {
        title: "فيتامين E",
        lines: ["المكوّن البارز في هذا السيروم.", "للاستخدام الموضّع حول العين."],
      },
    ],
    notIncludedTitle: "ما نعد به",
    notIncluded: integrityLines,
    brandQuoteTitle: "من VELORA",
    brandQuote: "التفاصيل الصغيرة — حيث تبدأ العناية الحقيقية.",
    statHighlightGrid: [
      { value: "30", label: "مل · العبوة" },
      { value: "1", label: "خطوة في روتينك" },
      { value: "E", label: "فيتامين E" },
      { value: "199", label: "د.إ · البداية" },
    ],
    usageTitle: "طريقة الاستخدام",
    usageSubtitle: "لحظة هادئة.",
    usageSteps: [
      { title: "01", text: "كمية صغيرة حول محيط العين." },
      { title: "02", text: "طبّقي حسب تعليمات العبوة." },
      { title: "03", text: "استمري — بلطف." },
    ],
    timelineTitle: "روتينكِ اليومي، بطريقتكِ.",
    timelineNote: sharedTimelineNote,
    timelineSteps: [
      { step: "1", title: "البداية", text: "خطوة مركّزة — دقيقة واحدة." },
      { step: "2", title: "الاستمرار", text: "عندما تصبح العادة." },
      { step: "3", title: "الاكتمال", text: "روتين VELORA — ثلاث عنايات." },
    ],
    faq: [
      { question: "وحدها أم مع العلكات؟", answer: "تكمل روتين الشعر والبشرة." },
      { question: "COD؟", answer: "+20 د.إ على الطلب." },
      { question: "البطاقة؟", answer: "بدون رسوم إضافية." },
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
