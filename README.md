# Bright Data ChatGPT Search Scraper (Node.js)

[Edit in StackBlitz editor ⚡️](https://stackblitz.com/~/github.com/luminati-io/bright-data-scrape-chatgpt-search-nodejs-project?file=index.js)

This project provides a simple Node.js boilerplate for scraping ChatGPT AI search results using the Bright Data Web Scraper API.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Examples](#examples)
- [Output](#output)
- [Support](#support)
- [License](#license)

---

## Overview

This repository demonstrates how to use the Bright Data Scraper API to trigger and download ChatGPT AI search results. It includes sample prompts and utility functions for batch and custom searches.

---

## Features

- Trigger ChatGPT AI searches via Bright Data Scraper `/trigger` API endpoint
- Monitor progress using `/status` endpoint
- Download and save results as JSON

---

## Prerequisites

- Node.js v16 or higher
- Bright Data account with API KEY

---

## Installation

```sh
git clone https://github.com/your-org/bright-data-scrape-chatgpt-search-nodejs-project.git
cd bright-data-scrape-chatgpt-search-nodejs-project
npm install
```

---

## Usage

1. **Set your Bright Data API token**

   Edit [`index.js`](index.js) and set your API token:
   ```js
   const API_TOKEN = 'YOUR_API_TOKEN_HERE';
   ```

2. **Run the scraper**

   ```sh
   node index.js
   ```

   Results will be saved as a timestamped `.json` file in the project directory.

---

## Configuration

- **API Token:**  
  Get your API token from your Bright Data dashboard under Account Settings.

- **Dataset ID:**  
  The default dataset ID for ChatGPT AI Search is already set in [`index.js`](index.js).

---

## Examples

### Run Sample Searches

By default, the script runs three sample prompts:
```js
const SAMPLE_SEARCHES = [
  { url: "https://chatgpt.com/", prompt: "Top hotels in New York", country: "" },
  { url: "https://chatgpt.com/", prompt: "What are the biggest business trends to watch in the next five years?", country: "" },
  { url: "https://chatgpt.com/", prompt: "Best practices for remote team management", country: "" }
];
```

### Custom Search

Uncomment and edit the following in [`index.js`](index.js) to run your own prompt:
```js
const customSearch = [createSearch("Best programming languages to learn in 2024")];
const customResults = await searchChatGPT(customSearch);
await saveResults(customResults, 'custom_search.json');
```

### Batch Search

```js
const multipleSearches = [
  createSearch("Climate change solutions"),
  createSearch("AI ethics guidelines"),
  createSearch("Sustainable business practices")
];
const multiResults = await searchChatGPT(multipleSearches);
await saveResults(multiResults, 'multiple_searches.json');
```

---

## Output

- Results are saved as JSON files (e.g., `chatgpt_results_YYYY-MM-DDTHH-MM-SS.json`).
- Each file contains the raw API response from Bright Data.

---

## Support

- [Bright Data Help Center](https://brightdata.com/help)
- [Contact Support](https://brightdata.com/contact-us)

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
