# 🩺 UTKU AI Health Assistant
### **Biomedical Expert Generative User Mobile**

> **UTKU AI**, hastaların şikayetlerini analiz ederek onları en uygun tıbbi bölüme yönlendiren ve **SDUI (Server-Driven UI)** mimarisiyle kişiselleştirilmiş sağlık modülleri üreten, yapay zeka destekli bir biyomedikal asistanıdır. Dr. Nurettin Şenyer tarafından başlatılan **NAIM Challenge** vizyonuna uygun olarak geliştirilmiştir.

---

## 🚀 Konsept ve Vizyon
Geleneksel sağlık uygulamalarının ötesinde, UTKU AI kullanıcı etkileşimini "Veri Odaklı Arayüz" (Data-Driven UI) ile yönetir:

* **🔍 Akıllı Bölüm Tespiti:** Belirtileri analiz ederek kullanıcının hangi uzmanlık alanına (Dahiliye, Nöroloji, Kardiyoloji vb.) gitmesi gerektiğini saptar.
* **💊 Dinamik SDUI Enjeksiyonu:** Kullanıcının talebine göre Dashboard'a anlık "Haftalık İlaç Çizelgesi" veya "VKE Analiz Kartı" gibi interaktif modüller enjekte eder.
* **🔐 Güvenli Biyometrik Kayıt:** Boy, kilo ve sağlık geçmişi verilerini şifreli bir yapıda yerel hafızada (**AsyncStorage**) güvenle saklar.

---

## 🛠 Teknoloji Yığını (Tech Stack)
Proje, yüksek performanslı bir mobil deneyim ve esnek bir mimari sunmak için modern teknolojileri harmanlar:

| Teknoloji | Kullanım Amacı |
| :--- | :--- |
| **React Native (Expo)** | Platformlar arası (iOS/Android) yerel mobil uygulama mimarisi. |
| **Modular Architecture** | Separation of Concerns (SoC) prensibiyle ayrılmış klasör yapısı (Services, Context, Components). |
| **SDUI (Server-Driven UI)** | JSON tabanlı dinamik arayüz oluşturma ve bileşen enjeksiyonu. |
| **Lucide Icons** | Modern ve profesyonel tıbbi görselleştirme kütüphanesi. |

---

## ⚖️ NAIM Metrikleri (Iteration Weight)
NAIM Challenge kuralları çerçevesinde her geliştirme aşaması belirli bir **"kilo" (ağırlık)** ve mühendislik kazanımıyla ilişkilendirilmiştir. **Toplam Ağırlık: 400kg+ (Legendary Level)**

| İterasyon | Kilo (kg) | Amaç / Kazanım | Durum |
| :--- | :--- | :--- | :--- |
| **v1.0 (MVP)** | 50kg | Temel arayüz ve Navigation yapısının kurulması. | ✅ |
| **v1.2** | 60kg | VKE (BMI) Analiz motoru ve dinamik Dashboard tasarımı. | ✅ |
| **v1.4** | 80kg | **SDUI Architecture:** JSON tabanlı bileşen enjeksiyon motoru. | ✅ |
| **v1.6** | 90kg | **Interactive Weekly Grid:** 7 günlük ilaç takip algoritması. | ✅ |
| **v1.8** | 70kg | **Modular Pro:** Servis, Context ve Komponentlerin ayrıştırılması. | ✅ |
| **v2.0** | 50kg | Yerel Hafıza (Persistence) ve Offline AI Simülasyonu. | ✅ |

---

## ⚙️ Nasıl Çalışır? (JSON Tabanlı Render Mantığı)
Uygulama, **veri odaklı (data-driven) UI** prensibiyle çalışır. Mesajlaşma akışı tamamen JSON tabanlı bir yapı üzerinden yönetilir:

1. **Analiz Akışı:** Kullanıcı girişi alınır ve `AISimulator.js` servisinde işlenir.
2. **SDUI Üretimi:** Mesaj içeriğine göre bir `sduiBlock` objesi (id, title, props, days) üretilir.
3. **Dinamik Render:** `UIRenderer` bileşeni, gelen JSON nesnesini okuyarak Dashboard üzerine anlık olarak interaktif kartları mühürler.

---

## 📸 Ekran Görüntüleri
*Mühendislik harikası UI tasarımları ve test aşamaları:*

| Ana Dashboard (v1.6) | Akıllı Chat (v1.8) | Sağlık Profili (v1.2) |
| :---: | :---: | :---: |
| <img src="https://github.com/user-attachments/assets/a8be5191-616f-47b5-afb1-e7f8f75179aa" width="300" alt="Ana Dashboard" /> | <img src="https://github.com/user-attachments/assets/3f3c9137-2f72-4fe4-bc5e-5a7f9008a9bb" width="300" alt="Akıllı Chat" /> | <img src="https://github.com/user-attachments/assets/8e4dc9c9-9aba-4029-92b4-9a640a11281c" width="300" alt="Sağlık Profili" /> |

---

## 📥 Kurulum (Running the App)
Uygulamayı yerel ortamınızda çalıştırmak için:

```bash
# Bağımlılıkları yükleyin
npm install

# Expo sunucusunu başlatın
npx expo start
