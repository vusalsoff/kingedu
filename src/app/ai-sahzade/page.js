"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import "./ai-sahzade.css";

const YENI_SHEET_ID = "1E8ebVcuSvYSSnEpPRYKusP7Zqr-yZtf6hd4NHufdRQ0";
const DIPLOM_IMG_URL = "https://kec.az/LyijU";
const SERTIFIKAT_IMG_URL = "https://kec.az/NqqFb";

const MENECER_TOVSIYESI = `
  <div class="manager-recommendation-box" style="margin-top: 15px; padding-top: 10px; border-top: 1px solid rgba(255,107,0,0.2);">
      <p class="info-card-text" style="font-size: 14px; margin-bottom: 8px;"><b class="highlight-orange" style="color:var(--primary);">🎯 Şahzadənin Ətraflı Məsləhəti:</b> Təlim proqramlarımızın qeydiyyat şərtləri, endirimli investisiya paketləri, ödəniş imkanları və dərslərə yerinizi dərhal bron etmək üçün peşəkar menecerimizlə birbaşa əlaqə saxlaya bilərsiniz:</p>
      <a href="https://wa.me/994103790874" target="_blank" class="manager-btn" style="display:inline-block; padding:10px 18px; background:#25D366; color:white; font-weight:bold; border-radius:20px; text-decoration:none; font-size: 14px;">💬 Menecerə WhatsApp-da Ətraflı Yaz</a>
  </div>
`;

function temizle(text) {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\t\n\r]+/g, "")
    .replace(/ı/g, "i")
    .replace(/i̇/g, "i")
    .replace(/ə/g, "e")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ğ/g, "g");
}

export default function AiSahzadePage() {
  const [inputMsg, setInputMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Salam! Mən KİNG Education Company MMC-nin rəsmi AI Assistenti olan virtual köməkçiniz Şahzadə. 👑<br/><br/>Kurslarımız, marafonlarımız, şirkətimizin tarixi, şərtlər və ya digər suallarınız barədə maraqlandığınız mövzunu yazın və ya aşağıdakı hazır suallara klikləyin, dərhal izah edim!"
    }
  ]);

  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (messages.length > 1 || isLoading) {
      if (chatBodyRef.current) {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  const handleSend = async (queryOverride) => {
    const query = typeof queryOverride === 'string' ? queryOverride : inputMsg;
    if (!query.trim()) return;

    setMessages(prev => [...prev, { sender: "user", text: query }]);
    setInputMsg("");
    setIsLoading(true);

    const txt = temizle(query);

    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    try {
      if (
        txt.includes("rehber") ||
        txt.includes("sahibi") ||
        txt.includes("mudir") ||
        txt.includes("direktor") ||
        txt.includes("Mirfəqan")
      ) {
        await delay(600);
        setMessages(prev => [...prev, {
          sender: "bot",
          text: `<div class="info-card-container">
              <div class="info-card-title" style="font-weight:bold; color:var(--primary); margin-bottom:8px; font-size:16px;">👑 Rəhbərlik və Korporativ Əlaqə</div>
              <p class="info-card-text">KİNG Education Company MMC-nin təsisçisi, direktoru və rəsmi rəhbəri <b style="color:var(--primary);">Mirfəqan Hacıyevdir</b>. O, gənclərin inkişafına və peşəkar təhsilə xüsusi önəm verir.</p>
          </div>`
        }]);
        setIsLoading(false);
        return;
      }

      if (txt.includes("tarixi") || txt.includes("nevaxtqurulub")) {
        await delay(600);
        setMessages(prev => [...prev, {
          sender: "bot",
          text: `<div class="info-card-container">
              <div class="info-card-title" style="font-weight:bold; color:var(--primary); margin-bottom:8px; font-size:16px;">📅 KİNG Education Company MMC-nin Qısa Tarixi</div>
              <p class="info-card-text">KİNG Education Company MMC-nin əsası <b style="color:var(--primary);">23 avqust 2023-cü il</b> tarixində <b style="color:var(--primary);">Mirfəqan Hacıyev Vüqar oğlu</b> tərəfindən qoyulmuşdur və 11 fevral 2025-ci il tarixində rəsmi hüquqi status qazanaraq MMC kimi dövlət qeydiyyatına alınmışdır. Şirkətimiz minlərlə gəncə keyfiyyətli təhsil və bacarıqlar qazandırmışdır.</p>
          </div>`
        }]);
        setIsLoading(false);
        return;
      }

      if (txt.includes("diplom")) {
        await delay(600);
        setMessages(prev => [...prev, {
          sender: "bot",
          text: `<div class="info-card-container">
              <div class="info-card-title" style="font-weight:bold; color:var(--primary); margin-bottom:8px; font-size:16px;">🎓 Rəsmi Diplom Nümunəsi və Şərtləri</div>
              <p class="info-card-text">Təlimlərimizi uğurla başa vuran iştirakçılara şirkətimiz tərəfindən xüsusi seriya nömrəli, unikal dizaynlı və təsdiq olunmuş <b style="color:var(--primary);">Kursu Bitirmə Sənədi (Diplom)</b> təqdim olunur. Bu diplomlar sizin əldə etdiyiniz biliklərin rəsmi təsdiqidir.</p>
              <a href="${DIPLOM_IMG_URL}" target="_blank" class="dynamic-link-btn" style="display:inline-block;margin-top:10px;padding:10px 15px;background:var(--primary);color:white;text-decoration:none;border-radius:20px;font-weight:bold; font-size: 14px;">🖼 Rəsmi Diplom Nümunəsinə Bax</a>
          </div>${MENECER_TOVSIYESI}`
        }]);
        setIsLoading(false);
        return;
      }

      if (txt.includes("sertifikat")) {
        await delay(600);
        setMessages(prev => [...prev, {
          sender: "bot",
          text: `<div class="info-card-container">
              <div class="info-card-title" style="font-weight:bold; color:var(--primary); margin-bottom:8px; font-size:16px;">📄 Rəsmi Sertifikat Nümunəsi və Keçərliliyi</div>
              <p class="info-card-text">İntensiv təlimlərimizdə və marafonlarımızda iştirak edən hər bir şəxsə QR kodlu, unikal qeydiyyat nömrəli və möhürlü fərdi <b style="color:var(--primary);">Sertifikatlar</b> verilir. Bu sertifikatlar CV-nizi gücləndirmək, karyeranızda yeni zirvələr fəth etmək və şəxsi inkişafınızı sübut etmək üçün mükəmməl fürsətdir.</p>
              <a href="${SERTIFIKAT_IMG_URL}" target="_blank" class="dynamic-link-btn" style="display:inline-block;margin-top:10px;padding:10px 15px;background:var(--primary);color:white;text-decoration:none;border-radius:20px;font-weight:bold; font-size: 14px;">🖼 Rəsmi Sertifikat Nümunəsinə Bax</a>
          </div>${MENECER_TOVSIYESI}`
        }]);
        setIsLoading(false);
        return;
      }

      const res = await fetch(`https://docs.google.com/spreadsheets/d/${YENI_SHEET_ID}/gviz/tq?gid=0`);
      const textData = await res.text();
      const match = textData.match(/google\.visualization\.Query\.setResponse\(([\s\S\w]+)\);/);
      
      if (!match) throw new Error("Gviz parse error");
      
      const jsonData = JSON.parse(match[1]);
      const rows = jsonData.table.rows;
      
      let tapilanData = null;
      let kurslarListi = [];
      let marafonlarListi = [];

      for (let i = 0; i < rows.length; i++) {
        let row = rows[i].c;
        if (!row) continue;

        let getC = (idx) =>
          row[idx] && row[idx].v !== null
            ? (row[idx].f || row[idx].v).toString().trim()
            : "";

        let kursAdi = getC(0);
        let muddet = getC(1);
        let format = getC(2);
        let qiymet = getC(3);
        let kimlerUcun = getC(4);
        let qisaMezmun = getC(5);

        if (kursAdi && !temizle(kursAdi).includes("kurs")) {
          kurslarListi.push({ basliq: kursAdi, muddet, qiymet, format, kimler: kimlerUcun, mezmun: qisaMezmun });
        }

        let marafonAdi = getC(10);
        let marafonMuddet = getC(12) || "1 AY";
        let marafonNomre = getC(15) || "994518885784";

        if (marafonAdi && !temizle(marafonAdi).includes("marafonunadi")) {
          marafonlarListi.push({ basliq: marafonAdi, muddet: marafonMuddet, nomre: marafonNomre });
        }

        if (kursAdi && temizle(kursAdi).includes(txt)) {
          tapilanData = {
            tip: "tek",
            basliq: kursAdi,
            siyahis: [
              { label: "Təhsil Müddəti", val: muddet },
              { label: "Keçirilmə Formatı", val: format },
              { label: "Aylıq İnvestisiya / Qiymət", val: qiymet },
              { label: "Bu Kurs Kimlər Üçündür?", val: kimlerUcun },
              { label: "Kursun Əhatəli Məzmunu", val: qisaMezmun },
            ],
          };
          break;
        }

        if (marafonAdi && temizle(marafonAdi).includes(txt)) {
          tapilanData = {
            tip: "tek",
            basliq: marafonAdi,
            siyahis: [
              { label: "Marafonun Qiyməti", val: "20 AZN" },
              { label: "Müddət", val: marafonMuddet },
              { label: "Proqrama Daxildir", val: getC(13) },
              { label: "Dərs Formatı", val: getC(14) },
              { label: "Əlaqə və Qeydiyyat Nömrəsi", val: marafonNomre },
            ],
          };
          break;
        }

        for (let j = 0; j < row.length; j++) {
          let val = getC(j);
          if (val && temizle(val).includes(txt) && j < row.length - 1) {
            let cavabVal = getC(j + 1);
            if (cavabVal && !temizle(val).includes("kurs") && !temizle(val).includes("marafon")) {
              tapilanData = {
                tip: "tek",
                basliq: val,
                siyahis: [{ label: "Ətraflı Arayış", val: cavabVal }],
              };
            }
          }
        }
      }

      if (txt.includes("butunkurslar") || txt.includes("aktivkurslar") || txt.includes("kurslarsiyahisi") || txt === "kurslar") {
        tapilanData = { tip: "butun_kurslar", liste: kurslarListi };
      }

      if (txt.includes("butunmarafonlar") || txt.includes("aktivmarafonlar") || txt.includes("marafonlarsiyahisi") || txt === "marafonlar") {
        tapilanData = { tip: "butun_marafonlar", liste: marafonlarListi };
      }

      let resultHTML = "";
      if (tapilanData) {
        resultHTML += `<div class="info-card-container">`;

        if (tapilanData.tip === "tek") {
          resultHTML += `<div class="info-card-title" style="font-weight:bold; color:var(--primary); margin-bottom:10px; font-size:16px;">🎯 ${tapilanData.basliq} Təlim Proqramı</div>`;
          resultHTML += `<p class="info-card-text" style="margin-bottom:12px;">King Education Company MMC olaraq təqdim etdiyimiz bu peşəkar istiqamət gənclərin karyera inkişafına xüsusi töhfə verir.</p>`;
          tapilanData.siyahis.forEach((item) => {
            if (item.val) {
              resultHTML += `<p class="info-card-text" style="margin-bottom:8px;"><b>${item.label}:</b> <span style="font-weight: normal; opacity: 0.9;">${item.val}</span></p>`;
            }
          });
          resultHTML += `</div>${MENECER_TOVSIYESI}`;
        } else if (tapilanData.tip === "butun_kurslar") {
          resultHTML += `<div class="info-card-title" style="font-weight:bold; color:var(--primary); margin-bottom:10px; font-size:16px;">📚 King Education MMC - Bütün Aktiv Kurslarımız</div>`;
          resultHTML += `<p class="info-card-text" style="margin-bottom:15px;">Şirkətimiz tərəfindən təşkil edilən peşəkar kurslar siyahısı və onların əsas şərtləri aşağıdadır:</p>`;
          tapilanData.liste.forEach((k, idx) => {
            resultHTML += `<div style="background:rgba(255,107,0,0.05); padding:15px; border-radius:10px; margin-bottom:10px; border-left:4px solid var(--primary);">`;
            resultHTML += `<p class="info-card-text" style="margin-bottom:6px; font-size: 15px;"><b>${idx + 1}. ${k.basliq}</b></p>`;
            resultHTML += `<p class="info-card-text" style="font-size:14px; margin-bottom:4px;">⏳ <b>Müddət:</b> ${k.muddet} | 💻 <b>Format:</b> ${k.format || "Onlayn"} | 💳 <b>Qiymət:</b> <span class="highlight-orange" style="color:var(--primary); font-weight:bold;">${k.qiymet}</span></p>`;
            if (k.kimler)
              resultHTML += `<p class="info-card-text" style="font-size:13.5px; opacity:0.8; margin-top: 6px;">👥 <b>Kimlər üçündür:</b> ${k.kimler}</p>`;
            resultHTML += `</div>`;
          });
          resultHTML += `</div>${MENECER_TOVSIYESI}`;
        } else if (tapilanData.tip === "butun_marafonlar") {
          resultHTML += `<div class="info-card-title" style="font-weight:bold; color:var(--primary); margin-bottom:10px; font-size:16px;">🎯 King Education MMC - Bütün Aktiv Marafonlarımız</div>`;
          resultHTML += `<p class="info-card-text" style="margin-bottom:15px;">Bütün marafonlarımız xüsusi endirimlə <b class="highlight-orange" style="color:var(--primary);">cəmi 20 AZN</b> təşkil edir. İstədiyiniz marafona qoşulmaq üçün birbaşa aşağıdakı düyməni istifadə edə bilərsiniz:</p>`;
          tapilanData.liste.forEach((m, idx) => {
            let waLink = `https://wa.me/${m.nomre}?text=Salam,%20${encodeURIComponent(m.basliq)}%20marafonuna%2020%20AZN%20ilə%20qoşulmaq%20istəyirəm.`;
            resultHTML += `<div style="background:rgba(255,107,0,0.05); padding:15px; border-radius:10px; margin-bottom:10px; border-left:4px solid var(--primary);">`;
            resultHTML += `<p class="info-card-text" style="margin-bottom:6px; font-size:15px;"><b>${idx + 1}. ${m.basliq}</b></p>`;
            resultHTML += `<p class="info-card-text" style="font-size:14px; margin-bottom:10px;">⏳ <b>Müddət:</b> ${m.muddet} | 💳 <b>İnvestisiya:</b> <span class="highlight-orange" style="color:var(--primary); font-weight:bold;">20 AZN</span></p>`;
            resultHTML += `<a href="${waLink}" target="_blank" class="manager-btn" style="font-size:13px; padding:8px 16px; background:#25D366; color:white; border-radius:20px; text-decoration:none; display:inline-block; font-weight:bold;">💬 Bu Marafon üçün Menecerə Yaz</a>`;
            resultHTML += `</div>`;
          });
          resultHTML += `</div>`;
        }
        setMessages(prev => [...prev, { sender: "bot", text: resultHTML }]);
      } else {
        setMessages(prev => [...prev, { 
          sender: "bot", 
          text: "Axtardığınız mövzu üzrə ətraflı məlumat bazamızda tapılmadı. Suallarınızı birbaşa peşəkar menecerimizə ünvanlaya bilərsiniz:" + MENECER_TOVSIYESI 
        }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        sender: "bot", 
        text: "Məlumatlar emal edilərkən xəta baş verdi. Zəhmət olmasa menecerimizlə əlaqə saxlayın." + MENECER_TOVSIYESI 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-page container">
      <div className="ai-container">
        
        <div className="ai-header-section">
          <h1>Şahzadə 👑 AI Assistenti</h1>
          <p>King Education MMC virtual köməkçisi ilə birbaşa əlaqə</p>
        </div>

        <div className="ai-chat-container">
          <div className="ai-chatbot-header">
            <Image src="/img/Sahzade ai.jpeg" alt="Şahzadə AI" width={50} height={50} style={{ borderRadius: '50%', border: '2px solid white' }} />
            <div className="ai-header-info">
              <h3>Şahzadə 👑</h3>
              <span>KİNG Education Company MMC AI Assistenti</span>
            </div>
          </div>

          <div className="ai-chatbot-body" ref={chatBodyRef}>
            {messages.map((msg, index) => (
              <div key={index} className={`ai-chat-message ${msg.sender}`}>
                <div dangerouslySetInnerHTML={{ __html: msg.text }} />
              </div>
            ))}
            
            {isLoading && (
              <div className="ai-chat-message bot">
                <div style={{ display: 'flex', gap: '5px', padding: '5px' }}>
                  <span className="typing-dot" style={{ animationDelay: '0s' }}></span>
                  <span className="typing-dot" style={{ animationDelay: '0.2s' }}></span>
                  <span className="typing-dot" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            )}
          </div>
          
          <div className="ai-quick-replies">
            <button onClick={() => handleSend('Aktiv Kurslar')}>📚 Aktiv Kurslar</button>
            <button onClick={() => handleSend('Aktiv Marafonlar')}>🎯 Aktiv Marafonlar</button>
            <button onClick={() => handleSend('Təlimçilik Kursu')}>👑 Təlimçilik Kursu</button>
            <button onClick={() => handleSend('Sənəd Nümunələri (Sertifikat)')}>🖼 Sənəd Nümunələri</button>
            <button onClick={() => handleSend('Sertifikat Keçərliliyi')}>📄 Sertifikat Keçərliliyi</button>
          </div>

          <form 
            className="ai-chatbot-input" 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          >
            <input 
              type="text" 
              placeholder="Kurs, marafon və ya mövzu adını yazın..." 
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" className="ai-send-btn" disabled={isLoading || !inputMsg.trim()}>
              GÖNDƏR
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
