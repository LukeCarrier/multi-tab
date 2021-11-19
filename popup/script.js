const KEYCODE_ENTER = 13;

const URL_SEPARATOR = "\n";

window.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#url-opener");
  const urlList = form.querySelector("#url-list");
  const tabGroupSelect = form.querySelector("#tab-group");

  if (chrome.tabGroups) {
    chrome.tabGroups.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }, tabGroups => {
      let tabGroupOptions = `<option value="-1">None</option>`;
      tabGroups.forEach(tabGroup => {
        tabGroupOptions += `<option value="${tabGroup.id}">(${tabGroup.color}) ${tabGroup.title}</option>`;
      })
      tabGroupSelect.innerHTML = tabGroupOptions;
    });
  } else {
    tabGroupSelect.remove();
  }

  urlList.addEventListener("keydown", e => {
    if (e.keyCode === KEYCODE_ENTER && e.metaKey) {
      form.requestSubmit();
    }
  });

  form.addEventListener("submit", e => {
    e.preventDefault();

    const urls = urlList.value.split(URL_SEPARATOR);
    const tabIds = [];
    const groupId = tabGroupSelect.value === chrome.tabGroups.TAB_GROUP_ID_NONE.toString() ?
      null : parseInt(tabGroupSelect.value, 10);

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
          chrome.tabs.group({
            groupId: groupId === -1 ? null : groupId,
            tabIds,
          });
        }
      });
    });
  });
});
