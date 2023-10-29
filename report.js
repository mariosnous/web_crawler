const { crawlPage } = require("./crawl");

function printReport(pages) {
  console.log("----- Printing Report -----");
  console.log("\n");
  const sorted = sortingReport(pages);
  for (const sort of sorted) {
    const url = sort[0];
    const count = sort[1];
    console.log(`Found ${count} internal links to ${url}`);
  }
  console.log("----- End of Report -----");
}

function sortingReport(pages) {
  const arr = Object.entries(pages);
  arr.sort((pageA, pageB) => {
    return pageB[1] - pageA[1];
  });
  return arr;
}

module.exports = {
  printReport,
  sortingReport,
};
