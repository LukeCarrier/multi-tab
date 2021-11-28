const KEYCODE_ENTER = 13;

const URL_SEPARATOR = "\n";

function disableButton(button, inProgressHtml) {
  const originalHtml = button.innerHTML;

  button.disabled = true;
  button.innerHTML = inProgressHtml;

  return doneHtml => {
    button.innerHTML = doneHtml;

    setTimeout(() => {
      button.disabled = false;
      button.innerHTML = originalHtml;
    }, 500);
  };
}

window.addEventListener("DOMContentLoaded", () => {
  const openTabsForm = document.querySelector("#open-tabs");
  const openTabsUrlList = openTabsForm.querySelector("[name='url-list']");
  const openTabsTabGroup = openTabsForm.querySelector("[name='tab-group']");
  const openTabsSubmitButton = openTabsForm.querySelector("[name='submit']");

  const copyUrlsForm = document.querySelector("#copy-urls");
  const copyUrlsTabGroup = copyUrlsForm.querySelector("[name='tab-group']");
  const copyUrlsSubmitButton = copyUrlsForm.querySelector("[name='submit']");

  const tabGroupSelects = [openTabsTabGroup, copyUrlsTabGroup];

  if (chrome.tabGroups) {
    chrome.tabGroups.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }, tabGroups => {
      let tabGroupOptions = `<option value="-1">None</option>`;
      tabGroups.forEach(tabGroup => {
        tabGroupOptions += `<option value="${tabGroup.id}">(${tabGroup.color}) ${tabGroup.title}</option>`;
      });
      tabGroupSelects.forEach(select => select.innerHTML = tabGroupOptions);
    });
  } else {
    tabGroupSelects.forEach(select => select.remove());
  }

  openTabsUrlList.addEventListener("keydown", e => {
    if (e.keyCode === KEYCODE_ENTER && e.metaKey) {
      openTabsForm.requestSubmit();
    }
  });

  openTabsForm.addEventListener("submit", e => {
    e.preventDefault();
    const enableButton = disableButton(openTabsSubmitButton, "Opening tabs...");

    const urls = openTabsUrlList.value.split(URL_SEPARATOR);
    const tabIds = [];
    const groupId = parseInt(openTabsTabGroup.value, 10);

    urls.forEach(url => {
      url = url.trimLeft().trimRight();
      if (!url) {
        return;
      }

      chrome.tabs.create({
        // Don't steal the user's focus.
        active: false,
        url,
      }, tab => {
        tabIds.push(tab.id);
        if (tabIds.length === urls.length) {
          if (groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
            chrome.tabs.group({ groupId, tabIds })
          }
          enableButton("Opened!");
        }
      });
    });
  });

  copyUrlsForm.addEventListener("submit", e => {
    e.preventDefault();
    const enableButton = disableButton(copyUrlsSubmitButton, "Copying URLs...");

    const groupId = parseInt(copyUrlsTabGroup.value, 10);
    chrome.tabs.query({ groupId }, tabs => {
      const urls = tabs.map(tab => tab.url).join(URL_SEPARATOR);
      navigator.clipboard.writeText(urls);
      enableButton("Copied!")
    });
  });
});
