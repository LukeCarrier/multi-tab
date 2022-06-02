const KEYCODE_ENTER = 13;

const URL_SEPARATOR = "\n";

const TAB_GROUP_ID_NEW = -2;

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
  const openTabsTabGroupName = openTabsForm.querySelector("[name='tab-group-name']");
  const openTabsSubmitButton = openTabsForm.querySelector("[name='submit']");

  const copyUrlsForm = document.querySelector("#copy-urls");
  const copyUrlsTabGroup = copyUrlsForm.querySelector("[name='tab-group']");
  const copyUrlsSubmitButton = copyUrlsForm.querySelector("[name='submit']");

  const tabGroupWrappers = document.querySelectorAll(".tab-group-wrapper");

  if (chrome.tabGroups) {
    openTabsTabGroup.addEventListener("change", e => e.target.dataset.value = e.target.value);

    chrome.tabGroups.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }, tabGroups => {
      let tabGroupOptions = `<option value="-1">None</option>`;
      tabGroups.forEach(tabGroup => {
        tabGroupOptions += `<option value="${tabGroup.id}">(${tabGroup.color}) ${tabGroup.title}</option>`;
      });
      openTabsTabGroup.innerHTML = tabGroupOptions + `<option value="${TAB_GROUP_ID_NEW}">New</option>`;
      copyUrlsTabGroup.innerHTML = tabGroupOptions;
    });
  } else {
    tabGroupWrappers.forEach(wrapper => wrapper.remove());
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
    const failures = [];
    const tabIds = [];
    const groupId = parseInt(openTabsTabGroup.value, 10);
    const groupTitle = openTabsTabGroupName.value;

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
        if (tab) {
          tabIds.push(tab.id);
        } else {
          failures.push({ url, error: chrome.runtime.lastError });
        }
        if (tabIds.length + failures.length === urls.length) {
          if (chrome.tabGroups && groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
            const groupParams = { tabIds };
            let groupCb = null;

            if (groupId === TAB_GROUP_ID_NEW) {
              groupCb = groupId => {
                chrome.tabGroups.update(groupId, {
                  title: groupTitle,
                });
              };
            } else {
              groupParams.groupId = groupId;
            }

            chrome.tabs.group(groupParams, groupCb);
          }
          const doneHtml = tabIds.length === urls.length ?
            "Opened!" : `Opened (${failures.length} failures)!`;
          enableButton(doneHtml);
        }
      });
    });
  });

  copyUrlsForm.addEventListener("submit", e => {
    e.preventDefault();
    const enableButton = disableButton(copyUrlsSubmitButton, "Copying URLs...");

    const query = {};
    if (chrome.tabGroups) {
      query.groupId = parseInt(copyUrlsTabGroup.value, 10);
    }
    chrome.tabs.query(query, tabs => {
      const urls = tabs.map(tab => tab.url).join(URL_SEPARATOR);
      navigator.clipboard.writeText(urls);
      enableButton("Copied!")
    });
  });
});
