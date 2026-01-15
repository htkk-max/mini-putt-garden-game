var viewporter;
(function() {
  var _viewporter;
  viewporter = {
    forceDetection : false,
    disableLegacyAndroid : true,
    /**
     * @return {?}
     */
    ACTIVE : function() {
      if (viewporter.disableLegacyAndroid && /android 2/i.test(navigator.userAgent)) {
      }
      if (/ipad/i.test(navigator.userAgent)) {
        return false;
      }
      if (/webos/i.test(navigator.userAgent)) {
        return true;
      }
      if ("ontouchstart" in window) {
        return true;
      }
      return false;
    },
    READY : false,
    /**
     * @return {?}
     */
    isLandscape : function() {
      return window.orientation === 90 || window.orientation === -90;
    },
    /**
     * @param {?} completed
     * @return {undefined}
     */
    ready : function(completed) {
      window.addEventListener("viewportready", completed, false);
    },
    /**
     * @param {?} completed
     * @return {undefined}
     */
    change : function(completed) {
      window.addEventListener("viewportchange", completed, false);
    },
    /**
     * @return {undefined}
     */
    refresh : function() {
      if (_viewporter) {
        _viewporter.prepareVisualViewport();
      }
    },
    /**
     * @return {undefined}
     */
    preventPageScroll : function() {
      document.body.addEventListener("touchmove", function(types) {
        types.preventDefault();
      }, false);
      document.body.addEventListener("touchstart", function() {
        _viewporter.prepareVisualViewport();
      }, false);
    }
  };
  viewporter.ACTIVE = viewporter.ACTIVE();
  if (!viewporter.ACTIVE) {
    return;
  }
  /**
   * @return {undefined}
   */
  var _Viewporter = function() {
    var that = this;
    /** @type {boolean} */
    this.IS_ANDROID = /Android/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    /**
     * @return {undefined}
     */
    var _onReady = function() {
      that.prepareVisualViewport();
      /** @type {number} */
      var orientation = window.orientation;
      window.addEventListener("orientationchange", function() {
        if (window.orientation !== orientation) {
          that.prepareVisualViewport();
          /** @type {number} */
          orientation = window.orientation;
        }
      }, false);
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function() {
        _onReady();
      }, false);
    } else {
      _onReady();
    }
  };
  _Viewporter.prototype = {
    /**
     * @return {?}
     */
    getProfile : function() {
      if (viewporter.forceDetection) {
        return null;
      }
      var searchTerm;
      for (searchTerm in viewporter.profiles) {
        if ((new RegExp(searchTerm)).test(navigator.userAgent)) {
          return viewporter.profiles[searchTerm];
        }
      }
      return null;
    },
    /**
     * @return {undefined}
     */
    postProcess : function() {
      /** @type {boolean} */
      viewporter.READY = true;
      this.triggerWindowEvent(!this._firstUpdateExecuted ? "viewportready" : "viewportchange");
      /** @type {boolean} */
      this._firstUpdateExecuted = true;
    },
    /**
     * @return {?}
     */
    prepareVisualViewport : function() {
      var that = this;
      if (navigator.standalone) {
        return this.postProcess();
      }
      /** @type {string} */
      document.documentElement.style.minHeight = "5000px";
      /** @type {number} */
      var startHeight = window.innerHeight;
      var deviceProfile = this.getProfile();
      /** @type {string} */
      var orientation = viewporter.isLandscape() ? "landscape" : "portrait";
      window.scrollTo(0, that.IS_ANDROID ? 1 : 0);
      /** @type {number} */
      var iterations = 40;
      /** @type {number} */
      var scrollIntervalId = window.setInterval(function() {
        /**
         * @return {?}
         */
        function androidProfileCheck() {
          return deviceProfile ? window.innerHeight === deviceProfile[orientation] : false;
        }
        /**
         * @return {?}
         */
        function iosInnerHeightCheck() {
          return window.innerHeight > startHeight;
        }
        window.scrollTo(0, that.IS_ANDROID ? 1 : 0);
        iterations--;
        if ((that.IS_ANDROID ? androidProfileCheck() : iosInnerHeightCheck()) || iterations < 0) {
          /** @type {string} */
          document.documentElement.style.minHeight = window.innerHeight + "px";
          /** @type {string} */
          document.getElementById("viewporter").style.position = "relative";
          /** @type {string} */
          document.getElementById("viewporter").style.height = window.innerHeight + "px";
          clearInterval(scrollIntervalId);
          that.postProcess();
        }
      }, 10);
    },
    /**
     * @param {string} name
     * @return {undefined}
     */
    triggerWindowEvent : function(name) {
      /** @type {(Event|null)} */
      var e = document.createEvent("Event");
      e.initEvent(name, false, false);
      window.dispatchEvent(e);
    }
  };
  _viewporter = new _Viewporter;
})();
viewporter.profiles = {
  "MZ601" : {
    portrait : 696,
    landscape : 1176
  },
  "GT-I9000|GT-I9100|Nexus S" : {
    portrait : 508,
    landscape : 295
  },
  "GT-P1000" : {
    portrait : 657,
    landscape : 400
  },
  "Desire_A8181|DesireHD_A9191" : {
    portrait : 533,
    landscape : 320
  }
};

