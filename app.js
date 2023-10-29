const { crawlPage } = require("./crawl");
const { printReport } = require("./report");

async function main() {
  const processedURL = process.argv[2];

  if (process.argv.length !== 3) {
    console.log("Usage: npm run start BASE_URL");
    console.log("Please provide exactly one URL as a command-line argument.");
  } else {
    console.log("Crawler is starting at the following base URL:");
    console.log(processedURL);
    // You can start your crawling logic here or call other functions to do so.

    const pages = await crawlPage(processedURL, processedURL, {});
    printReport(pages);
  }
}

main();
