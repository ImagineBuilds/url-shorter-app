// ==============================
// ==== Server requests =========
// ==============================

async function redirect() {
  try {
    let response = await axios.get("http://localhost:3000/api/shorturl/1");
    console.log(response.data);
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

// ==============================
// ====== Event Listeners =======
// ==============================
async function onActivateClick() {
  let url = document.querySelector("#url").value;
  let shortUrl = await getShortUrl(url);
  document.querySelector("#result").value =
    "http://localhost:300/api/shorturl/" + shortUrl;
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
    "http://localhost:300/api/shorturl/" + short;
}
