// Get current selected Tab
chrome.tabs.query({ active: true }, function (tab) {
  updatePopupURLForSelectedTab(tab);
});

chrome.runtime.onMessage.addListener((msg, phone_no) => {
  if (msg.name === 'saved-number') {
    if (chrome.runtime.setUninstallURL) {
      chrome.runtime.setUninstallURL(
        `https://whatsappcontactdownload.com/uninstall/${msg.data}`
      );
    }
  }
});

chrome.runtime.onInstalled.addListener((details) => {
  chrome.tabs.query({ url: 'https://web.whatsapp.com/' }, function (tabs) {
    if (tabs.length) {
      chrome.tabs.reload(tabs[0].id);
      chrome.tabs.update(tabs[0].id, { active: true });
    } else {
      chrome.tabs.create({
        url: 'https://web.whatsapp.com/',
        active: true,
      });
    }
  });
});

// Listen for selected tab
chrome.tabs.onActivated.addListener(function (tabId, selectInfo) {
  // Get selected tab
  chrome.tabs.get(tabId.tabId, function (tab) {
    updatePopupURLForSelectedTab(tab);
  });
});

// Listen navigation update
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  chrome.tabs.query({ active: true }, function (selectedTab) {
    let selectedtabUrl = null;
    if (Array.isArray(selectedTab)) {
      selectedtabUrl = selectedTab[0].url;
    } else {
      selectedtabUrl = selectedTab.url;
    }

    if (selectedtabUrl === tab.url) {
      updatePopupURLForSelectedTab(tab);
    }
  });
});

function updatePopupURLForSelectedTab(tab) {
  if (!tab) {
    return;
  }

  let isWhatsappTab = null;
  if (Array.isArray(tab)) {
    isWhatsappTab = tab[0].url.includes('web.whatsapp.com');
  } else {
    isWhatsappTab = tab.url.includes('web.whatsapp.com');
  }

  if (isWhatsappTab) {
    chrome.action.setPopup({ popup: '/popup.html' });
  } else {
    chrome.action.setPopup({ popup: '/gowa.html' });
  }
}
