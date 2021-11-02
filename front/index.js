// ==============================
// ==== Server requests =========
// ==============================
const axios = require("axios");
async function getInfo() {
  try {
    let response = await axios.get("http://localhost:3000/api/shorturl/1");
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
}

// ==============================
// ====== Add Events ============
// ==============================
// document.querySelector("#activate").addEventListener("click", onActivateClick);
// document.querySelector("#copyToClip").addEventListener("click", onCopyClick);

// ==============================
// ====== Event Listeners =======
// ==============================
function onActivateClick() {}
function onCopyClick() {}

getInfo();
