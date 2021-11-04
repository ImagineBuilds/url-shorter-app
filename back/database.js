const fs = require("fs");
const path = require("path");

class DataBase {
  // ! Max capacity of short urls
  #_MAX_SHORT_URLS = 10000;
  #DB_PATH = "./back/DB";
  constructor() {}

  get DB_PATH() {
    return this.#DB_PATH;
  }

  get _MAX_SHORT_URLS() {
    return this.#_MAX_SHORT_URLS;
  }

  getInfo(shortUrlId) {
    try {
      let info = fs.readFileSync(`${this.DB_PATH}/${shortUrlId}.json`);
      return JSON.parse(info.toString());
    } catch (error) {
      return { error: 403, message: "short url does not exsits" };
    }
  }

  urlRedirectEntry(urlId) {
    try {
      let info = this.getInfo(urlId);
      if (info.error === undefined) {
        info.redirectCount += 1;
        info.redirectEntriesLog.push(new Date());
        fs.writeFileSync(`${this.DB_PATH}/${urlId}.json`, JSON.stringify(info));
        return true;
      } else {
        return { error: 403, message: "short url does not exsits" };
      }
    } catch (error) {
      return { error: 500, message: error };
    }
  }

  /**
   * @param {string} full_URL - original URL given by client
   * * Returns the end point of the short url (name of the file in DB)
   */
  generateShortUrl(full_URL) {
    let url_id = this.#getUniqueShorturlID();
    if (url_id === false) {
      return {
        error: 402,
        message: "Could not read from DB / Max capacity of short urls",
      };
    }
    if (this.#createUrlShortFile(url_id, full_URL)) {
      return url_id;
    } else {
      return { error: 402, message: "Could not write to DB" };
    }
  }

  /**
   * @param {string} full_URL - original URL given by client
   * @param {string} customShort - custom url short name
   * * Returns the end point of the short url (name of the file in DB)
   */
  generateCustomShortUrl(full_URL, customShort) {
    if (!this.#isDuplicate(customShort)) {
      if (this.#createUrlShortFile(undefined, full_URL, customShort)) {
        return customShort;
      } else {
        return { error: 402, message: "Could not write to DB" };
      }
    }
    return { error: 405, message: "Custom name already exsits" };
  }

  /**
   * @param {string} full_URL - original URL given by client
   * @param {number} urlId - the short url id
   * * Create the file for the url short id
   */
  #createUrlShortFile(urlId, full_URL, custom = undefined) {
    try {
      let fileName = custom || urlId;
      fs.appendFileSync(
        `${this.DB_PATH}/${fileName}.json`,
        JSON.stringify(this.#setUrlJSON(full_URL, urlId))
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * @param {string} full_URL - original URL given by client
   * @param {number} shorturlId - the short url id
   * @param {number} counter - how many times a user has entered the url
   * @param {Date} creationDate - date of creation
   * * Returns JSON object that should go inside a file
   */
  #setUrlJSON(full_URL, shorturlId, counter = 0, creationDate = new Date()) {
    return {
      redirectCount: counter,
      redirectEntriesLog: [],
      creationDate: this.#dateFormater(creationDate),
      originalUrl: full_URL,
      "shorturl-id": shorturlId,
    };
  }

  /**
   * * Returns unique id
   */
  #getUniqueShorturlID() {
    try {
      let shortUrls_Ids = this.#getShortUrlsArray();
      let id_counter = 1;
      while (
        id_counter < this._MAX_SHORT_URLS ||
        shortUrls_Ids.length >= this._MAX_SHORT_URLS
      ) {
        let index = shortUrls_Ids.indexOf(id_counter.toString());
        if (index === -1) {
          return id_counter;
        }
        id_counter++;
      }
      throw "Max capacity of short urls";
    } catch (error) {
      return { return: false, message: error };
    }
  }

  #isDuplicate(customShort) {
    let shorturlArray = this.#getShortUrlsArray();
    if (shorturlArray.indexOf(customShort) === -1) {
      return false;
    }
    return true;
  }

  /**
   * * Returns array of all short url IDs
   */
  #getShortUrlsArray() {
    let shortUrlsArray = fs.readdirSync(
      path.resolve(__dirname, "./DB"),
      "utf-8"
    );
    return shortUrlsArray.map((url_id) => {
      return url_id.split(".")[0];
    });
  }

  /**
   * @param {date} date - new Date() obj
   * * Returns DD-MM-YYYY format
   */
  #dateFormater(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("-");
  }
}

module.exports = DataBase;
