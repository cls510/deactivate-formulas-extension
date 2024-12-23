document.getElementById('startButton').addEventListener('click', () => {
    const idList = document.getElementById('idList').value.split(',');
    chrome.storage.local.set({ idList, currentIndex: 0 }, () => {
      chrome.scripting.executeScript({
        target: { tabId: chrome.tabs.TAB_ID_NONE },
        files: ['content.js']
      });
    });
  });