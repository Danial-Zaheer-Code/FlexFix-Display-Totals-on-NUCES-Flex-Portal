// When the extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  if (tab.url.startsWith('https://flexstudent.nu.edu.pk/Student/StudentMarks')) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['inject.js']
    });
  }
});

// When a tab is updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === 'complete' &&
    tab.url &&
    tab.url.startsWith('https://flexstudent.nu.edu.pk/Student/StudentMarks')
  ) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['inject.js']
    });
  }
});

// When a message is received from content script
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message === 'pageChange' && sender.tab?.id) {
    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      files: ['inject.js']
    });
  }
});
