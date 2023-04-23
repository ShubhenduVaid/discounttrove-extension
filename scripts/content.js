var imgWrapper =
  document.getElementById("imgTagWrapperId") ||
  document.getElementsByClassName("imgTagWrapper");

if (imgWrapper.length > 1) {
  for (let index = 0; index < imgWrapper.length; index++) {
    if (imgWrapper[index].innerHTML.includes("<img")) {
      imgWrapper = imgWrapper[index];
    }
  }
} else {
  if (imgWrapper.length === 0) {
    imgWrapper = document.getElementById("landing-image-wrapper");
  }
}

try {
  if (!imgWrapper.querySelector("img:first-of-type")) {
    const responseBackground = chrome.runtime.sendMessage({
      type: "popupError",
      message: "Please use me with a valid Amazon Product Page",
    });

    console.log("content error", responseBackground);
  } else {
    const firstImg = imgWrapper
      .querySelector("img:first-of-type")
      .getAttribute("src");

    // sends message to content script
    const responseBackground = chrome.runtime.sendMessage({
      type: "popup",
      message: firstImg,
    });

    console.log("content success", responseBackground);
  }
} catch (error) {
  const responseBackground = chrome.runtime.sendMessage({
    type: "popupError",
    message: "Please use me with a valid Amazon Product Page",
  });

  console.log("content error", responseBackground);
}
