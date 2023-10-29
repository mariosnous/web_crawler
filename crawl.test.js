const { test, expect } = require("@jest/globals");
const { normalizeURL, getUrlsFromHtml } = require("./crawl");

test("normalizeURL function should correctly normalize URLs", () => {
  expect(normalizeURL("https://blog.boot.dev/path/")).toBe(
    "https://blog.boot.dev/path/"
  );
  expect(normalizeURL("https://blog.boot.dev/path")).toBe(
    "https://blog.boot.dev/path/"
  );
  expect(normalizeURL("http://blog.boot.dev/path/")).toBe(
    "http://blog.boot.dev/path/"
  );
  expect(normalizeURL("http://blog.boot.dev/path")).toBe(
    "http://blog.boot.dev/path/"
  );
});
test("getUrlsFromHtml should extract and convert relative URLs", () => {
  const htmlBody = '<a href="/page1">Page 1</a>';
  const baseURL = "https://example.com";

  const absoluteUrls = getUrlsFromHtml(htmlBody, baseURL);

  expect(absoluteUrls).toEqual(["https://example.com/page1"]);
});

test("getUrlsFromHtml should handle absolute URLs", () => {
  const htmlBody = '<a href="https://example.com/page2">Page 2</a>';
  const baseURL = "https://example.com";

  const absoluteUrls = getUrlsFromHtml(htmlBody, baseURL);

  expect(absoluteUrls).toEqual(["https://example.com/page2"]);
});

test("getUrlsFromHtml should handle no links", () => {
  const htmlBody = "<p>This is a paragraph.</p>";
  const baseURL = "https://example.com";

  const absoluteUrls = getUrlsFromHtml(htmlBody, baseURL);

  expect(absoluteUrls).toEqual([]);
});
