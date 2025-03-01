export const downloadCSV = (
  selectedDay,
  selectedMonth,
  selectedDate,
  selectedYear,
  detakJantung,
  durasiTidur,
  langkah,
  kaloriTerbakar
) => {
  const data = [
    [
      "Tanggal",
      "Hari",
      "Bulan",
      "Tahun",
      "Detak Jantung (BPM)",
      "Durasi Tidur (Jam)",
      "Langkah",
      "Kalori Terbakar (kal)",
    ],
    [
      selectedDate,
      selectedDay,
      selectedMonth,
      selectedYear,
      detakJantung,
      durasiTidur,
      langkah,
      kaloriTerbakar,
    ],
  ];

  const csvContent =
    "data:text/csv;charset=utf-8," +
    data.map((row) => row.map((value) => `"${value}"`).join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.href = encodedUri;
  link.download = `Laporan_Kesehatan_${selectedDay}_${selectedDate}_${selectedMonth}_${selectedYear}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
