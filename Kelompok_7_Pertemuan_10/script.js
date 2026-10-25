// Mengambil elemen form kalkulator dari halaman
const calculatorForm = document.querySelector('#calculatorForm');
const targetSelect = document.querySelector('#target');
const firstInput = document.querySelector('#firstValue');
const secondInput = document.querySelector('#secondValue');
const firstLabel = document.querySelector('#firstLabel');
const secondLabel = document.querySelector('#secondLabel');
const inputHint = document.querySelector('#inputHint');
const resultText = document.querySelector('#resultText');
const formulaText = document.querySelector('#formulaText');
const errorMessage = document.querySelector('#errorMessage');
const resetButton = document.querySelector('#resetButton');
const clearHistoryButton = document.querySelector('#clearHistoryButton');
const historyList = document.querySelector('#historyList');
const emptyHistory = document.querySelector('#emptyHistory');

// Menyimpan riwayat hasil perhitungan selama halaman dibuka
const calculationHistory = [];
// Menentukan label, contoh input, dan petunjuk tiap perhitungan
const fieldSettings = {
  voltage: { first: 'Arus (I) — Ampere', second: 'Hambatan (R) — Ohm', p1: 'Contoh: 2', p2: 'Contoh: 5', hint: 'Untuk menghitung tegangan, masukkan nilai arus dan hambatan.' },
  current: { first: 'Tegangan (V) — Volt', second: 'Hambatan (R) — Ohm', p1: 'Contoh: 12', p2: 'Contoh: 4', hint: 'Untuk menghitung arus, masukkan nilai tegangan dan hambatan.' },
  resistance: { first: 'Tegangan (V) — Volt', second: 'Arus (I) — Ampere', p1: 'Contoh: 12', p2: 'Contoh: 3', hint: 'Untuk menghitung hambatan, masukkan nilai tegangan dan arus.' }
};

// Memperbarui label input sesuai besaran yang dipilih
function updateInputLabels() {
  const settings = fieldSettings[targetSelect.value];
  firstLabel.textContent = settings.first;
  secondLabel.textContent = settings.second;
  firstInput.placeholder = settings.p1;
  secondInput.placeholder = settings.p2;
  inputHint.textContent = settings.hint;
  errorMessage.textContent = '';
}

// Membatasi hasil angka hingga empat angka desimal
function formatNumber(number) {
  return Number(number.toFixed(4)).toString();
}

// Menghitung nilai listrik berdasarkan pilihan pengguna
function calculateValue(event) {
  event.preventDefault(); // Mencegah halaman reload saat form dikirim
  const firstValue = Number(firstInput.value);
  const secondValue = Number(secondInput.value);
  const target = targetSelect.value;
  errorMessage.textContent = '';

  // Memastikan kedua kolom input sudah terisi
  if (firstInput.value.trim() === '' || secondInput.value.trim() === '') {
    errorMessage.textContent = 'Kedua kolom harus diisi terlebih dahulu.';
    return;
  }
  // Menolak input yang bukan angka valid atau bernilai negatif
  if (!Number.isFinite(firstValue) || !Number.isFinite(secondValue) || firstValue < 0 || secondValue < 0) {
    errorMessage.textContent = 'Masukkan angka yang valid dan tidak boleh negatif.';
    return;
  }

  // Menyiapkan variabel hasil, satuan, rumus, dan detail hitung
  let result;
  let unit;
  let name;
  let formula;
  let calculation;

  // Percabangan memilih rumus sesuai besaran listrik yang dihitung
  if (target === 'voltage') {
    result = firstValue * secondValue;
    unit = 'V'; name = 'Tegangan'; formula = 'V = I × R';
    calculation = `${formatNumber(firstValue)} A × ${formatNumber(secondValue)} Ω`;
  } else if (target === 'current') {
    if (secondValue === 0) {
      errorMessage.textContent = 'Hambatan tidak boleh 0 Ω untuk menghitung arus.';
      return;
    }
    result = firstValue / secondValue;
    unit = 'A'; name = 'Arus listrik'; formula = 'I = V ÷ R';
    calculation = `${formatNumber(firstValue)} V ÷ ${formatNumber(secondValue)} Ω`;
  } else {
    if (secondValue === 0) {
      errorMessage.textContent = 'Arus tidak boleh 0 A untuk menghitung hambatan.';
      return;
    }
    result = firstValue / secondValue;
    unit = 'Ω'; name = 'Hambatan'; formula = 'R = V ÷ I';
    calculation = `${formatNumber(firstValue)} V ÷ ${formatNumber(secondValue)} A`;
  }

  // Memastikan hasil akhir dapat direpresentasikan sebagai angka
  if (!Number.isFinite(result)) {
    errorMessage.textContent = 'Hasil tidak dapat dihitung. Periksa kembali input.';
    return;
  }
  // Menampilkan hasil dan rumus dengan format angka yang rapi
  const formattedResult = formatNumber(result);
  resultText.textContent = `${name}: ${formattedResult} ${unit}`;
  formulaText.textContent = `${formula} = ${calculation} = ${formattedResult} ${unit}`;

  // Menambahkan hasil terbaru beserta waktu ke riwayat
  calculationHistory.unshift({ name, result: `${formattedResult} ${unit}`, formula, time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) });
  // Membatasi riwayat agar hanya menyimpan lima hasil terbaru
  if (calculationHistory.length > 5) calculationHistory.pop();
  renderHistory();
}

// Membuat ulang daftar riwayat pada halaman
function renderHistory() {
  historyList.textContent = '';
  calculationHistory.forEach((item) => {
    const listItem = document.createElement('li');
    const title = document.createElement('strong');
    const detail = document.createElement('small');
    title.textContent = `${item.name}: ${item.result}`;
    detail.textContent = `${item.formula} • ${item.time}`;
    listItem.appendChild(title);
    listItem.appendChild(detail);
    historyList.appendChild(listItem);
  });
  emptyHistory.hidden = calculationHistory.length > 0;
}

// Memperbarui label saat pilihan besaran berubah
targetSelect.addEventListener('change', updateInputLabels);
// Menjalankan perhitungan saat form dikirim.
calculatorForm.addEventListener('submit', calculateValue);
// Mengosongkan tampilan hasil saat tombol reset ditekan.
resetButton.addEventListener('click', () => {
  resultText.textContent = 'Hasil akan muncul di sini setelah kamu menekan tombol hitung.';
  formulaText.textContent = '';
  errorMessage.textContent = '';
});
// Menghapus seluruh riwayat saat tombol hapus ditekan
clearHistoryButton.addEventListener('click', () => {
  calculationHistory.length = 0;
  renderHistory();
});
// Mengatur label awal ketika halaman pertama kali dibuka
updateInputLabels();
