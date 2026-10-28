import type { IsotopicSignature } from "./types";

// Пустые image_url / video_url -> на карточках будут медиа по умолчанию
export const ISOTOPIC_SIGNATURES_MOCK: IsotopicSignature[] = [
  {
    id: 1,
    title: "Погребение №14 (Бронза)",
    description:
      "Изотопный анализ δ¹⁵N и δ¹³C коллагена костных останков индивида из кургана бронзового века. " +
      "Соотношение изотопов указывает на смешанный рацион с преобладанием мяса травоядных животных " +
      "и умеренным потреблением злаков.",
    delta_n15: 9.4,
    delta_c13: -18.2,
    image_url: "",
    video_url: "",
    status: "published",
    created_at: "2024-03-12T10:00:00",
    formed_at: "2024-03-12T14:30:00",
    likes_count: 3,
    is_liked: 0,
    is_creator: 0,
  },
  {
    id: 2,
    title: "Погребение №7 (Железный век)",
    description:
      "Анализ изотопных сигнатур указывает на высокую долю рыбы в рационе — индивид, вероятно, " +
      "проживал в прибрежном поселении. Значения δ¹³C близки к эталонным для морских ресурсов.",
    delta_n15: 12.7,
    delta_c13: -13.5,
    image_url: "",
    video_url: "",
    status: "published",
    created_at: "2024-05-02T09:15:00",
    formed_at: "2024-05-02T11:45:00",
    likes_count: 2,
    is_liked: 0,
    is_creator: 0,
  },
  {
    id: 3,
    title: "Курган №2 (Скифы)",
    description:
      "Соотношение δ¹⁵N/δ¹³C соответствует преимущественно растительному рациону с высокой долей " +
      "злаков (просо, ячмень) и минимальной долей мяса травоядных.",
    delta_n15: 6.1,
    delta_c13: -21.8,
    image_url: "",
    video_url: "",
    status: "published",
    created_at: "2023-11-20T12:00:00",
    formed_at: "2023-11-20T16:20:00",
    likes_count: 1,
    is_liked: 0,
    is_creator: 0,
  },
  {
    id: 4,
    title: "Погребение №21 (Неолит)",
    description:
      "Ранний образец с преобладанием мяса травоядных и незначительной долей растительного " +
      "компонента. Изотопные значения близки к эталонной группе «мясо травоядных».",
    delta_n15: 8.9,
    delta_c13: -19.5,
    image_url: "",
    video_url: "",
    status: "published",
    created_at: "2024-01-09T08:30:00",
    formed_at: "2024-01-09T10:15:00",
    likes_count: 3,
    is_liked: 0,
    is_creator: 0,
  },
  {
    id: 7,
    title: "Стоянка у Ладожского озера (Мезолит)",
    description:
      "Высокие значения δ¹⁵N при относительно тяжёлом углероде характерны для рациона, основанного " +
      "на пресноводной рыбе и водоплавающей птице.",
    delta_n15: 13.4,
    delta_c13: -16.9,
    image_url: "",
    video_url: "",
    status: "published",
    created_at: "2024-07-04T13:00:00",
    formed_at: "2024-07-05T09:40:00",
    likes_count: 5,
    is_liked: 0,
    is_creator: 0,
  },
  {
    id: 8,
    title: "Могильник №5 (Энеолит)",
    description:
      "Сигнатура соответствует пастушескому хозяйству: молочные продукты и мясо домашнего скота, " +
      "доля растительной пищи невелика.",
    delta_n15: 10.8,
    delta_c13: -20.6,
    image_url: "",
    video_url: "",
    status: "published",
    created_at: "2024-08-19T15:20:00",
    formed_at: "2024-08-20T10:00:00",
    likes_count: 0,
    is_liked: 0,
    is_creator: 0,
  },
];
