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

// ==============================
// ====== Add Events ============
// ==============================
document.querySelector("#activate").addEventListener("click", onActivateClick);
document.querySelector("#copyToClip").addEventListener("click", onCopyClick);

// ==============================
// ====== Event Listeners =======
// ==============================
async function onActivateClick() {
  let url = document.querySelector("#url").value;
  let shortUrl = await getShortUrl(url);
  document.querySelector("#result").value = shortUrl;
}
function onCopyClick() {}
