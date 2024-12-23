(async function() {
    const { idList, currentIndex } = await new Promise(resolve => {
      chrome.storage.local.get(['idList', 'currentIndex'], resolve);
    });
  
    if (currentIndex < idList.length) {
      const id = idList[currentIndex];
      const url = `https://qa-www.gmscolor.com/Formula/Details/${id}`;
      chrome.storage.local.set({ currentIndex: currentIndex + 1 });
  
      window.location.href = url;
  
      window.onload = async function() {
        // Wait for the delete button to be available
        await new Promise(resolve => {
          const observer = new MutationObserver((mutations, obs) => {
            if (document.querySelector('#toolbarDeleteButton > a')) {
              obs.disconnect();
              resolve();
            }
          });
          observer.observe(document, { childList: true, subtree: true });
        });
  
        // Click the delete button
        document.querySelector('#toolbarDeleteButton > a').click();
  
        // Wait for 2 seconds
        await new Promise(resolve => setTimeout(resolve, 2000));
  
        // Enter the reason
        document.querySelector('#deactivateReason').value = 'Cleaning up duplicates from formula conversion';
  
        // Click the submit button
        document.querySelector('#deactivateSubmit').click();
  
        // Wait for the next page to load
        await new Promise(resolve => {
          window.onload = resolve;
        });
  
        // Move to the next URL
        if (parseInt(localStorage.getItem('currentIndex')) < idList.length) {
          window.location.href = `https://qa-www.gmscolor.com/Formula/Details/${idList[parseInt(localStorage.getItem('currentIndex'))]}`;
        } else {
          chrome.storage.local.remove(['idList', 'currentIndex']);
          console.log('All pages processed.');
        }
      };
    } else {
      chrome.storage.local.remove(['idList', 'currentIndex']);
      console.log('All pages processed.');
    }
  })();