document.addEventListener("DOMContentLoaded", () => {
  const qrScanButton = document.getElementById("qr-scan-btn");
  const qrReaderElement = document.getElementById("qr-reader");
  const stopQrButton = document.getElementById("stop-qr-btn");
  const inputField = document.getElementById("barcode-input");
  let html5QrCode;

  qrScanButton.addEventListener("click", () => {
    qrReaderElement.style.display = "block";
    stopQrButton.style.display = "inline-block";

    html5QrCode = new Html5Qrcode("qr-reader");
    html5QrCode.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      (decodedText) => {
        // 1. Isi input field
        inputField.value = decodedText;

        // 2. MODIFIKASI DISINI: Buka link di Iframe tersembunyi
        // Ini kuncinya! Kita buka linknya, tapi di "dalam" iframe yang tidak kelihatan.
        // Hasilnya: Tab kamu tidak akan pindah, dan tidak ada tab baru.
        window.open(decodedText, "hidden_confirm");

        // 3. Trigger Enter untuk tabel lokal
        const enterEvent = new KeyboardEvent('keydown', {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          which: 13,
          bubbles: true
        });
        inputField.dispatchEvent(enterEvent);

        // 4. Tutup scanner dan fokus kembali ke input
        html5QrCode.stop().then(() => {
          qrReaderElement.style.display = "none";
          stopQrButton.style.display = "none";
          
          // Kamu tetap di tab scanner, kursor langsung siap di kotak input
          inputField.focus();
          console.log("Data dikirim via Iframe. Tab tidak berpindah.");
        }).catch((err) => console.error("Gagal stop scanner:", err));
      },
      (errorMessage) => {}
    ).catch((err) => {
      console.error("Camera Error:", err);
    });
  });

  stopQrButton.addEventListener("click", () => {
    if (html5QrCode) {
      html5QrCode.stop().then(() => {
        qrReaderElement.style.display = "none";
        stopQrButton.style.display = "none";
      });
    }
  });
});