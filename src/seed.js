const fs = require("fs");
const https = require("https");

// We have to parse mockData manually because it's ES module
const mockDataContent = fs.readFileSync("./src/data/mockData.js", "utf8");

// A very hacky way to extract the data out of the mockData file for a one-time node script
let parsedKurslar = [];
let parsedTelimler = [];
let parsedMarafonlar = [];
let parsedKitablar = [];

try {
  // We can just use eval since we trust our own file
  const moduleStr = mockDataContent
    .replace(/export const /g, "var ")
    .replace(/export {[^}]+};/g, "");

  eval(
    moduleStr +
      `
    parsedKurslar = typeof kurslarData !== 'undefined' ? kurslarData : [];
    parsedTelimler = typeof telimlerData !== 'undefined' ? telimlerData : [];
    parsedMarafonlar = typeof marafonlarData !== 'undefined' ? marafonlarData : [];
    parsedKitablar = typeof kitablarData !== 'undefined' ? kitablarData : [];
  `,
  );
} catch (e) {
  console.error("Error parsing mockData:", e);
}

const myAllDataMap = {
  kurslar: parsedKurslar,
  telimler: parsedTelimler,
  marafonlar: parsedMarafonlar,
  kitablarimiz: parsedKitablar,
};

const DB_SHEET_URL =
  "https://script.google.com/macros/s/AKfycbw_bgijgyM9JMgcexbtuBzRbcNqtDTZgMQkOqRtlJ2jF4gpxNNN74kmomxmzotMPwdkUQ/exec";

async function postData(payload) {
  return new Promise((resolve, reject) => {
    const dataString = JSON.stringify(payload);

    // Using URL object to parse the endpoint
    const url = new URL(DB_SHEET_URL);

    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(dataString),
      },
    };

    const req = https.request(options, (res) => {
      // Follow redirect if 302
      if (res.statusCode === 302 || res.statusCode === 301) {
        const redirectUrl = new URL(res.headers.location);
        const redirectOptions = {
          hostname: redirectUrl.hostname,
          path: redirectUrl.pathname + redirectUrl.search,
          method: "GET", // Apps script redirects with GET usually for POST responses
        };
        const redirectReq = https.request(redirectOptions, (redirectRes) => {
          let responseData = "";
          redirectRes.on("data", (chunk) => (responseData += chunk));
          redirectRes.on("end", () => resolve(responseData));
        });
        redirectReq.end();
        return;
      }

      let responseData = "";
      res.on("data", (chunk) => {
        responseData += chunk;
      });
      res.on("end", () => {
        resolve(responseData);
      });
    });

    req.on("error", (e) => {
      reject(e);
    });

    req.write(dataString);
    req.end();
  });
}

async function runSeed() {
  console.log("Seeding started...");
  let count = 0;

  const collections = {
    kurslar: "Courses",
    telimler: "Trainings",
    marafonlar: "Marathons",
    kitablarimiz: "Books",
  };

  for (const [key, collectionName] of Object.entries(collections)) {
    const items = myAllDataMap[key];
    if (items) {
      for (const item of items) {
        console.log(`Adding ${item.title} to ${collectionName}...`);
        await postData({
          action: "add_item",
          collection: collectionName,
          item: {
            title: item.title || "",
            instructor: item.instructor || "",
            duration: item.duration || "",
            price: item.price || "",
            date: item.date || "",
            description: item.description || "",
            longDescription: item.longDescription || "",
            image: item.image || "",
            curriculum: item.curriculum || [],
          },
        });
        count++;
      }
    }
  }

  const defaultSettings = [
    {
      key: "aboutText",
      value:
        "KİNG Education fərdi və peşəkar inkişafınız üçün fəaliyyət göstərən tədris mərkəzidir. Bizim məqsədimiz sadəcə dərs keçmək deyil, gənclərin həyatına yeni biliklər, bacarıqlar və fürsətlər qazandırmaqdır.",
    },
    {
      key: "leadershipText",
      value:
        "Təhsilə və şəxsi inkişafa olan sarsılmaz həvəsi ilə tanınır. King Education Company MMC-nin direktoru olaraq, o, innovativ təlim proqramlarının hazırlanması və gənclərin potensialının maksimum dərəcədə inkişaf etdirilməsi istiqamətində çalışır. Mirfəqan birmənalı olaraq təhsildə müasir yanaşmaların tətbiqinə və hər bir iştirakçının fərdi bacarıqlarını ön plana çıxarmağa üstünlük verir. Onun rəhbərliyi altında King Education Company gənclərin inkişafı və gələcək karyerası üçün geniş imkanlar və yeni fürsətlər yaradır.",
    },
    { key: "phone", value: "+994 50 123 45 67" },
    { key: "email", value: "info@kingsedu.az" },
    { key: "address", value: "Bakı şəhəri, Nizami küçəsi" },
    { key: "instagram", value: "https://instagram.com/king.education" },
    { key: "marathonLink", value: "https://chat.whatsapp.com/marathon" },
  ];

  for (const setting of defaultSettings) {
    console.log(`Setting ${setting.key}...`);
    await postData({
      action: "update_setting",
      key: setting.key,
      value: setting.value,
    });
  }

  console.log(`Successfully seeded ${count} items and settings!`);
}

runSeed();
