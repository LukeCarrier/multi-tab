const KEYCODE_ENTER = 13;

const URL_SEPARATOR = "\n";

window.addEventListener("DOMContentLoaded", () => {
  const openTabsForm = document.querySelector("#open-tabs");
  const openTabsUrlList = openTabsForm.querySelector("[name='url-list']");
  const openTabsTabGroup = openTabsForm.querySelector("[name='tab-group']");

  if (chrome.tabGroups) {
    chrome.tabGroups.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }, tabGroups => {
      let tabGroupOptions = `<option value="-1">None</option>`;
      tabGroups.forEach(tabGroup => {
        tabGroupOptions += `<option value="${tabGroup.id}">(${tabGroup.color}) ${tabGroup.title}</option>`;
      });
      openTabsTabGroup.innerHTML = tabGroupOptions;
    });
  } else {
    openTabsTabGroup.remove();
  }

  openTabsUrlList.addEventListener("keydown", e => {
    if (e.keyCode === KEYCODE_ENTER && e.metaKey) {
      openTabsForm.requestSubmit();
    }
  });

  openTabsForm.addEventListener("submit", e => {
    e.preventDefault();

    const urls = openTabsUrlList.value.split(URL_SEPARATOR);
    const tabIds = [];

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
