# url-shorter-app

## Preview - <image>

  **Preview sentence**  
  
## Project Goals
  1. Shorten a very long URL address with either automatic generation or by creating a custom URL.
  2. Analyze the amount of page views per the URL that the user created by using statistics, and vizualization tools (ex: graphs).
  
## Features
  - [ ]  Automatically generate a unique URL that the server returns that can be used for personal gain.
  - [ ]  Users have the ability to name the URL based on their website's content in order to improve their goal infront of their website users.
  - [ ]  Showcasing the amount of entries per URL allows the managing user to keep track on the URL's usage & status.
  
  
## Persistent Information
  - [ ] File collection system that allows saving the shortened URLs within a `JSON` file.
  - [ ] Here's an example of a generated shortened URL:
  
  _#1.json_
  ```json 
   {
    "redirectCount":7,
  
    "redirectEntriesLog":["2021-11-03T14:29:40.116Z",
     "2021-11-03T14:29:44.146Z","2021-11-03T14:29:48.046Z","2021-11-03T14:39:37.323Z",
     "2021-11-03T16:25:19.754Z","2021-11-04T07:53:40.197Z","2021-11-04T09:17:13.563Z"],
  
    "creationDate":"03-11-2021",
  
    "originalUrl":"https://www.youtube.com/","shorturl-id":1
  }
  ```
  `redirectCount` - The amount of times the user redirected the shortened URL.

  `redirectEntriesLog` - Saves the time of every entry. (allows to properly analyze URL entries)
  
## API End-points (api/shorterurl)
  - Method: `get`, <label style="color:green"> _end-point /:urlid_ </label>
  
      - Redirect the user to the original URL.
  - Method: `get`, _end-point /info/:urlid_
      
      - Returns shortened URL info (json in file, _as mentioned in 'Persistent Information')
  - Method: `post`, _end-point /custom_
  
      - Generates a short URL based on user input. (the custom URL is in the body of the request)
       ```js
  
          let response = await axios.post(
            "http://localhost:3000/api/shorturl/custom",
          {
            url: fullUrl,
            custom: custom,
          }
      ```
      - Returns `{ custom: string }`
  - Method: `post`, _endpoint /_
  
      - Generate a short URL based on API generator. (the custom URL is in the body of the request)
       ```js
          let response = await axios.post("http://localhost:3000/api/shorturl/", {
            url: fullUrl,
          });
       ```
       - Returns `{ shorturlId: number }`
## Error Handling
  - [ ] Error 402: Could not read or write to DB / max capacity of short URLs.
  - [ ] Error 403: URL does not exist.
  - [ ] Error 405: Custom URL already exists.
  - [ ] Error 500: Internal erver error.
  
  
## API Port
  - `if localy` = 3000
  - `process.env.PORT` = 443
