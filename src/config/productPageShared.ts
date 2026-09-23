export const uaeDeliveryCities = [
  "دبي",
  "أبوظبي",
  "الشارقة",
  "عجمان",
  "رأس الخيمة",
  "الفجيرة",
  "أم القيوين",
  "دبي مارينا",
  "جبل علي",
  "العين",
];

export function sharedProductPageBlocks(form: "gummy" | "serum") {
  const isGummy = form === "gummy";
  return {
    ratingPlaceholder: "",
    postCtaTrust: [
      "توصيل داخل الإمارات",
      "الدفع بالبطاقة",
      "الدفع عند الاستلام",
      "دعم بالعربية",
      isGummy ? "روتين يومي" : "عناية مركّزة",
      "VELORA · UAE",
    ],
    comparisonTitle: "روتين واضح",
    comparisonSubtitle: "عناية تليق بإيقاعكِ — دون تعقيد.",
    comparisonRows: [
      { label: "الروتين", velora: "خطوة أو خطوتان يومياً", others: "قوائم طويلة" },
      {
        label: "الاستمرار",
        velora: isGummy ? "علكة في روتينك" : "سيروم خفيف",
        others: "صعب التذكّر",
      },
      { label: "الدفع", velora: "بطاقة أو عند الاستلام", others: "خيارات محدودة" },
      { label: "التوصيل", velora: "داخل الإمارات", others: "—" },
    ],
    guaranteeTitle: "رضاكِ يهمّنا",
    guaranteeSubtitle: "سياسة استرجاع واضحة — راجعي التفاصيل قبل الطلب.",
    guaranteeSteps: [
      { step: "1", title: "تواصلي معنا", text: "خلال المدة المحددة في سياسة الاسترجاع." },
      { step: "2", title: "نرتّب الإجراء", text: "بكل وضوح وبدون تعقيد." },
      { step: "3", title: "المتابعة", text: "فريق VELORA معكِ حتى الإتمام." },
    ],
    guaranteeFooter: "التفاصيل في الأسئلة أدناه.",
    deliveryTitle: "التوصيل",
    deliverySubtitle: "بكل بساطة",
    deliverySteps: [
      {
        step: "1",
        title: "اختاري طريقة الدفع",
        text: "بطاقة (بدون رسوم إضافية) أو عند الاستلام (+20 د.إ).",
      },
      {
        step: "2",
        title: "تأكيد الطلب",
        text: "نؤكد العنوان والتفاصيل معكِ.",
      },
      {
        step: "3",
        title: "استلمي بكل راحة",
        text: "توصيل داخل الإمارات.",
      },
    ],
    preOrderFaqTitle: "قبل أن تختاري",
    preOrderFaq: [
      {
        question: "ما أسعار الروتين؟",
        answer: "منتج واحد 199 د.إ · منتجان 249 د.إ · ثلاثة 339 د.إ (بطاقة). عند الاستلام +20 د.إ.",
      },
      {
        question: "متى ألاحظ فرقاً؟",
        answer: "العناية رحلة — الاستمرار أهم من السرعة. كل تجربة مختلفة.",
      },
      {
        question: "هل للاستخدام اليومي؟",
        answer: "اتبعي تعليمات المنتج. للحالات الخاصة استشيري مختصاً.",
      },
      {
        question: "التوصيل والدفع؟",
        answer: "داخل الإمارات — بطاقة أو عند الاستلام.",
      },
    ],
    testimonialTitle: "تجارب حقيقية",
    testimonialSubtitle: "تقييمات مؤكدة — تُعرض عند توفرها",
    formulaBadges: ["GMP", "حلال", "معتمد", "مدروس"],
    quickComparisonTitle: "باختصار",
  };
}
