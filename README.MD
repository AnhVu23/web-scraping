# Web scraping

## Explaination

There are 2 viable tools for scraping data using NodeJS: [Puppeteer](https://github.com/puppeteer/puppeteer) and [Cheerio](https://github.com/cheeriojs/cheerio). Puppeteer is a powerful tool made by Google, while Cheerio was maintained by cheeriojs community. Both tools are doing great work in terms of web scraping. However, I decided to go with Cheerio because it works best for my case. Cheerio is faster compared to Puppeteer because it does not need to use chromium when parsing HTML. Besides, I do not need to run Javascript, which is Puppeteer's important feature, when scraping.

After navigating to [Kodit buy page](https://kodit.io/en/apartments-for-sale/), I am looking for country links (href elements). Then I navigate to each country sale page, and look for each apartment's detail links. After that, I scrape all apartment links in the list and find necessary information for analyzing.

After parsing data from [kodit.io](https://kodit.io/en/apartments-for-sale/), I integrate them with third party APIs, then returning a full analyzed data to client.

## Installation
1. Clone project: ``git clone https://github.com/anhvu-95/web-scraping.git``
2. Open project, and run ``yarn install`` or ``npm install``
3. Run ``yarn dev`` to start local server.

## Usage

# Live demo: [https://web-scraping-sandbox.herokuapp.com/](https://web-scraping-sandbox.herokuapp.com/)
Check documetation [here](https://web-scraping-sandbox.herokuapp.com/api-docs/)

## Technology

1. NodeJS/Express
2. Cheerio
