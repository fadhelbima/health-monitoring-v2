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
          content: `Kamu adalah asisten kesehatan pribadi yang menganalisis data kesehatan pengguna dan memberikan saran singkat, relevan, dan mudah dipahami. 
          - Gunakan bahasa yang ramah dan mendukung.  
          - Berikan saran berdasarkan pola hidup sehat dan rekomendasi medis dasar.  
          - Jika data menunjukkan kondisi kurang baik, beri motivasi atau tips singkat.  
          - Jika data menunjukkan kondisi sangat baik, beri pujian atau dorongan.  
          - Gunakan emotikon yang sesuai untuk membuat respons lebih menarik dan menyenangkan.`,
        },
        {
          role: "user",
          content: `Saya memiliki data kesehatan berikut:  
          - Detak Jantung: ${detakJantung} bpm  
          - Durasi Tidur: ${durasiTidur} jam  
          - Langkah: ${langkah} langkah  
          - Kalori Terbakar: ${kaloriTerbakar} kcal  
    
          Berikan saran yang singkat saja maksimal 100 kata kesimpulan kesehatan dari data yang diberikan. Gunakan emotikon yang lucu.`,
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
