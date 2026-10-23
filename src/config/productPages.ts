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
  heroBullets: string[];
  mechanismSteps: { title: string; text: string }[];
  resultsPromiseTitle: string;
  resultsPromiseLead: string;
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
    headlineQuestion:
      "شعرك يتساقط كل ما تمشّطينه؟ جرّبي تغذيته من الداخل — بدون زيوت ولا روتين طويل",
    subhook: "علكتان يومياً بالبيوتين — تغذّي شعرك من الداخل بخطوة واحدة.",
    heroBullets: [
      "علكتان يومياً — دقيقة وانتهى",
      "بيوتين يدعم مظهر الشعر الأكثف",
      "توصيل 2–4 أيام داخل الإمارات + دفع عند الاستلام",
    ],
    mechanismSteps: [
      { title: "يمتص", text: "علكة لطيفة تدخل روتينك بسهولة" },
      { title: "يغذّي", text: "البيوتين يدعم شعرك من الداخل" },
      { title: "يظهر", text: "مظهر أقوى وأكثف مع الاستمرار" },
    ],
    resultsPromiseTitle: "من أول استخدام — إحساس أخف على روتينك",
    resultsPromiseLead:
      "ما تحتاجين ساعات أمام المرآة. خطوة صغيرة كل يوم تدعم مظهر شعرك — والاستمرار على العلبة كاملة يعطيك أفضل إحساس.",
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
    painTitle: "نعرف تماماً ما تمرين به — حرارة الخليج وتكييف لا يتوقف",
    painLead:
      "شعرك يدفع ثمن يومك قبل ما تلاحظين. فيلورا روتين بسيط من الداخل — مناسب لإيقاع الإمارات.",
    painItems: [
      {
        problem: "«أحس شعري باهت وخفيف — وما عندي وقت لعشر زيوت»",
        solution: "الحل: علكتان بالبيوتين يومياً — دقيقة وتكملين يومك.",
      },
      {
        problem: "«كل مرة أبدأ روتين… وأوقف بعد أسبوع»",
        solution: "الحل: خطوة واحدة من الداخل — أسهل أن تثبتين عليها.",
      },
      {
        problem: "«أبي مكوّن واضح — مو وعود فارغة»",
        solution: "الحل: البيوتين محور التركيبة — مذكور على العلبة.",
      },
      {
        problem: "«ما أبي زيوت تثقل شعري في الحر»",
        solution: "الحل: علكة خفيفة بدون زيوت ثقيلة على فروة الرأس.",
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
    headlineQuestion: "بشرة متوهّجة من الداخل — بدون عشر خطوات ولا إبر",
    subhook: "علكتان يومياً بالغلوتاثيون وفيتامين C — تدعم نضارة بشرتك من الداخل.",
    heroBullets: [
      "إشراقة ونضارة طبيعية — بلا ادعاءات طبية",
      "غلوتاثيون + فيتامين C في روتين واحد",
      "COD وتوصيل 2–4 أيام لكل الإمارات",
    ],
    mechanismSteps: [
      { title: "يمتص", text: "علكة لذيذة تدخل روتينك بسهولة" },
      { title: "يغذّي", text: "الغلوتاثيون يدعم نضارة بشرتك من الداخل" },
      { title: "يظهر", text: "مظهر متوهّج وموحّد مع الاستمرار" },
    ],
    resultsPromiseTitle: "من أول استخدام — بشرة أرتاح لها",
    resultsPromiseLead:
      "إحساس خفيف ونضارة من الأيام الأولى — والعلبة كاملة تعطيك أفضل مظهر مع الاستمرار، بدون وعود طبية.",
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
    painTitle: "نعرف تماماً ما تمرين به — تكييف وشمس الخليج يجهدون البشرة",
    painLead:
      "بشرتك تتعب قبل ما ترتاحين. روتين خفيف من الداخل يناسب حرارة الإمارات وإيقاعك.",
    painItems: [
      {
        problem: "«بشرتي باهتة من التكييف والشمس»",
        solution: "الحل: الغلوتاثيون + فيتامين C يدعمان نضارة بشرتك من الداخل.",
      },
      {
        problem: "«ما عندي وقت لعشر خطوات كل صباح»",
        solution: "الحل: علكتان يومياً — روتين دقيقة واحدة.",
      },
      {
        problem: "«أبي إشراقة طبيعية — بلا مخاطرة»",
        solution: "الحل: نضارة ومظهر متوهّج — إشراقة طبيعية بلا ادعاءات طبية.",
      },
      {
        problem: "«كل كريم جديد يخليني أحس بالذنب إذا ما لزمت»",
        solution: "الحل: خطوة واحدة من الداخل أسهل أن تثبتين عليها.",
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
    headlineQuestion: "عيون مرتاحة ونظرة صاحية — بدون كونسيلر ثقيل",
    subhook: "سيروم فيتامين E مركّز — خطوة واحدة لمحيط العين كل يوم.",
    heroBullets: [
      "تركيبة خفيفة حول العين — بدون حرق أو ثقل",
      "فيتامين E يدعم مظهر محيط العين المرتاح",
      "دفع عند الاستلام + توصيل 2–4 أيام في الإمارات",
    ],
    mechanismSteps: [
      { title: "يمتص", text: "قوام خفيف يمتص بسرعة" },
      { title: "يغذّي", text: "فيتامين E يدعم محيط العين" },
      { title: "يظهر", text: "نظرة صاحية ومريحة المظهر" },
    ],
    resultsPromiseTitle: "من أول استخدام — إحساس مرتاح حول العين",
    resultsPromiseLead:
      "ترطيب خفيف وإحساس مريح من الأيام الأولى — والاستمرار يعطيك أفضل مظهر لمحيط العين، بدون وعود طبية.",
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
    painTitle: "نعرف تماماً ما تمرين به — الشاشات والسهر يبانون حول العين أول",
    painLead:
      "محيط العين يتعب قبل ما ترتاحين. خطوة واحدة مركّزة تناسب يومك في الإمارات.",
    painItems: [
      {
        problem: "«تعب حول عيني يخليني أحس ما نمت كفاية»",
        solution: "الحل: سيروم فيتامين E — دقيقة بلطف حول العين.",
      },
      {
        problem: "«عندي كريمات كثيرة وما أستخدم ولا واحد»",
        solution: "الحل: خطوة واحدة مركّزة بدل سلة منتجات.",
      },
      {
        problem: "«أبي لطفاً — مو حرقاً بالمواد القوية»",
        solution: "الحل: قوام خفيف للاستخدام اليومي بلطف.",
      },
      {
        problem: "«الكونسيلر يثقل نظرتي في النهار»",
        solution: "الحل: عناية يومية تدعم مظهر عيون مرتاحة.",
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
