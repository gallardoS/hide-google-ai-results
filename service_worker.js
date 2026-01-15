const TARGET_HOST_KEYWORD = "google";
const QUERY_PARAM = "q";
const UDM_PARAM = "udm";
const UDM_VALUE = "14";

function shouldRewrite(url) {
    if (!url.hostname.includes(TARGET_HOST_KEYWORD)) return false;
    if (!url.searchParams.has(QUERY_PARAM)) return false;
    if (url.searchParams.get(UDM_PARAM) === UDM_VALUE) return false;
    return true;
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (!changeInfo.url) return;

    let url;
    try {
        url = new URL(changeInfo.url);
    } catch {
        return;
    }

    if (!shouldRewrite(url)) return;

    url.searchParams.set(UDM_PARAM, UDM_VALUE);
    const newUrl = url.toString();
    if (newUrl === changeInfo.url) return;

    chrome.tabs.update(tabId, { url: newUrl });
});
