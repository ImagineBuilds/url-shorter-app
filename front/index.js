// ==============================
// ==== Server requests =========
// ==============================

async function getInfo(shortUrl) {
  try {
    let response = await axios.get(
      `http://localhost:3000/api/shorturl/info/${shortUrl}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

async function getShortUrl(fullUrl) {
  try {
    let response = await axios.post("http://localhost:3000/api/shorturl/", {
      url: fullUrl,
    });
    return response.data.shorturlId;
  } catch (error) {
    console.log(error);
  }
}

async function getCustomShortUrl(fullUrl, custom) {
  try {
    let response = await axios.post(
      "http://localhost:3000/api/shorturl/custom",
      {
        url: fullUrl,
        custom: custom,
      }
    );
    console.log(response.data);
    return response.data.custom;
  } catch (error) {
    console.log(error);
  }
}

// ==============================
// ====== Add Events ============
// ==============================
document.querySelector("#activate").addEventListener("click", onActivateClick);
document.querySelector("#copyToClip").addEventListener("click", onCopyClick);
document
  .querySelector("#activateCustom")
  .addEventListener("click", onActivateCustomClick);
document
  .querySelector("#getStatisticsMonth")
  .addEventListener("click", onStatisticsMonthClick);
document
  .querySelector("#getStatisticsYear")
  .addEventListener("click", onStatisticsYearClick);

// ==============================
// ====== Event Listeners =======
// ==============================
async function onActivateClick() {
  let url = document.querySelector("#url").value;
  let shortUrl = await getShortUrl(url);
  document.querySelector("#result").value =
    "http://localhost:3000/api/shorturl/" + shortUrl;
}
function onCopyClick() {
  let resultInput = document.querySelector("#result");
  resultInput.select();
  resultInput.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(resultInput.value);
  resultInput.blur();
}

async function onActivateCustomClick() {
  let url = document.querySelector("#urlCustomInput").value;
  let custom = document.querySelector("#castonShortUrlInput").value;
  let short = await getCustomShortUrl(url, custom);
  document.querySelector("#resultCustom").value =
    "http://localhost:3000/api/shorturl/" + short;
}

async function onStatisticsMonthClick() {
  let obj = await getInfo(document.querySelector("#satisticInput").value);
  let date = new Date(document.querySelector("#satisticInputMonth").value);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let currentYearArray = obj.redirectEntriesLog.map((date) => {
    if (new Date(date).getFullYear() === year) return new Date(date);
  });
  createChart(
    `Entries for year ${year} in ${date.toLocaleString("en-US", {
      month: "long",
    })}`,
    getColumnsDays,
    currentYearArray,
    year,
    month
  );
}

async function onStatisticsYearClick() {
  let obj = await getInfo(document.querySelector("#satisticInput").value);
  let date = new Date(document.querySelector("#satisticInputMonth").value);
  let year = date.getFullYear();
  let currentYearArray = obj.redirectEntriesLog.map((date) => {
    if (new Date(date).getFullYear() === year) return new Date(date);
  });
  createChart(
    `Entries for year ${year}`,
    getColumnsMonth,
    currentYearArray,
    year
  );
}

function createChart(
  header,
  columsFunction,
  logsArray,
  year,
  month = undefined
) {
  let chart = new CanvasJS.Chart("chartContainer", {
    title: {
      text: header,
    },
    axisY: {
      title: "Entries",
    },
    axisX: {
      title: "Month",
    },
    data: [
      {
        type: "line",
        dataPoints: columsFunction(logsArray, year, month),
      },
    ],
  });
  chart.render();
}

function countMonthEntries(array, month) {
  return array.filter((date) => {
    return date.getMonth() + 1 === month;
  });
}

function countDayEntries(array, month, day) {
  return array.filter((date) => {
    return date.getMonth() + 1 === month && date.getDate() === day;
  });
}

function getColumnsMonth(logArray) {
  let array = [];
  for (let month = 1; month <= 12; month++) {
    array.push({ label: month, y: countMonthEntries(logArray, month).length });
  }
  return array;
}

function getColumnsDays(logArray, year, month) {
  let array = [];
  let numberOfDays = new Date(year, month, 0).getDate();
  for (let day = 1; day <= numberOfDays; day++) {
    array.push({ label: day, y: countDayEntries(logArray, month, day).length });
  }
  return array;
}
