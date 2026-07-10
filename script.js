// Sepet hafızası
let sepet = [];

// Ekranda güncelleyeceğimiz HTML elemanlarını seçiyoruz
const ekleButonlari = document.querySelectorAll(".sepete-ekle-butonu");
const sepetListesi = document.getElementById("sepet-listesi");
const sepetSayaci = document.getElementById("sepet-sayaci");
const siparisiTamamlaButonu = document.getElementById("siparisi-tamamla");

// Sepeti ekrana çizen ve toplamı hesaplayan ana fonksiyon
function sepetiGuncelle() {
    // Önce ekrandaki eski listeyi temizliyoruz
    sepetListesi.innerHTML = "";
    let toplamTutar = 0;

    // Sepet hafızasındaki her bir ürünü tek tek okuyoruz
    sepet.forEach(function(urun) {
        // Yeni bir liste elemanı (satır) oluşturuyoruz
        const li = document.createElement("li");
        
        // Ürünün o anki adetine göre satır toplamını hesaplıyoruz
        const satirToplami = urun.adet * urun.fiyat;
        
        // Ekrana yazılacak metni ayarlıyoruz (Örn: 2x Organik Bal - 500 TL)
        li.innerText = urun.adet + "x " + urun.ad + " - " + satirToplami + " TL";
        
        // Satırı listeye ekliyoruz
        sepetListesi.appendChild(li);
        
        // Genel toplamı güncelliyoruz
        toplamTutar += satirToplami;
    });

    // En alttaki toplam yazısını güncelliyoruz
    if (sepet.length === 0) {
        sepetSayaci.innerText = "Sepetiniz boş.";
    } else {
        sepetSayaci.innerText = "Genel Toplam: " + toplamTutar + " TL";
    }
}

// "Sepete Ekle" butonlarının dinlenmesi
ekleButonlari.forEach(function(buton) {
    buton.addEventListener("click", function() {
        const urunAdi = this.getAttribute("data-urun");
        const urunFiyati = parseInt(this.getAttribute("data-fiyat"));
        
        // Tıklanan ürün sepetimizde zaten var mı diye kontrol ediyoruz
        let mevcutUrun = sepet.find(urun => urun.ad === urunAdi);
        
        if (mevcutUrun) {
            // Ürün varsa sadece miktarını (adedini) 1 artırıyoruz
            mevcutUrun.adet += 1;
        } else {
            // Ürün yoksa sepete ilk defa, 1 adet olarak ekliyoruz
            sepet.push({ ad: urunAdi, fiyat: urunFiyati, adet: 1 });
        }
        
        // İşlem bitince ekranı güncelleyen fonksiyonu çağırıyoruz
        sepetiGuncelle();
    });
});

// "Sepeti Onayla" butonu WhatsApp yönlendirmesi
siparisiTamamlaButonu.addEventListener("click", function() {
    if (sepet.length === 0) {
        alert("Sepetiniz şu an boş. Lütfen önce ürün ekleyin.");
        return; 
    }
    
    let mesaj = "Merhaba EFE Süt, şu ürünleri sipariş vermek istiyorum:\n\n";
    let genelToplam = 0;
    
    // Mesaj içeriğine ürünleri adetleriyle birlikte ekliyoruz
    sepet.forEach(function(urun, index) {
        const satirToplami = urun.adet * urun.fiyat;
        mesaj += (index + 1) + ". " + urun.ad + " (" + urun.adet + " Adet) - " + satirToplami + " TL\n";
        genelToplam += satirToplami;
    });
    
    mesaj += "\nGenel Toplam: " + genelToplam + " TL";
    
    // Yönlendirme yapılacak GEÇİCİ test numarası (Rakam olmak zorunda)
    const telefonNo = "905384362460"; 
    
    // WhatsApp linkini oluşturup sekmede açıyoruz
    const whatsappLink = "https://wa.me/" + telefonNo + "?text=" + encodeURIComponent(mesaj);
    window.open(whatsappLink, "_blank");
});