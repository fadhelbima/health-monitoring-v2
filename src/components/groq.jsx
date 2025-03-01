// groqService.js
import { Groq } from "groq-sdk";

const GROQ_API = import.meta.env.VITE_GROQ;
const groq = new Groq({
  apiKey: GROQ_API,
  dangerouslyAllowBrowser: true,
});

export const fetchSaranKesehatan = async (
  detakJantung,
  durasiTidur,
  langkah,
  kaloriTerbakar
) => {
  try {
    const response = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [
        {
          role: "system",
          content:
            "Kamu adalah asisten kesehatan yang memberikan saran berdasarkan data kesehatan pengguna.",
        },
        {
          role: "user",
          content: `Saya memiliki data kesehatan berikut:
          - Detak Jantung: ${detakJantung} bpm
          - Durasi Tidur: ${durasiTidur} jam
          - Langkah: ${langkah} langkah
          - Kalori Terbakar: ${kaloriTerbakar} kcal
          
          Berikan saran yang singkat saja maksimal 100 kata kesimpulan kesehatan dari data yang diberikan. Kasih emot emot yang lucu`,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching saran kesehatan:", error);
    return "Tidak dapat mengambil saran kesehatan.";
  }
};
