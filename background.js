// background.js

chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension Installed.");
});

// Function to save the generated prompt to Chrome Storage
function savePrompt(prompt) {
    chrome.storage.local.set({ 'savedPrompt': prompt }, function() {
        console.log("Prompt saved to storage.");
    });
}

// Function to retrieve the saved prompt from Chrome Storage
function getPrompt(callback) {
    chrome.storage.local.get('savedPrompt', function(result) {
        callback(result.savedPrompt || "");
    });
}

// Listen for messages from popup.js (communication between popup and background)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'savePrompt') {
        savePrompt(request.prompt);
    } else if (request.action === 'getPrompt') {
        getPrompt((prompt) => sendResponse({ prompt }));
        return true; // To ensure the response is sent asynchronously
    }
});
