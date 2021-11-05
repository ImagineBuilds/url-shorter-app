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

module.exports = {
  getInfo,
  getShortUrl,
  getCustomShortUrl,
};
