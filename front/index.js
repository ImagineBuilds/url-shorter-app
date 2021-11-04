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
    throw error.hasOwnProperty("data")
      ? error.response.data
      : "Connection problem";
  }
}

async function getShortUrl(fullUrl) {
  try {
    let response = await axios.post("http://localhost:3000/api/shorturl/", {
      url: fullUrl,
    });
    return response.data.shorturlId;
  } catch (error) {
    throw error.hasOwnProperty("data")
      ? error.response.data
      : "Connection problem";
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
    console.log(response);
    return response.data.custom;
  } catch (error) {
    throw error.hasOwnProperty("data")
      ? error.response.data
      : "Connection problem";
  }
}

// ==============================
// ====== Add Events ============
// ==============================

document.querySelector("#activate").addEventListener("click", onActivateClick);
document.querySelector("#copyToClip").addEventListener("click", onCopyClick);
document
  .querySelector("#copyToClipCustom")
  .addEventListener("click", onCopyCustomClick);

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
  try {
    resetErrors();
    let url = document.querySelector("#url").value;
    if (isUrlValid(url)) {
      let shortUrl = await getShortUrl(url);
      document.querySelector("#result").value = "";
      document.querySelector("#result").value =
        "http://localhost:3000/api/shorturl/" + shortUrl;
    }
  } catch (error) {
    if (typeof error === "string") {
      document.querySelector("#urlError").textContent = "Connection problem";
    } else {
      document.querySelector("#urlError").textContent = error.message;
    }
  }
}

function onCopyCustomClick() {
  copyToClipBoard("resultCustom");
  resetErrors();
}

function onCopyClick() {
  copyToClipBoard("result");
  resetErrors();
}

async function onActivateCustomClick() {
  try {
    resetErrors();
    let url = document.querySelector("#urlCustomInput").value;
    if (isUrlValid(url)) {
      let custom = document.querySelector("#castonShortUrlInput").value;
      let short = await getCustomShortUrl(url, custom);
      document.querySelector("#resultCustom").value = "";
      document.querySelector("#resultCustom").value =
        "http://localhost:3000/api/shorturl/" + short;
    }
  } catch (error) {
    if (typeof error === "string") {
      document.querySelector("#customError").textContent = "Connection problem";
    } else {
      document.querySelector("#customError").textContent = error.message;
    }
  }
}

async function onStatisticsMonthClick() {
  try {
    resetErrors();
    let shortUrlInfo = await getInfo(
      document.querySelector("#satisticInput").value
    );
    let date = new Date(document.querySelector("#satisticInputMonth").value);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let yearLogsArray = getLogsByYear(shortUrlInfo.redirectEntriesLog, year);
    let monthName = date.toLocaleString("en-US", { month: "long" });
    let header = `Entries for year ${year} in ${monthName}`;
    document.querySelector(".div8").classList.add("visible");
    createChart(header, getColumnsDays, yearLogsArray, year, month);
  } catch (error) {
    if (typeof error === "string") {
      document.querySelector("#statistisError").textContent =
        "Connection problem";
    } else {
      document.querySelector("#statistisError").textContent = error.message;
    }
  }
}

async function onStatisticsYearClick() {
  try {
    resetErrors();
    let shortUrlInfo = await getInfo(
      document.querySelector("#satisticInput").value
    );
    let year = document.querySelector("#satisticInputYear").value;
    let yearLogArray = getLogsByYear(shortUrlInfo.redirectEntriesLog, year);
    let header = `Entries for year ${year}`;
    document.querySelector(".div8").classList.add("visible");
    createChart(header, getColumnsMonth, yearLogArray, year);
  } catch (error) {
    if (typeof error === "string") {
      document.querySelector("#statistisError").textContent =
        "Connection problem";
    } else {
      document.querySelector("#statistisError").textContent = error.message;
    }
  }
}

// ==============================
// ====== Help Functions ========
// ==============================

function isUrlValid(url) {
  if (url === "") {
    throw { message: "Url cant be null" };
  } else if (url.length > 800) {
    throw { message: "Url is too long" };
  } else {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
        "((\\d{1,3}\\.){3}\\d{1,3}))" +
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
        "(\\?[;&a-z\\d%_.~+=-]*)?" +
        "(\\#[-a-z\\d_]*)?$",
      "i"
    );
    if (pattern.test(url)) {
      return true;
    }
    throw { message: "Url is not valid" };
  }
}

function resetErrors() {
  document.querySelector("#statistisError").textContent = "";
  document.querySelector("#customError").textContent = "";
  document.querySelector("#urlError").textContent = "";
}

function copyToClipBoard(inputId) {
  let resultInput = document.querySelector(`#${inputId}`);
  resultInput.select();
  resultInput.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(resultInput.value);
  resultInput.blur();
}

function getLogsByYear(logsArray, year) {
  return logsArray.map((date) => {
    if (new Date(date).getFullYear() === parseInt(year)) return new Date(date);
  });
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
