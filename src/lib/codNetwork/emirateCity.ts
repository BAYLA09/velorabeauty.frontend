const ARABIC_EMIRATE_TO_CITY: Record<string, string> = {
  دبي: "Dubai",
  أبوظبي: "Abu Dhabi",
  الشارقة: "Sharjah",
  عجمان: "Ajman",
  "أم القيوين": "Umm Al Quwain",
  "رأس الخيمة": "Ras Al Khaimah",
  الفجيرة: "Fujairah",
  العين: "Al Ain",
  "دبي مارينا": "Dubai",
  "جبل علي": "Dubai",
};

/** Map checkout emirate (Arabic) to COD Network English city name. */
export function mapEmirateToCodNetworkCity(emirate: string): string {
  const trimmed = emirate.trim();
  return ARABIC_EMIRATE_TO_CITY[trimmed] ?? trimmed;
}
