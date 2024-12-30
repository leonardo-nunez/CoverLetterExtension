// popup.js

document
  .getElementById('generate-prompt')
  .addEventListener('click', async () => {
    const statusElement = document.getElementById('status');
    const outputElement = document.getElementById('prompt-output');

    try {
      // Get the current tab's URL
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const url = tab.url;

      // Generate the prompt using the config template
      const prompt = CONFIG.PROMPT_TEMPLATE.replace('[URL]', url);

      // Copy the prompt to the clipboard
      await navigator.clipboard.writeText(prompt);

      // Save the prompt using the background script
      chrome.runtime.sendMessage({ action: 'savePrompt', prompt: prompt });

      // Display the prompt in the textarea
      outputElement.value = prompt;

      // Show success message
      statusElement.innerText = 'Prompt copied to clipboard!';
    } catch (error) {
      // Handle errors
      statusElement.innerText = 'Failed to generate prompt.';
      console.error(error);
    }
  });

// Retrieve and display the saved prompt when the popup is opened
chrome.runtime.sendMessage({ action: 'getPrompt' }, (response) => {
  const savedPrompt = response.prompt;
  const outputElement = document.getElementById('prompt-output');
  outputElement.value = savedPrompt; // Display the saved prompt in the textarea
});

// Handle ChatGPT response management
const responseInput = document.getElementById('response-input');
const responseOutput = document.getElementById('response-output');
const saveButton = document.getElementById('save-response');
const clearButton = document.getElementById('clear-response');

// Save the response
saveButton.addEventListener('click', () => {
  const responseText = responseInput.value.trim();
  if (responseText) {
    responseOutput.value = responseText;
    responseInput.value = ''; // Clear the input area
    alert('Response saved!');
  } else {
    alert('Please paste a response before saving.');
  }
});

// Clear the saved response
clearButton.addEventListener('click', () => {
  responseOutput.value = '';
  alert('Saved response cleared!');
});
