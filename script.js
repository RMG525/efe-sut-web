// ====== KATEGORİ FİLTRELEME MANTIĞI ======
const kategoriLinkleri = document.querySelectorAll(".kategori-link");
const kategoriBolumleri = document.querySelectorAll(".kategori-bolumu");

kategoriLinkleri.forEach(function(link) {
    link.addEventListener("click", function(e) {
        e.preventDefault();
        kategoriLinkleri.forEach(l => l.classList.remove("aktif"));
        this.classList.add("aktif");
        const hedefKategori = this.getAttribute("data-hedef");
        
        kategoriBolumleri.forEach(function(bolum) {
            if (hedefKategori === "hepsi") {
                if (bolum.id === "ana_sayfa") bolum.classList.add("gizli");
                else bolum.classList.remove("gizli");
            } else if (bolum.id === hedefKategori) {
                bolum.classList.remove("gizli");
            } else {
                bolum.classList.add("gizli");
            }
        });
    });
});

// ====== SEPET MANTIĞI ======
let sepet = [];
const ekleButonlari = document.querySelectorAll(".sepete-ekle-butonu");
const sepetListesi = document.getElementById("sepet-listesi");
const sepetSayaci = document.getElementById("sepet-sayaci");
const siparisiTamamlaButonu = document.getElementById("siparisi-tamamla");

function sepetiGuncelle() {
    sepetListesi.innerHTML = "";
    let toplamTutar = 0;
    sepet.forEach(function(urun, index) {
        const li = document.createElement("li");
        const satirToplami = urun.adet * urun.fiyat;
        li.innerHTML = `<span>${urun.adet}x ${urun.ad} - ${satirToplami.toFixed(2)} TL</span>
                        <button onclick="sepettenCikar(${index})" style="background:none; border:none; color:red; cursor:pointer; font-weight:bold; margin-left:10px;">X</button>`;
        sepetListesi.appendChild(li);
        toplamTutar += satirToplami;
    });
    sepetSayaci.innerText = sepet.length === 0 ? "Sepetiniz boş." : "Genel Toplam: " + toplamTutar.toFixed(2) + " TL";
}

window.sepettenCikar = function(index) {
    if (sepet[index].adet > 1) sepet[index].adet -= 1;
    else sepet.splice(index, 1);
    sepetiGuncelle();
};

ekleButonlari.forEach(function(buton) {
    buton.addEventListener("click", function(e) {
        e.stopPropagation(); // Kart tıklamasını engelle ki detay penceresi açılmasın
        const urunAdi = this.getAttribute("data-urun");
        const urunFiyati = parseFloat(this.getAttribute("data-fiyat"));
        let mevcutUrun = sepet.find(urun => urun.ad === urunAdi);
        if (mevcutUrun) mevcutUrun.adet += 1;
        else sepet.push({ ad: urunAdi, fiyat: urunFiyati, adet: 1 });
        sepetiGuncelle();
        bildirimGoster(urunAdi + " sepete eklendi!");
    });
});

// ====== ÜRÜN DETAY MODAL MANTIĞI ======
const modal = document.getElementById("urun-modal");
const kapatButonu = document.querySelector(".kapat-butonu");
const modalImg = document.getElementById("modal-img");
const modalBaslik = document.getElementById("modal-baslik");
const modalFiyat = document.getElementById("modal-fiyat");
const modalAciklama = document.getElementById("modal-aciklama");
const modalSepeteEkleBtn = document.getElementById("modal-sepete-ekle");

document.querySelectorAll(".urun-katalogu article").forEach(function(kart) {
    kart.addEventListener("click", function() {
        const resimSrc = this.querySelector("img").src;
        const urunAdi = this.querySelector("h3").innerText;
        const fiyatText = this.querySelector(".fiyat").innerText;
        const aciklama = this.getAttribute("data-aciklama") || "Bu ürün için henüz detaylı bir açıklama girilmemiştir.";
        
        modalImg.src = resimSrc;
        modalBaslik.innerText = urunAdi;
        modalFiyat.innerText = fiyatText;
        modalAciklama.innerText = aciklama;
        modalSepeteEkleBtn.setAttribute("data-urun", urunAdi);
        modalSepeteEkleBtn.setAttribute("data-fiyat", this.querySelector(".sepete-ekle-butonu").getAttribute("data-fiyat"));
        modal.style.display = "flex";
    });
});

kapatButonu.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });

modalSepeteEkleBtn.addEventListener("click", function() {
    const urunAdi = this.getAttribute("data-urun");
    const asilButon = Array.from(document.querySelectorAll('.urun-katalogu .sepete-ekle-butonu')).find(btn => btn.getAttribute('data-urun') === urunAdi);
    if(asilButon) asilButon.click();
    modal.style.display = "none";
});

// ====== BİLDİRİM (TOAST) MANTIĞI ======
function bildirimGoster(mesaj) {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.classList.add("toast");
    toast.innerHTML = `✅ ${mesaj}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ====== WHATSAPP MANTIĞI ======
siparisiTamamlaButonu.addEventListener("click", function() {
    if (sepet.length === 0) { alert("Sepetiniz boş."); return; }
    let mesaj = "Merhaba EFE Süt, siparişlerim:\n\n";
    sepet.forEach((u, i) => mesaj += (i+1) + ". " + u.ad + " (" + u.adet + " Adet) - " + (u.adet * u.fiyat) + " TL\n");
    const telefonNo = "905551234567"; 
    window.open("https://wa.me/" + telefonNo + "?text=" + encodeURIComponent(mesaj), "_blank");
});