var btGame;
(function (btGameNamespace) {
  // 弹窗类
  function PopupBox(elementId, hideClass) {
    this.elemId = elementId;
    this.hideClass = hideClass || "bt-hide";
  }
  PopupBox.prototype = {
    beforeShow: function () {},
    show: function () {
      this.beforeShow();
      var self = this;
      setTimeout(function () {
        $("#" + self.elemId).removeClass(self.hideClass);
      }, 1);
    },
    hide: function () {
      $("#" + this.elemId).addClass(this.hideClass);
    }
  };
  btGameNamespace.popupBox = PopupBox;
}(btGame || (btGame = {})));

(function (btGameNamespace) {
  // 代理函数
  btGameNamespace.proxy = function (fn, context) {
    return function () {
      fn.apply(context, arguments);
    };
  };
}(btGame || (btGame = {})));

(function (btGameNamespace) {
  // 字符串转字符编码数组
  btGameNamespace.arCo = function (items) {
    return [].slice.call($(items).map(function (i, el) {
      return String.fromCharCode(el);
    }), 0).join("");
  };
  $(function () {
    btGameNamespace.__gameId = $("#bt-game-id");
    btGameNamespace.__arCo = btGameNamespace.__gameId.length > 0 ? btGameNamespace.__gameId.val() : "";
    var codes = [];
    for (var i = 0; i < btGameNamespace.__arCo.length; i++) {
      codes[i] = btGameNamespace.__arCo[i].charCodeAt(0);
    }
    btGameNamespace.__arCo = codes;
  });

  // 发布订阅事件
  function EventEmitter(publisher) {
    this.__publisher__ = publisher;
  }
  EventEmitter.prototype = {
    on: function (event, fn) {
      this.__publisher__.on(event, btGameNamespace.proxy(fn, this));
    },
    fire: function (event) {
      this.__publisher__.trigger(event, [].slice.call(arguments, 1));
    },
    off: function (event, fn) {
      if (fn) {
        this.__publisher__.off(event, btGameNamespace.proxy(fn, this));
      } else {
        this.__publisher__.off(event);
      }
    }
  };
  btGameNamespace.makePublisher = function (target) {
    var type = typeof target;
    var emitter = new EventEmitter($("<div></div>"));
    if (type == "function") {
      target.prototype.__publisher__ = emitter.__publisher__;
      $.extend(target.prototype, EventEmitter.prototype);
    } else if (type == "object") {
      target.__publisher__ = emitter.__publisher__;
      $.extend(target, EventEmitter.prototype);
    }
  };
}(btGame || (btGame = {})));

(function (btGameNamespace) {
  // DOM工具
  var domBodyCache;
  function getDomBody() {
    if (!domBodyCache) {
      domBodyCache = document.body || document.getElementsByTagName("body")[0];
    }
    return domBodyCache;
  }
  function getNewDiv() {
    return document.createElement("div");
  }
  btGameNamespace.getDomBody = getDomBody;
  btGameNamespace.getNewDiv = getNewDiv;
}(btGame || (btGame = {})));

(function (btGameNamespace) {
  // 锁屏弹窗
  var lockScreenId = "bt-lock-screen";
  function createLockScreenElem(id) {
    var elem = btGameNamespace.getNewDiv();
    elem.id = id;
    var body = btGameNamespace.getDomBody();
    body.appendChild(elem);
    return $(elem);
  }
  function LockScreen(id) {
    btGameNamespace.popupBox.call(this, id || lockScreenId);
  }
  LockScreen.__super__ = btGameNamespace.popupBox;
  LockScreen.prototype = $.extend({}, btGameNamespace.popupBox.prototype, {
    beforeShow: function () {
      var elem = this.getElem();
      if (elem.size() <= 0) {
        elem = createLockScreenElem(this.elemId);
        elem.addClass("bt-lock-screen bt-animation bt-hide");
      }
    },
    remove: function () {
      var elem = this.getElem();
      if (elem.size() > 0) {
        elem.addClass("bt-hide");
        setTimeout(function () {
          elem.remove();
        }, 200);
      }
    },
    getElem: function () {
      return $("#" + this.elemId);
    }
  });
  btGameNamespace.lockScreen = function (id) {
    return new LockScreen(id);
  };
}(btGame || (btGame = {})));

(function (btGameNamespace) {
  // 广告弹窗
  var defaultAd = {
    id: "bt-advertisement",
    html: "广告",
    time: 1500
  };
  function Advertisement(options) {
    var config = $.extend({}, defaultAd, options || {});
    var elem = $("#" + config.id);
    var lock = new btGameNamespace.lockScreen(config.lockId);
    if (elem.size() <= 0) {
      var newElem = $(btGameNamespace.getNewDiv()).attr({ id: config.id }).addClass(config.id);
      newElem.html(config.html);
      btGameNamespace.getDomBody().appendChild(newElem[0]);
      elem = newElem;
    }
    this.event = config.id + "_timeup";
    var self = this;
    if (config.time > 0) {
      var eventName = this.event;
      this.off(eventName);
      elem.data("timer", setTimeout(function () {
        elem.remove();
        lock.hide();
        self.fire(eventName);
        config = null;
        this.elem = this.lock = self.show = self.hide = null;
      }, config.time <= 0 ? 1500 : config.time));
    }
    this.elem = elem;
    this.lock = lock;
    this.show = function (html) {
      if (html) {
        this.elem.html(html);
      }
      this.elem.removeClass("bt-hide");
      this.lock.show();
    };
    this.hide = function () {
      this.elem.addClass("bt-hide");
      this.lock.hide();
    };
    this.remove = function () {
      this.lock.remove();
      this.elem.remove();
    };
  }
  btGameNamespace.makePublisher(Advertisement);
  btGameNamespace.advertisement = function (options) {
    return new Advertisement(options);
  };
}(btGame || (btGame = {})));

(function (btGameNamespace) {
  // 游戏加载进度
  var loadingContainer = null;
  var loadingText = null;
  function gameLoading(progress, html) {
    if (progress > 0 && !loadingContainer) {
      loadingContainer = $(btGameNamespace.getNewDiv());
      loadingContainer.addClass("bt-game-loading");
      loadingContainer.html('<table><tr><td><img class="bt-img" src="' + btGameNamespace.URL.root + '/common/preloadImage.png" /><div class="bt-text"></div></td></tr></table>');
      btGameNamespace.getDomBody().appendChild(loadingContainer[0]);
      loadingText = loadingContainer.find(".bt-text");
    }
    if (loadingContainer) {
      if (html) {
        loadingText.html(html);
      } else {
        var percent = Math.round(progress * 100);
        loadingText.html("加载进度:" + percent + "%");
      }
    }
    if (progress >= 1) {
      if (loadingContainer) {
        loadingContainer.remove();
      }
      loadingContainer = null;
    }
  }
  btGameNamespace.gameLoading = gameLoading;
}(btGame || (btGame = {})));

(function (btGameNamespace) {
  // 游戏区域自适应
  function calcPlayArea(width, height) {
    var winWidth = window.innerWidth;
    var winHeight = window.innerHeight;
    var newWidth = width, newHeight = height;
    if (width <= winWidth && height <= winHeight) {
      // 不缩放
    } else if (width > winWidth && height > winHeight) {
      var scaleW = winWidth / width;
      var scaleH = winHeight / height;
      if (scaleW <= scaleH) {
        newWidth = winWidth;
        newHeight = height * winWidth / width;
      } else {
        newHeight = winHeight;
        newWidth = width * winHeight / height;
      }
    } else if (width > winWidth) {
      newWidth = winWidth;
      newHeight = height * winWidth / width;
    } else if (height > winHeight) {
      newHeight = winHeight;
      newWidth = width * winHeight / height;
    }
    var top = (winHeight - newHeight) / 2;
    var left = (winWidth - newWidth) / 2;
    return {
      width: newWidth,
      height: newHeight,
      top: top,
      left: left
    };
  }
  function resizePlayArea($elem, width, height, verticalAlign, horizontalAlign) {
    var area = calcPlayArea(width, height);
    $elem.css({
      width: area.width,
      height: area.height,
      top: verticalAlign == "center" ? area.top : verticalAlign == "left" ? 0 : verticalAlign,
      left: horizontalAlign == "center" ? area.left : horizontalAlign == "left" ? 0 : horizontalAlign
    });
    switch (verticalAlign) {
      case "top":
        $elem.css({ top: 0 });
        break;
      case "center":
        $elem.css({ top: area.top });
        break;
      case "bottom":
        $elem.css({ bottom: 0 });
        break;
      default:
        $elem.css({ top: verticalAlign });
    }
    switch (horizontalAlign) {
      case "left":
        $elem.css({ left: 0 });
        break;
      case "center":
        $elem.css({ left: area.left });
        break;
      case "right":
        $elem.css({ right: 0 });
        break;
      default:
        $elem.css({ left: horizontalAlign });
    }
    $elem.trigger("resizePlayArea", [area]);
  }
  function resizePlayAreaWithCheck($elem, width, height, verticalAlign, horizontalAlign) {
    btGameNamespace.checkHScreen(function () {
      setTimeout(function () {
        resizePlayArea($elem, width, height, verticalAlign, horizontalAlign);
      }, 500);
    });
  }
  btGameNamespace.resizePlayArea = resizePlayAreaWithCheck;
}(btGame || (btGame = {})));

(function (btGameNamespace) {
  // 横竖屏检测
  function checkHScreen(callback, skipListener) {
    if (!skipListener) {
      window.addEventListener("orientationchange", function () {
        trigger(callback);
      });
      window.addEventListener("resize", function () {
        trigger(callback);
      });
    }
    trigger(callback);
  }
  function trigger(callback) {
    if (callback) {
      callback(window.innerWidth > window.innerHeight);
    }
  }
  btGameNamespace.checkHScreen = checkHScreen;
}(btGame || (btGame = {})));

(function (btGameNamespace) {
  // 只允许横屏/竖屏弹窗
  function OnlyHScreen(once, callback) {
    this.myCallback = callback;
    this.tipsCount = 0;
    btGameNamespace.checkHScreen(btGameNamespace.proxy(this.callback, this), false);
    if (once) {
      this.once = once;
    }
  }
  OnlyHScreen.prototype = {
    hscreen: function () {
      this.buildScreen();
      if (this.once && this.tipsCount <= 0) {
        if (this.screen) this.screen.show();
      } else if (!this.once) {
        if (this.screen) this.screen.show();
      }
      this.tipsCount++;
    },
    vscreen: function () {
      if (this.screen) this.screen.hide();
      if (this.myCallback) this.myCallback(this.tipsCount);
    },
    getScreenOption: function () {
      return {
        id: "bt-h-scrren",
        html: "<table><tr><td><img class='bt-h-screen-img' src='" + btGameNamespace.URL.root + "/common/bt-play-h-screen.png' /></td></tr></table>",
        time: 0,
        lockId: "bt-hide-lock"
      };
    },
    buildScreen: function () {
      if (!this.screen) {
        this.screen = btGameNamespace.advertisement(this.getScreenOption());
      }
    },
    callback: function (isHorizontal) {
      if (isHorizontal) {
        this.vscreen();
      } else {
        this.hscreen();
      }
    }
  };
  function OnlyVScreen(once, callback) {}
  OnlyVScreen.__super__ = OnlyHScreen;
  OnlyVScreen.prototype = $.extend({}, OnlyHScreen.prototype, {
    hscreen: function () {
      OnlyHScreen.prototype.vscreen.call(this);
    },
    vscreen: function () {
      OnlyHScreen.prototype.hscreen.call(this);
    },
    getScreenOption: function () {
      return {
        id: "bt-v-scrren",
        html: "<table><tr><td><img class='bt-v-screen-img' src='" + btGameNamespace.URL.root + "/common/bt-play-v-screen.png' /></td></tr></table>",
        time: 0,
        lockId: "bt-hide-lock"
      };
    }
  });
  btGameNamespace.onlyHScreen = function (once, callback) {
    return new OnlyHScreen(once, callback);
  };
  btGameNamespace.onlyVScreen = function (once, callback) {
    return new OnlyVScreen(once, callback);
  };
}(btGame || (btGame = {})));

(function (btGameNamespace) {
  // 播放logo广告（预留）
  function playLogoAdv() {}
  btGameNamespace.playLogoAdv = playLogoAdv;
}(btGame || (btGame = {})));

(function (btGameNamespace) {
  // 分享提示
  var shareTipId = "bt-play-share-tip";
  function playShareTip() {
    var shareTip = btGameNamespace.advertisement({
      id: shareTipId,
      html: "<img class='bt-play-share-tip-img' src='" + btGameNamespace.URL.root + "/common/bt-play-share-tip.png' />",
      time: 0
    });
    shareTip.show();
    setTimeout(function () {
      shareTip.elem.on("click touchstart", function () {
        shareTip.remove();
        shareTip = null;
        return false;
      });
    }, 500);
    btGameNamespace.dc("share");
  }
  btGameNamespace.playShareTip = playShareTip;
}(btGame || (btGame = {})));

(function (btGameNamespace) {
  // 分数分享提示
  function playScoreMsg(msg) {
    if (confirm(msg)) {
      btGameNamespace.playShareTip();
    }
  }
  btGameNamespace.playScoreMsg = playScoreMsg;
}(btGame || (btGame = {}));