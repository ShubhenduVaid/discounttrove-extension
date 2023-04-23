(async () => {
  const bTag = document.getElementsByTagName("b");
  bTag[0].innerText = "Searching...";
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  try {
    // loads content script
    await chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },

      files: ["scripts/content.js"],
    });
  } catch (erri) {
    console.error(`failed to execute script: ${erri}`);
  }
})();

// listen for messages from the content script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "popup") {
    try {
      sendResponse({ type: "success" });
      const imgDiv = document.getElementById("imgDiv");
      if (imgDiv) {
        const img = document.createElement("img");
        img.src = request.message;
        img.alt = "searched";
        img.width = 100;
        imgDiv.appendChild(img);
        setTimeout(() => {
          const bTag = document.getElementsByTagName("b");
          bTag[0].innerText = "Search Completed";

          const btnDiv = document.getElementById("btnDiv");
          const button = document.createElement("button");
          button.textContent = "Check Cheaper Alternative";
          button.addEventListener("click", () => {
            window.open(
              `https://discounttrove.co.uk?img=${request.message}`,
              "_blank"
            );
          });
          btnDiv.appendChild(button);
        }, 100);
      }
    } catch (error) {
      console.error("Error in sending to popup", error);
    }
  } else if (request.type === "popupError") {
    try {
      sendResponse({ type: "success" });
      const bTag = document.getElementsByTagName("b");
      bTag[0].innerText = request.message;
    } catch (error) {
      console.error("Error in sending to popup", error);
    }
  }
});
