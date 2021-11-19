const KEYCODE_ENTER = 13;

const URL_SEPARATOR = "\n";

window.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#url-opener");
  const urlList = form.querySelector("#url-list");

  urlList.addEventListener("keydown", e => {
    if (e.keyCode === KEYCODE_ENTER && e.metaKey) {
      form.requestSubmit();
    }
  });

  form.addEventListener("submit", e => {
    e.preventDefault();

    const urls = urlList.value.split(URL_SEPARATOR);
    urls.forEach(url => {
      url = url.trimLeft().trimRight();
      if (!url) {
        return;
      }

      chrome.tabs.create({
        // Don't steal the user's focus.
        active: false,
        url,
      });
    });
  });
});
