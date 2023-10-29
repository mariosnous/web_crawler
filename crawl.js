const { JSDOM } = require("jsdom");
const fetch = require("isomorphic-fetch");

function normalizeURL(url) {
  // parse the input URL using the URL Object
  const newURL = new URL(url);
  if (!newURL.pathname.endsWith("/")) {
    newURL.pathname += "/";
  }
  // Convert URL back to String
  const normalizedURL = newURL.toString();

  return normalizedURL;
}

function getUrlsFromHtml(htmlBody, baseURL) {
  const newJSDOM = new JSDOM(htmlBody);
  const linkSelector = newJSDOM.window.document.querySelectorAll("a");
  const absURLS = [];
  linkSelector.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href.startsWith("http://") && !href.startsWith("https://")) {
      // Combine with baseUrl to make it absolute
      const absoluteUrl = new URL(href, baseURL).href;
      absURLS.push(absoluteUrl);
    } else {
      // case href already absolute
      absURLS.push(href);
    }
  });
  return absURLS;
}

async function crawlPage(baseURL, currentURL, pages) {
  // Check if the current URL is on the same hostname as the base URL
  const newCurrentUrl = new URL(currentURL);
  const newbaseUrl = new URL(baseURL);
  if (newCurrentUrl.hostname !== newbaseUrl.hostname) {
    // If not, return the current pages object as there's no need to crawl offsite URLs
    return pages;
  }

  // Get a normalized version of the current URL
  const normalizedURL = normalizeURL(currentURL);

  // If we've already visited this page, just increment the count and return the pages object
  if (pages[normalizedURL] > 0) {
    pages[normalizedURL]++;
    return pages;
  }

  // Initialize this page in the pages object, setting the count to 0 if it's the base URL, or 1 otherwise
  if (currentURL === baseURL) {
    pages[currentURL] = 0;
  } else {
    pages[normalizedURL] = 1;
  }

  // Log that we are crawling the current URL
  console.log(`Crawling ${currentURL}`);

  let htmlBody = "";
  try {
    // Fetch the current URL
    const resp = await fetch(currentURL);
    if (resp.status > 399) {
      // Handle HTTP errors and log the status code
      console.log(`Got HTTP error, status code: ${resp.status}`);
      return pages;
    }
    const contentType = resp.headers.get("content-type");
    if (!contentType.includes("text/html")) {
      // Check if the response is HTML
      console.log(`Got non-HTML response: ${contentType}`);
      return pages;
    }
    htmlBody = await resp.text();
  } catch (err) {
    // Handle fetch errors and log the error message
    console.log(err.message);
  }

  // Get the URLs from the HTML body of the current page
  const nextURLs = getUrlsFromHtml(htmlBody, baseURL);

  // Recursively crawl each URL found on the page
  for (const nextURL of nextURLs) {
    pages = await crawlPage(baseURL, nextURL, pages);
  }

  return pages;
}

module.exports = {
  normalizeURL,
  getUrlsFromHtml,
  crawlPage,
};
