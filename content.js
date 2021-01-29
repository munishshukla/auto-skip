(function () {
    console.log("Auto Skip by Kodebroz");
    let kodebrozAutoSkipClassList = [
      "videoAdUiSkipButton",
      "ytp-ad-skip-button ytp-button",
      "ytp-ad-overlay-close-button",
    ];
    let kodebrozAutoSkipYoutubePlayerId = "ytd-player";
  
    let kodebrozAutoSkipPolling;
    let observedSkipBtn;
    let skipBtnObserver;
  
    function triggerClickWhenVisible(button) {
      if (button === observedSkipBtn) {
        return;
      }
  
      var parentWithDisplayStyle = (function () {
        var currentParent = button;
        while (currentParent !== null) {
          if (currentParent.style.display === "none") {
            return currentParent;
          }
  
          currentParent = currentParent.parentElement;
        }
  
        return null;
      })();
  
      if (!parentWithDisplayStyle) {
        return;
      }
  
      if (skipBtnObserver && observedSkipBtn) {
        skipBtnObserver.disconnect();
        kodebrozAutoSkipTriggerClick(observedSkipBtn);
      }
  
      if (!skipBtnObserver) {
        skipBtnObserver = new MutationObserver(function () {
          if (!isBtnVisible(observedSkipBtn)) {
            return;
          }
  
          kodebrozAutoSkipTriggerClick(observedSkipBtn);
          observedSkipBtn = undefined;
          skipBtnObserver.disconnect();
        });
      }
  
      observedSkipBtn = button;
  
      skipBtnObserver.observe(parentWithDisplayStyle, { attributes: true });
    }
  
    function kodebrozAutoSkipTriggerClick(el) {
      var etype = "click";
      if (typeof el.fireEvent === "function") {
        el.fireEvent("on" + etype);
      } else if (typeof el.dispatchEvent === "function") {
        var evObj = document.createEvent("Events");
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
      }
    }
  
    function isBtnVisible(button) {
      return button.offsetParent === null ? false : true;
    }
  
    function kodebrozAutoSkipRun() {
      let element = kodebrozAutoSkipClassList
        .map((name) => {
          return Array.from(document.getElementsByClassName(name)) || [];
        })
        .reduce(function (acc, elems) {
          return acc.concat(elems);
        }, []);
  
      element.forEach((button) => {
        if (!isBtnVisible(button)) {
          triggerClickWhenVisible(button);
  
          return;
        }
  
        kodebrozAutoSkipTriggerClick(button);
      });
    }
  
    function kodebrozAutoSkipYoutubePlayer() {
      let playerElement = document.getElementsByTagName(
        kodebrozAutoSkipYoutubePlayerId
      );
      return playerElement && playerElement[0];
    }
  
    function kodebrozAutoSkipIsReady() {
      if (!("MutationObserver" in window)) {
        return false;
      }
  
      let ytdPlayerElement = kodebrozAutoSkipYoutubePlayer();
  
      if (!ytdPlayerElement) {
        return false;
      }
  
      var observer = new MutationObserver(function () {
        kodebrozAutoSkipRun();
      });
  
      observer.observe(ytdPlayerElement, { childList: true, subtree: true });
  
      clearTimeout(kodebrozAutoSkipPolling);
  
      return true;
    }
  
    function kodebrozAutoSkipStartUp() {
      clearTimeout(kodebrozAutoSkipPolling);
  
      if (kodebrozAutoSkipIsReady()) {
        return;
      }
  
      kodebrozAutoSkipPolling = setTimeout(function () {
        kodebrozAutoSkipRun();
  
        kodebrozAutoSkipStartUp();
      }, 2000);
    }
  
    function kodebrozAutoSkipIframe() {
      try {
        return window.self !== window.top;
      } catch (e) {
        return true;
      }
    }
  
    function kodebrozAutoSkipInit() {
      /**
       * @description chek for iframe
       */
      let flag = kodebrozAutoSkipIframe();
      if (!flag) {
        kodebrozAutoSkipStartUp();
      }
    }
  
    kodebrozAutoSkipInit();
  })();
  