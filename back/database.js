const fs = require("fs");

class DataBase {
  constructor() {
    // ! Max capacity of short urls
    this._MAX_SHORT_URLS = 10000;
  }

  static getInfo(shortUrlId) {
    try {
      let info = fs.readFileSync(`./back/DB/${shortUrlId}.json`);
      return JSON.parse(info.toString());
    } catch (error) {
      return { message: "short url does not exsits" };
    }
  }

  /**
   * @param {string} full_URL - original URL given by client
   * * Returns the end point of the short url (name of the file in DB)
   */
  generateShortUrl(full_URL) {
    let url_id = this.#getUniqueShorturlID();
    if (url_id === false) {
      return { message: "Could not read from DB / Max capacity of short urls" };
    }
    if (this.#createUrlShortFile(url_id, full_URL)) {
      return url_id;
    } else {
      return { message: "Could not write to DB" };
    }
  }

  /**
   * @param {string} full_URL - original URL given by client
   * @param {number} urlId - the short url id
   * * Create the file for the url short id
   */
  #createUrlShortFile(urlId, full_URL) {
    try {
      fs.appendFileSync(
        `./back/DB/${urlId}.json`,
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
      while (id_counter < this._MAX_SHORT_URLS) {
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

let x = new DataBase();
console.log(x.generateShortUrl("URL"));
module.exports = DataBase;
