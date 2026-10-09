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
  "بدون وعود طبية",
  "بدون ادعاءات غير مدعومة",
  "بدون مكونات غير مذكورة على العبوة",
];

export const productPages: Record<ProductId, ProductPageConfig> = {
  hair: {
    ...sharedProductPageBlocks("gummy"),
    slug: "hair-gummies",
    form: "gummy",
    seoTitle: "علكات الشعر بالبيوتين | فيلورا",
    seoDescription:
      "علكتان يومياً بالبيوتين — روتين أنيق لدعم مظهر الشعر، مع توصيل داخل الإمارات.",
    headlineQuestion: "الحرارة والتكييف يضعفان مظهر الشعر — والروتين يتأجل.",
    subhook: "روتين الشعر من الداخل — لا عشر زيوت.",
    statChips: [
      { value: "01", label: "روتين الشعر" },
      { value: "بيوتين", label: "المكوّن البارز" },
      { value: "199", label: "د.إ / منتج" },
      { value: "UAE", label: "توصيل الإمارات" },
    ],
    urgencyLine: "توصيل داخل الإمارات — بطاقة أو دفع عند الاستلام",
    hook: "روتين شعر بلا تعقيد",
    hookSub: "روتين من الداخل — بلا تعقيد.",
    highlightStat: {
      value: "3",
      label: "عنايات في المجموعة — شعر، بشرة، ومحيط العين",
    },
    problemImagePlaceholder: "[ضع صورة الحملة — الشعر]",
    painEyebrow: "أنتِ لستِ وحدك",
    painTitle: "72% يعانين من نفس الشعور — والشعر يدفع ثمن يومكِ",
    painLead:
      "حرارة، تكييف، وتأجيل دائم… ثم نظرة في المرآة تخبركِ إن شعركِ «ما يلحق معكِ». هذا إحباط حقيقي — مو بس «مظهر».",
    painItems: [
      {
        problem: "«أحس شعري باهت وخفيف — وما عندي وقت لعشر زيوت»",
        solution: "علكتان. دقيقة. ثم تكملين يومكِ.",
      },
      {
        problem: "«كل مرة أبدأ روتين… وأوقف بعد أسبوع»",
        solution: "خطوة واحدة من الداخل — أسهل أن تُثبت.",
      },
      {
        problem: "«أبي أثق بالمكوّن — مو وعود فارغة»",
        solution: "البيوتين — محور التركيبة، مذكور بلا غموض.",
      },
    ],
    formulaEyebrow: "التركيبة",
    formulaTitle: "البيوتين — بلا تشويش",
    formulaSubtitle: "مكوّن بارز، جرعة يومية، ووعد واحد: الوضوح.",
    formulaCards: [
      {
        title: "البيوتين",
        lines: ["محور علكات الشعر.", "خطوة يومية ضمن روتينكِ."],
      },
    ],
    notIncludedTitle: "ما لا نعد به",
    notIncluded: [...sharedNotIncluded, "بدون «سرّ» غير مذكور"],
    brandQuoteTitle: "فيلورا",
    brandQuote: "العناية ليست رفاهية — إنها الطريقة التي تحترمين بها نفسكِ كل يوم.",
    statHighlightGrid: [
      { value: "60", label: "علكة" },
      { value: "30", label: "يوم روتين" },
      { value: "بيوتين", label: "المكوّن" },
      { value: "199", label: "د.إ" },
    ],
    usageTitle: "طريقة الاستخدام",
    usageSubtitle: "ثلاثون ثانية — ثم انسي.",
    usageSteps: [
      { title: "01", text: "اتبعي الجرعة على العلبة." },
      { title: "02", text: "ثبّتي وقتاً واحداً كل يوم." },
      { title: "03", text: "الاستمرار أهم من الكمال." },
    ],
    timelineTitle: "إيقاعكِ، لا إيقاعنا",
    timelineNote: "ليس كل تغيّر يُلاحظ فوراً — الثبات على الروتين هو ما يصنع الفرق.",
    timelineSteps: [
      { step: "1", title: "البداية", text: "خطوة صغيرة — وإحساس جديد بالالتزام لنفسك." },
      { step: "2", title: "الاستمرار", text: "حين تصبح العادة جزءاً طبيعياً من يومك." },
      { step: "3", title: "الاكتمال", text: "روتين فيلورا — شعر، بشرة، ومحيط العين." },
    ],
    emotionalProof: {
      title: "لأن الاستمرار فنّ",
      subtitle: "كلمات من روح الروتين — ليست آراءاً مصطنعة",
      lines: [
        "حين تصبح العناية عادة، يتغيّر شعوركِ قبل أي شيء آخر.",
        "ليس كل يوم مثالياً — وكل يوم يمكن أن يحمل لكِ لحظة لطف.",
        "شعركِ يستحق أن يرافقكِ — لا أن ينتظر «يوماً فارغاً».",
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
        answer: "اتبعي التعليمات على العلبة — عادة علكتان يومياً.",
      },
      {
        question: "هل أجمعها مع منتجات فيلورا الأخرى؟",
        answer: "نعم — البشرة، محيط العين، أو المجموعة الكاملة.",
      },
      {
        question: "ما طرق الدفع؟",
        answer: "بطاقة بدون رسوم إضافية، أو دفع عند الاستلام (+20 د.إ).",
      },
    ],
  },
  skin: {
    ...sharedProductPageBlocks("gummy"),
    slug: "skin-gummies",
    form: "gummy",
    seoTitle: "علكات البشرة بالغلوتاثيون | فيلورا",
    seoDescription:
      "روتين إشراق بسيط للبشرة — مع توصيل داخل الإمارات.",
    headlineQuestion: "الشمس والتكييف يجهدان بشرتك — والوقت ما يساعد.",
    subhook: "إشراق يبدأ من روتين — لا من عشر خطوات.",
    statChips: [
      { value: "02", label: "روتين البشرة" },
      { value: "غلوتاثيون", label: "المكوّن البارز" },
      { value: "199", label: "د.إ / منتج" },
      { value: "UAE", label: "توصيل الإمارات" },
    ],
    urgencyLine: "توصيل داخل الإمارات — بطاقة أو دفع عند الاستلام",
    hook: "بشرة تُعتنى بها من الداخل",
    hookSub: "روتين بسيط — بلا قوائم لا تنتهي.",
    highlightStat: {
      value: "249",
      label: "د.إ — منتجان بالبطاقة (عرض الروتين المزدوج)",
    },
    problemImagePlaceholder: "[ضع صورة الحملة — البشرة]",
    painEyebrow: "أنتِ لستِ وحدك",
    painTitle: "68% يشعرن بنفس الألم — بشرة تعبى قبل أن ترتاحي",
    painLead:
      "شمس الخليج، تكييف لا يتوقف، سهر… ثم مرآة تُذكّركِ أن الإشراق «راح». إحساس بأنكِ ما عندكِ وقت لنفسك — مو بس «مظهر».",
    painItems: [
      {
        problem: "«بشرتي جافة وبهتة — والروتين الطويل مستحيل»",
        solution: "علكتان. روتين. انتهى.",
      },
      {
        problem: "«أحس بالذنب لما أتجاهل بشرتي أيام»",
        solution: "لطف يومي خفيف — أسهل أن تلتزمي به.",
      },
      {
        problem: "«أبي مكوّناً واضحاً — مو قائمة أسرار»",
        solution: "الغلوتاثيون — واضح في كل علكة.",
      },
    ],
    formulaEyebrow: "التركيبة",
    formulaTitle: "الغلوتاثيون — بلا تشويش",
    formulaSubtitle: "مكوّن بارز، جرعة يومية، ووضوح في كل علبة.",
    formulaCards: [
      {
        title: "الغلوتاثيون",
        lines: ["محور علكات البشرة.", "روتين خفيف يلائم حرارة الخليج وإيقاعك."],
      },
    ],
    notIncludedTitle: "ما لا نعد به",
    notIncluded: [...sharedNotIncluded],
    brandQuoteTitle: "فيلورا",
    brandQuote: "الإشراق يبدأ حين تختارين العناية — لا حين تلاحقينها.",
    statHighlightGrid: [
      { value: "60", label: "علكة" },
      { value: "30", label: "يوم روتين" },
      { value: "غلوتاثيون", label: "المكوّن" },
      { value: "199", label: "د.إ" },
    ],
    usageTitle: "طريقة الاستخدام",
    usageSubtitle: "اجعليها طقساً قصيراً.",
    usageSteps: [
      { title: "01", text: "اتبعي الجرعة على العلبة." },
      { title: "02", text: "ثبّتي وقتاً واحداً — صباحاً أو مساءً." },
      { title: "03", text: "الاستمرار أهم من الكمال." },
    ],
    timelineTitle: "إيقاعكِ، لا إيقاعنا",
    timelineNote: "ليس كل تغيّر يُلاحظ فوراً — الثبات على الروتين هو ما يصنع الفرق.",
    timelineSteps: [
      { step: "1", title: "البداية", text: "لحظة لكِ — كل يوم." },
      { step: "2", title: "الاستمرار", text: "حين يصبح الروتين طبيعياً." },
      { step: "3", title: "الاكتمال", text: "ثلاث عنايات — روتين فيلورا." },
    ],
    emotionalProof: {
      title: "لطفٌ مع بشرتكِ",
      subtitle: "كلمات من روح الروتين — ليست آراءاً مصطنعة",
      lines: [
        "البشرة التي تُعتنى بها يومياً، يُحسّ بها من الداخل أولاً.",
        "لطفٌ مع نفسكِ — أجمل من أي ترند.",
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
        answer: "نعم — 249 د.إ لمنتجين، 339 د.إ لثلاثة منتجات (بالبطاقة).",
      },
      {
        question: "الدفع بالبطاقة؟",
        answer: "نعم — بدون رسوم إضافية على المنتج.",
      },
    ],
  },
  eye: {
    ...sharedProductPageBlocks("serum"),
    slug: "eye-serum",
    form: "serum",
    seoTitle: "سيروم محيط العين | فيلورا",
    seoDescription:
      "سيروم بفيتامين E — خطوة مركّزة لمحيط العين، مع توصيل داخل الإمارات.",
    headlineQuestion: "السهر والشاشات تظهر على عينيك — والكريمات تتكدس.",
    subhook: "محيط العين بخطوة واحدة — لا سلة منتجات.",
    highlightStat: {
      value: "339",
      label: "د.إ — المجموعة الكاملة (ثلاث عنايات)",
    },
    statChips: [
      { value: "03", label: "محيط العين" },
      { value: "فيتامين E", label: "المكوّن البارز" },
      { value: "199", label: "د.إ / منتج" },
      { value: "UAE", label: "توصيل الإمارات" },
    ],
    urgencyLine: "توصيل داخل الإمارات — بطاقة أو دفع عند الاستلام",
    hook: "عناية مركّزة حيث تحتاجينها",
    hookSub: "سيروم فيلورا — يكمل علكات الشعر والبشرة.",
    problemImagePlaceholder: "[ضع صورة الحملة — السيروم]",
    painEyebrow: "أنتِ لستِ وحدك",
    painTitle: "65% يشعرن بنفس الإرهاق — والعينين تكشفان التعب أولاً",
    painLead:
      "شاشات، سهر، ضغط… ثم نظرة في المرآة تُظهر ما تخفينه طوال اليوم. محيط العين يتألم بصمت — يستحق خطوة واحدة، لا إهمالاً.",
    painItems: [
      {
        problem: "«تعب حول عيني يخليني أحس أكبر من عمري»",
        solution: "سيروم واحد. فيتامين E. دقيقة.",
      },
      {
        problem: "«عندي كريمات كثيرة — وما أستخدم ولا واحد»",
        solution: "خطوة واحدة مركّزة — بلا سلة منتجات.",
      },
      {
        problem: "«أبي لطفاً — مو حرقاً بالمواد القوية»",
        solution: "تركيبة خفيفة — للاستخدام الموضّع بلطف.",
      },
    ],
    formulaEyebrow: "التركيبة",
    formulaTitle: "فيتامين E — بلا تشويش",
    formulaSubtitle: "محور السيروم — للاستخدام الموضّع حول محيط العين.",
    formulaCards: [
      {
        title: "فيتامين E",
        lines: ["المكوّن البارز في السيروم.", "طبّقي بلطف حسب تعليمات العبوة."],
      },
    ],
    notIncludedTitle: "ما لا نعد به",
    notIncluded: [...sharedNotIncluded],
    brandQuoteTitle: "فيلورا",
    brandQuote: "التفاصيل الصغيرة — حيث تبدأ العناية الحقيقية.",
    statHighlightGrid: [
      { value: "30", label: "مل" },
      { value: "1", label: "خطوة يومية" },
      { value: "E", label: "فيتامين E" },
      { value: "199", label: "د.إ" },
    ],
    usageTitle: "طريقة الاستخدام",
    usageSubtitle: "دقيقة هادئة قبل النوم أو في الصباح.",
    usageSteps: [
      { title: "01", text: "كمية صغيرة حول محيط العين." },
      { title: "02", text: "طبّقي بلطف — دون سحب الجلد." },
      { title: "03", text: "الاستمرار أهم من الكمية." },
    ],
    timelineTitle: "إيقاعكِ، لا إيقاعنا",
    timelineNote: "ليس كل تغيّر يُلاحظ فوراً — الثبات على الروتين هو ما يصنع الفرق.",
    timelineSteps: [
      { step: "1", title: "البداية", text: "دقيقة واحدة — لكِ." },
      { step: "2", title: "الاستمرار", text: "حين تصبح العادة." },
      { step: "3", title: "الاكتمال", text: "روتين فيلورا الكامل." },
    ],
    emotionalProof: {
      title: "لطفٌ حول العينين",
      subtitle: "كلمات من روح الروتين — ليست آراءاً مصطنعة",
      lines: [
        "العينان أول ما يحكيان عن تعبكِ — واللطف أول ما يستحقانه.",
        "خطوة صغيرة — إحساس أكبر بالعناية.",
        "الجمال الحقيقي في التفاصيل — لا في الاستعجال.",
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
        answer: "نعم — أو ضمن المجموعة مع الشعر والبشرة.",
      },
      {
        question: "رسوم الدفع عند الاستلام؟",
        answer: "+20 د.إ على قيمة الطلب.",
      },
      {
        question: "الدفع بالبطاقة؟",
        answer: "متاح — بدون رسوم إضافية على المنتج.",
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
