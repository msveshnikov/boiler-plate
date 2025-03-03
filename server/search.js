import { load } from 'cheerio';

export const MAX_SEARCH_RESULT_LENGTH = 7000;

export async function searchWebContent(results) {
    try {
        const pageContents = await Promise.all(
            results.slice(0, 3).map(async (result) => {
                return await fetchPageContent(result.link);
            })
        );
        return pageContents?.join('\n').slice(0, MAX_SEARCH_RESULT_LENGTH * 2);
    } catch (e) {
        console.error(e);
        return null;
    }
}

const userAgents = [
    // 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
    // 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36',
    // 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36'
];

export async function fetchSearchResults(query) {
    try {
        const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
        const searchUrl = `https://bing.com/search?lang=en&q=${encodeURIComponent(query)}`;
        const response = await fetch(searchUrl, { headers: { 'User-Agent': randomUserAgent } });
        const html = await response.text();
        const $ = load(html);

        const results = $('.b_algo')
            .map((_, result) => {
                const title = $(result).find('h2').text().trim();
                const link = $(result).find('a').attr('href');
                const snippet = $(result).find('.b_lineclamp2').text().trim();
                return { title, link, snippet };
            })
            .get();

        return results;
    } catch {
        return null;
    }
}

const MAX_FILE_SIZE = 1 * 1024 * 1024;
const TIMEOUT = 10000;

export async function fetchPageContent(url) {
    try {
        const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

        const response = await fetch(url, {
            headers: { 'User-Agent': randomUserAgent },
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        const contentType = response.headers.get('Content-Type');
        if (
            contentType &&
            (contentType.includes('application/pdf') ||
                contentType.includes('audio') ||
                contentType.includes('video') ||
                contentType.includes('image'))
        ) {
            console.log(`fetchPageContent skipped (${contentType})`, url);
            return null;
        }

        const contentLength = response.headers.get('Content-Length');
        if (contentLength && parseInt(contentLength) > MAX_FILE_SIZE) {
            console.log('fetchPageContent skipped (file too large)', url);
            return null;
        }

        const html = await response.text();
        const $ = load(html);
        $('script, style').remove();
        const content = $('body *')
            .map((_, el) => $(el).text().trim())
            .get()
            .join(' ');
        return content?.slice(0, MAX_SEARCH_RESULT_LENGTH);
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('fetchPageContent timed out', url);
        } else {
            console.error('fetchPageContent error', error);
        }
        return null;
    }
}

// console.log(await fetchSearchResults("DeepSeek and Dario Amodei"))
