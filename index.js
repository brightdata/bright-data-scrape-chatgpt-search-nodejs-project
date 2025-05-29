// ChatGPT AI Search Scraper - Bright Data API
// Simple Node.js implementation using ES6 modules
// Install: npm install chalk
// Run with: node index.js

import https from 'https';
import chalk from 'chalk';

// ========================================
// CONFIGURATION
// ========================================
const API_TOKEN = 'BRIGHT_DATA_API_KEY';  // Get from Account Settings -> API Key
const DATASET_ID = 'gd_m7aof0k82r803d5bjm'; // Fixed ChatGPT AI Search dataset ID 

// ========================================
// SAMPLE SEARCH EXAMPLES (Reduced to 3 for faster results)
// ========================================
const SAMPLE_SEARCHES = [
    {
        "url": "https://chatgpt.com/",
        "prompt": "Top hotels in New York",
        "country": ""
    },
    {
        "url": "https://chatgpt.com/",
        "prompt": "What are the biggest business trends to watch in the next five years?",
        "country": ""
    },
    {
        "url": "https://chatgpt.com/",
        "prompt": "Best practices for remote team management",
        "country": ""
    }
];

// ========================================
// CORE FUNCTIONS
// ========================================

// Simple API request function
function apiRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.brightdata.com',
            path: path,
            method: method,
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                if (res.statusCode >= 400) {
                    reject({
                        statusCode: res.statusCode,
                        error: 'API request failed',
                        rawResponse: body
                    });
                    return;
                }
                resolve(body); // Return raw response
            });
        });

        req.on('error', (error) => {
            reject({
                error: 'Request failed',
                details: error.message
            });
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

// Sleep utility
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// ========================================
// MAIN SCRAPER FUNCTION
// ========================================

async function searchChatGPT(searchInputs) {
    try {
        console.log(chalk.cyan.bold('🤖 Starting ChatGPT AI Search...'));
        console.log(chalk.blue(`📝 Searching ${searchInputs.length} prompts`));
        
        // Display the raw JSON being sent
        console.log(chalk.gray('📤 Sending JSON body:'));
        console.log(chalk.gray(JSON.stringify(searchInputs, null, 2)));
        
        // 1. Trigger collection - send searchInputs as raw JSON body
        const triggerPath = `/datasets/v3/trigger?dataset_id=${DATASET_ID}`;
        const rawResponse = await apiRequest('POST', triggerPath, searchInputs);
        const { snapshot_id } = JSON.parse(rawResponse);
        console.log(chalk.green(`✅ Search started! Snapshot ID: ${snapshot_id}`));

        // 2. Wait for completion
        console.log(chalk.yellow('⏳ Processing searches...'));
        let status = 'running';
        let attempts = 0;
        const maxAttempts = 60; // 5 minutes max wait
        
        while (status !== 'ready' && attempts < maxAttempts) {
            await sleep(5000); // Wait 5 seconds
            const progressResponse = await apiRequest('GET', `/datasets/v3/progress/${snapshot_id}`);
            const progress = JSON.parse(progressResponse);
            status = progress.status;
            attempts++;
            
            console.log(chalk.gray(`📊 Status: ${status} (${attempts}/${maxAttempts})`));
            
            if (status === 'failed') throw new Error('Search failed');
        }

        if (status !== 'ready') {
            throw new Error('Search timeout - taking longer than expected');
        }

        // 3. Download results
        console.log(chalk.blue('⬇️ Downloading AI responses...'));
        const downloadedResults = await apiRequest('GET', `/datasets/v3/snapshot/${snapshot_id}`);
        console.log(chalk.green.bold(`🎉 Success! Downloaded results`));

        return downloadedResults;

    } catch (error) {
        console.error(chalk.red.bold('❌ Error:'), chalk.red(error.message || JSON.stringify(error, null, 2)));
        throw error;
    }
}

// ========================================
// HELPER FUNCTIONS
// ========================================

// Create a custom search input
function createSearch(prompt, country = "") {
    return {
        "url": "https://chatgpt.com/",
        "prompt": prompt,
        "country": country
    };
}

// Save results to file
async function saveResults(data, filename = null) {
    const fs = await import('fs');
    
    // Generate filename with timestamp if not provided
    if (!filename) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        filename = `chatgpt_results_${timestamp}.json`;
    }

    // Save raw response
    fs.writeFileSync(filename, data);
    console.log(chalk.green(`💾 Results saved to ${chalk.underline(filename)}`));
}

// ========================================
// MAIN FUNCTION
// ========================================

async function main() {
    console.log(chalk.magenta.bold('🌟 ChatGPT AI Search Scraper'));
    console.log(chalk.magenta('============================='));
    
    // Validate API token
    if (API_TOKEN === 'YOUR_API_TOKEN_HERE') {
        console.log(chalk.red.bold('❌ Please update your API_TOKEN!'));
        console.log(chalk.yellow('📖 Get it from: Account Settings -> API Token'));
        return;
    }

    try {
        // Example 1: Use sample searches (sent as raw JSON body)
        console.log(chalk.cyan('\n📋 Running sample searches...'));
        const sampleResults = await searchChatGPT(SAMPLE_SEARCHES);
        await saveResults(sampleResults);

        // Example 2: Custom single search
        // const customSearch = [createSearch("Best programming languages to learn in 2024")];
        // const customResults = await searchChatGPT(customSearch);
        // await saveResults(customResults, 'custom_search.json');

        // Example 3: Multiple custom searches
        // const multipleSearches = [
        //     createSearch("Climate change solutions"),
        //     createSearch("AI ethics guidelines"),
        //     createSearch("Sustainable business practices")
        // ];
        // const multiResults = await searchChatGPT(multipleSearches);
        // await saveResults(multiResults, 'multiple_searches.json');

        console.log(chalk.green.bold('\n✨ All done! Check the saved JSON file for results.'));
        
    } catch (error) {
        console.error(chalk.red.bold('💥 Failed:'), chalk.red(error.message || JSON.stringify(error, null, 2)));
    }
}

// ========================================
// ADDITIONAL EXAMPLES
// ========================================

// Quick search function for single prompts
async function quickSearch(prompt) {
    const searchInput = [createSearch(prompt)];
    return await searchChatGPT(searchInput);
}

// Batch search function for multiple prompts
async function batchSearch(prompts) {
    const searchInputs = prompts.map(prompt => createSearch(prompt));
    return await searchChatGPT(searchInputs);
}

// Run if executed directly  
if (process.argv[1] === new URL(import.meta.url).pathname) {
    main().catch(console.error);
}

// Export for use in other files
export { searchChatGPT, createSearch, quickSearch, batchSearch, saveResults, SAMPLE_SEARCHES };