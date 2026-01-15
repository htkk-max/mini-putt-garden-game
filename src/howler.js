(function() {
  var cache = {};
  /** @type {null} */
  var ctx = null;
  /** @type {boolean} */
  var usingWebAudio = true;
  /** @type {boolean} */
  var noAudio = false;
  if (typeof AudioContext !== "undefined") {
    ctx = new AudioContext;
  } else {
    if (typeof webkitAudioContext !== "undefined") {
      ctx = new webkitAudioContext;
    } else {
      if (typeof Audio !== "undefined") {
        /** @type {boolean} */
        usingWebAudio = false;
        try {
          new Audio;
        } catch (e) {
          /** @type {boolean} */
          noAudio = true;
        }
      } else {
        /** @type {boolean} */
        usingWebAudio = false;
        /** @type {boolean} */
        noAudio = true;
      }
    }
  }
  if (usingWebAudio) {
    var masterGain = typeof ctx.createGain === "undefined" ? ctx.createGainNode() : ctx.createGain();
    /** @type {number} */
    masterGain.gain.value = 1;
    masterGain.connect(ctx.destination);
  }
  /**
   * @return {undefined}
   */
  var HowlerGlobal = function() {
    /** @type {number} */
    this._volume = 1;
    /** @type {boolean} */
    this._muted = false;
    this.usingWebAudio = usingWebAudio;
    /** @type {Array} */
    this._howls = [];
  };
  HowlerGlobal.prototype = {
    /**
     * @param {number} vol
     * @return {?}
     */
    volume : function(vol) {
      var self = this;
      /** @type {number} */
      vol = parseFloat(vol);
      if (vol && (vol >= 0 && vol <= 1)) {
        /** @type {number} */
        self._volume = vol;
        if (usingWebAudio) {
          /** @type {number} */
          masterGain.gain.value = vol;
        }
        var key;
        for (key in self._howls) {
          if (self._howls.hasOwnProperty(key) && self._howls[key]._webAudio === false) {
            /** @type {number} */
            var i = 0;
            for (;i < self._howls[key]._audioNode.length;i++) {
              /** @type {number} */
              self._howls[key]._audioNode[i].volume = self._howls[key]._volume * self._volume;
            }
          }
        }
        return self;
      }
      return usingWebAudio ? masterGain.gain.value : self._volume;
    },
    /**
     * @return {?}
     */
    mute : function() {
      this._setMuted(true);
      return this;
    },
    /**
     * @return {?}
     */
    unmute : function() {
      this._setMuted(false);
      return this;
    },
    /**
     * @param {boolean} muted
     * @return {undefined}
     */
    _setMuted : function(muted) {
      var self = this;
      /** @type {boolean} */
      self._muted = muted;
      if (usingWebAudio) {
        masterGain.gain.value = muted ? 0 : self._volume;
      }
      var key;
      for (key in self._howls) {
        if (self._howls.hasOwnProperty(key) && self._howls[key]._webAudio === false) {
          /** @type {number} */
          var i = 0;
          for (;i < self._howls[key]._audioNode.length;i++) {
            /** @type {boolean} */
            self._howls[key]._audioNode[i].muted = muted;
          }
        }
      }
    }
  };
  var Howler = new HowlerGlobal;
  /** @type {null} */
  var audioTest = null;
  if (!noAudio) {
    audioTest = new Audio;
    var codecs = {
      mp3 : !!audioTest.canPlayType("audio/mpeg;").replace(/^no$/, ""),
      opus : !!audioTest.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ""),
      ogg : !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
      wav : !!audioTest.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ""),
      m4a : !!(audioTest.canPlayType("audio/x-m4a;") || audioTest.canPlayType("audio/aac;")).replace(/^no$/, ""),
      webm : !!audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, "")
    };
  }
  /**
   * @param {Object} o
   * @return {undefined}
   */
  var Howl = function(o) {
    var self = this;
    self._autoplay = o.autoplay || false;
    self._buffer = o.buffer || false;
    self._duration = o.duration || 0;
    self._format = o.format || null;
    self._loop = o.loop || false;
    /** @type {boolean} */
    self._loaded = false;
    self._sprite = o.sprite || {};
    self._src = o.src || "";
    self._pos3d = o.pos3d || [0, 0, -0.5];
    self._volume = o.volume || 1;
    self._urls = o.urls || [];
    self._rate = o.rate || 1;
    /** @type {Array} */
    self._onload = [o.onload || function() {
    }];
    /** @type {Array} */
    self._onloaderror = [o.onloaderror || function() {
    }];
    /** @type {Array} */
    self._onend = [o.onend || function() {
    }];
    /** @type {Array} */
    self._onpause = [o.onpause || function() {
    }];
    /** @type {Array} */
    self._onplay = [o.onplay || function() {
    }];
    /** @type {Array} */
    self._onendTimer = [];
    self._webAudio = usingWebAudio && !self._buffer;
    /** @type {Array} */
    self._audioNode = [];
    if (self._webAudio) {
      self._setupAudioNode();
    }
    Howler._howls.push(self);
    self.load();
  };
  Howl.prototype = {
    /**
     * @return {?}
     */
    load : function() {
      var self = this;
      /** @type {null} */
      var url = null;
      if (noAudio) {
        self.on("loaderror");
        return;
      }
      var canPlay = {
        mp3 : codecs.mp3,
        opus : codecs.opus,
        ogg : codecs.ogg,
        wav : codecs.wav,
        m4a : codecs.m4a,
        weba : codecs.webm
      };
      /** @type {number} */
      var i = 0;
      for (;i < self._urls.length;i++) {
        var ext;
        if (self._format) {
          ext = self._format;
        } else {
          ext = self._urls[i].toLowerCase().match(/.+\.([^?]+)(\?|$)/);
          ext = ext && ext.length >= 2 ? ext[1] : self._urls[i].toLowerCase().match(/data\:audio\/([^?]+);/)[1];
        }
        if (canPlay[ext]) {
          url = self._urls[i];
          break;
        }
      }
      if (!url) {
        self.on("loaderror");
        return;
      }
      self._src = url;
      if (self._webAudio) {
        loadBuffer(self, url);
      } else {
        var newNode = new Audio;
        self._audioNode.push(newNode);
        newNode.src = url;
        /** @type {number} */
        newNode._pos = 0;
        /** @type {string} */
        newNode.preload = "auto";
        /** @type {number} */
        newNode.volume = Howler._muted ? 0 : self._volume * Howler.volume();
        cache[url] = self;
        /**
         * @return {undefined}
         */
        var listener = function() {
          self._duration = newNode.duration;
          if (Object.getOwnPropertyNames(self._sprite).length === 0) {
            self._sprite = {
              _default : [0, self._duration * 1E3]
            };
          }
          if (!self._loaded) {
            /** @type {boolean} */
            self._loaded = true;
            self.on("load");
          }
          if (self._autoplay) {
            self.play();
          }
          newNode.removeEventListener("canplaythrough", listener, false);
        };
        newNode.addEventListener("canplaythrough", listener, false);
        newNode.load();
      }
      return self;
    },
    /**
     * @param {Array} urls
     * @return {?}
     */
    urls : function(urls) {
      var self = this;
      if (urls) {
        self.stop();
        self._urls = typeof urls === "string" ? [urls] : urls;
        /** @type {boolean} */
        self._loaded = false;
        self.load();
        return self;
      } else {
        return self._urls;
      }
    },
    /**
     * @param {string} sprite
     * @param {string} callback
     * @return {?}
     */
    play : function(sprite, callback) {
      var self = this;
      if (typeof sprite === "function") {
        /** @type {string} */
        callback = sprite;
      }
      if (!sprite || typeof sprite === "function") {
        /** @type {string} */
        sprite = "_default";
      }
      if (!self._loaded) {
        self.on("load", function() {
          self.play(sprite, callback);
        });
        return self;
      }
      if (!self._sprite[sprite]) {
        if (typeof callback === "function") {
          callback();
        }
        return self;
      }
      self._inactiveNode(function(node) {
        node._sprite = sprite;
        var pos = node._pos > 0 ? node._pos : self._sprite[sprite][0] / 1E3;
        /** @type {number} */
        var duration = self._sprite[sprite][1] / 1E3 - node._pos;
        /** @type {boolean} */
        var loop = !!(self._loop || self._sprite[sprite][2]);
        /** @type {string} */
        var soundId = typeof callback === "string" ? callback : Math.round(Date.now() * Math.random()) + "";
        var timerId;
        (function() {
          var data = {
            id : soundId,
            sprite : sprite,
            loop : loop
          };
          /** @type {number} */
          timerId = setTimeout(function() {
            if (!self._webAudio && loop) {
              self.stop(data.id, data.timer).play(sprite, data.id);
            }
            if (self._webAudio && !loop) {
              /** @type {boolean} */
              self._nodeById(data.id).paused = true;
            }
            if (!self._webAudio && !loop) {
              self.stop(data.id, data.timer);
            }
            self.on("end", soundId);
          }, duration * 1E3);
          self._onendTimer.push(timerId);
          data.timer = self._onendTimer[self._onendTimer.length - 1];
        })();
        if (self._webAudio) {
          /** @type {number} */
          var loopStart = self._sprite[sprite][0] / 1E3;
          /** @type {number} */
          var loopEnd = self._sprite[sprite][1] / 1E3;
          /** @type {string} */
          node.id = soundId;
          /** @type {boolean} */
          node.paused = false;
          refreshBuffer(self, [loop, loopStart, loopEnd], soundId);
          self._playStart = ctx.currentTime;
          node.gain.value = self._volume;
          if (typeof node.bufferSource.start === "undefined") {
            node.bufferSource.noteGrainOn(0, pos, duration);
          } else {
            node.bufferSource.start(0, pos, duration);
          }
        } else {
          if (node.readyState === 4) {
            /** @type {string} */
            node.id = soundId;
            node.currentTime = pos;
            node.muted = Howler._muted;
            /** @type {number} */
            node.volume = self._volume * Howler.volume();
            setTimeout(function() {
              node.play();
            }, 0);
          } else {
            self._clearEndTimer(timerId);
            (function() {
              var sound = self;
              var playSprite = sprite;
              var fn = callback;
              /** @type {Object} */
              var newNode = node;
              /**
               * @return {undefined}
               */
              var completed = function() {
                sound.play(playSprite, fn);
                newNode.removeEventListener("canplaythrough", completed, false);
              };
              newNode.addEventListener("canplaythrough", completed, false);
            })();
            return self;
          }
        }
        self.on("play");
        if (typeof callback === "function") {
          callback(soundId);
        }
        return self;
      });
      return self;
    },
    /**
     * @param {string} id
     * @param {number} timerId
     * @return {?}
     */
    pause : function(id, timerId) {
      var self = this;
      if (!self._loaded) {
        self.on("play", function() {
          self.pause(id);
        });
        return self;
      }
      self._clearEndTimer(timerId || 0);
      var activeNode = id ? self._nodeById(id) : self._activeNode();
      if (activeNode) {
        activeNode._pos = self.pos(null, id);
        if (self._webAudio) {
          if (!activeNode.bufferSource) {
            return self;
          }
          /** @type {boolean} */
          activeNode.paused = true;
          if (typeof activeNode.bufferSource.stop === "undefined") {
            activeNode.bufferSource.noteOff(0);
          } else {
            activeNode.bufferSource.stop(0);
          }
        } else {
          activeNode.pause();
        }
      }
      self.on("pause");
      return self;
    },
    /**
     * @param {(number|string)} id
     * @param {number} timerId
     * @return {?}
     */
    stop : function(id, timerId) {
      var self = this;
      if (!self._loaded) {
        self.on("play", function() {
          self.stop(id);
        });
        return self;
      }
      self._clearEndTimer(timerId || 0);
      var activeNode = id ? self._nodeById(id) : self._activeNode();
      if (activeNode) {
        /** @type {number} */
        activeNode._pos = 0;
        if (self._webAudio) {
          if (!activeNode.bufferSource) {
            return self;
          }
          /** @type {boolean} */
          activeNode.paused = true;
          if (typeof activeNode.bufferSource.stop === "undefined") {
            activeNode.bufferSource.noteOff(0);
          } else {
            activeNode.bufferSource.stop(0);
          }
        } else {
          activeNode.pause();
          /** @type {number} */
          activeNode.currentTime = 0;
        }
      }
      return self;
    },
    /**
     * @param {string} id
     * @return {?}
     */
    mute : function(id) {
      var self = this;
      if (!self._loaded) {
        self.on("play", function() {
          self.mute(id);
        });
        return self;
      }
      var activeNode = id ? self._nodeById(id) : self._activeNode();
      if (activeNode) {
        if (self._webAudio) {
          /** @type {number} */
          activeNode.gain.value = 0;
        } else {
          /** @type {number} */
          activeNode.volume = 0;
        }
      }
      return self;
    },
    /**
     * @param {string} id
     * @return {?}
     */
    unmute : function(id) {
      var self = this;
      if (!self._loaded) {
        self.on("play", function() {
          self.unmute(id);
        });
        return self;
      }
      var activeNode = id ? self._nodeById(id) : self._activeNode();
      if (activeNode) {
        if (self._webAudio) {
          activeNode.gain.value = self._volume;
        } else {
          activeNode.volume = self._volume;
        }
      }
      return self;
    },
    /**
     * @param {number} vol
     * @param {string} id
     * @return {?}
     */
    volume : function(vol, id) {
      var self = this;
      /** @type {number} */
      vol = parseFloat(vol);
      if (vol >= 0 && vol <= 1) {
        /** @type {number} */
        self._volume = vol;
        if (!self._loaded) {
          self.on("play", function() {
            self.volume(vol, id);
          });
          return self;
        }
        var activeNode = id ? self._nodeById(id) : self._activeNode();
        if (activeNode) {
          if (self._webAudio) {
            /** @type {number} */
            activeNode.gain.value = vol;
          } else {
            /** @type {number} */
            activeNode.volume = vol * Howler.volume();
          }
        }
        return self;
      } else {
        return self._volume;
      }
    },
    /**
     * @param {boolean} loop
     * @return {?}
     */
    loop : function(loop) {
      var self = this;
      if (typeof loop === "boolean") {
        /** @type {boolean} */
        self._loop = loop;
        return self;
      } else {
        return self._loop;
      }
    },
    /**
     * @param {Object} sprite
     * @return {?}
     */
    sprite : function(sprite) {
      var self = this;
      if (typeof sprite === "object") {
        /** @type {Object} */
        self._sprite = sprite;
        return self;
      } else {
        return self._sprite;
      }
    },
    /**
     * @param {number} pos
     * @param {string} id
     * @return {?}
     */
    pos : function(pos, id) {
      var self = this;
      if (!self._loaded) {
        self.on("load", function() {
          self.pos(pos);
        });
        return typeof pos === "number" ? self : self._pos || 0;
      }
      /** @type {number} */
      pos = parseFloat(pos);
      var activeNode = id ? self._nodeById(id) : self._activeNode();
      if (activeNode) {
        if (self._webAudio) {
          if (pos >= 0) {
            /** @type {number} */
            activeNode._pos = pos;
            self.pause(id).play(activeNode._sprite, id);
            return self;
          } else {
            return activeNode._pos + (ctx.currentTime - self._playStart);
          }
        } else {
          if (pos >= 0) {
            /** @type {number} */
            activeNode.currentTime = pos;
            return self;
          } else {
            return activeNode.currentTime;
          }
        }
      } else {
        if (pos >= 0) {
          return self;
        } else {
          /** @type {number} */
          var i = 0;
          for (;i < self._audioNode.length;i++) {
            if (self._audioNode[i].paused && self._audioNode[i].readyState === 4) {
              return self._webAudio ? self._audioNode[i]._pos : self._audioNode[i].currentTime;
            }
          }
        }
      }
    },
    /**
     * @param {number} x
     * @param {Object} y
     * @param {number} z
     * @param {string} id
     * @return {?}
     */
    pos3d : function(x, y, z, id) {
      var self = this;
      y = typeof y === "undefined" || !y ? 0 : y;
      z = typeof z === "undefined" || !z ? -0.5 : z;
      if (!self._loaded) {
        self.on("play", function() {
          self.pos3d(x, y, z, id);
        });
        return self;
      }
      if (x >= 0 || x < 0) {
        if (self._webAudio) {
          var activeNode = id ? self._nodeById(id) : self._activeNode();
          if (activeNode) {
            /** @type {Array} */
            self._pos3d = [x, y, z];
            activeNode.panner.setPosition(x, y, z);
          }
        }
      } else {
        return self._pos3d;
      }
      return self;
    },
    /**
     * @param {number} from
     * @param {number} to
     * @param {number} len
     * @param {?} callback
     * @param {string} id
     * @return {?}
     */
    fade : function(from, to, len, callback, id) {
      var self = this;
      /** @type {number} */
      var dist = Math.abs(from - to);
      /** @type {string} */
      var dir = from > to ? "down" : "up";
      /** @type {number} */
      var iterations = dist / 0.01;
      /** @type {number} */
      var hold = len / iterations;
      if (!self._loaded) {
        self.on("load", function() {
          self.fade(from, to, len, callback, id);
        });
        return self;
      }
      self.volume(from, id);
      /** @type {number} */
      var i = 1;
      for (;i <= iterations;i++) {
        (function() {
          var change = self._volume + (dir === "up" ? 0.01 : -0.01) * i;
          /** @type {number} */
          var vol = Math.round(1E3 * change) / 1E3;
          /** @type {number} */
          var toVol = to;
          setTimeout(function() {
            self.volume(vol, id);
            if (vol === toVol) {
              if (callback) {
                callback();
              }
            }
          }, hold * i);
        })();
      }
    },
    /**
     * @param {number} to
     * @param {number} len
     * @param {?} callback
     * @return {?}
     */
    fadeIn : function(to, len, callback) {
      return this.volume(0).play().fade(0, to, len, callback);
    },
    /**
     * @param {number} to
     * @param {number} len
     * @param {?} callback
     * @param {string} id
     * @return {?}
     */
    fadeOut : function(to, len, callback, id) {
      var self = this;
      return self.fade(self._volume, to, len, function() {
        if (callback) {
          callback();
        }
        self.pause(id);
        self.on("end");
      }, id);
    },
    /**
     * @param {string} timer
     * @return {?}
     */
    _nodeById : function(timer) {
      var self = this;
      var node = self._audioNode[0];
      /** @type {number} */
      var i = 0;
      for (;i < self._audioNode.length;i++) {
        if (self._audioNode[i].id === timer) {
          node = self._audioNode[i];
          break;
        }
      }
      return node;
    },
    /**
     * @return {?}
     */
    _activeNode : function() {
      var self = this;
      /** @type {null} */
      var node = null;
      /** @type {number} */
      var i = 0;
      for (;i < self._audioNode.length;i++) {
        if (!self._audioNode[i].paused) {
          node = self._audioNode[i];
          break;
        }
      }
      self._drainPool();
      return node;
    },
    /**
     * @param {Function} callback
     * @return {undefined}
     */
    _inactiveNode : function(callback) {
      var self = this;
      /** @type {null} */
      var node = null;
      /** @type {number} */
      var i = 0;
      for (;i < self._audioNode.length;i++) {
        if (self._audioNode[i].paused && self._audioNode[i].readyState === 4) {
          callback(self._audioNode[i]);
          /** @type {boolean} */
          node = true;
          break;
        }
      }
      self._drainPool();
      if (node) {
        return;
      }
      var newNode;
      if (self._webAudio) {
        newNode = self._setupAudioNode();
        callback(newNode);
      } else {
        self.load();
        newNode = self._audioNode[self._audioNode.length - 1];
        newNode.addEventListener("loadedmetadata", function() {
          callback(newNode);
        });
      }
    },
    /**
     * @return {undefined}
     */
    _drainPool : function() {
      var self = this;
      /** @type {number} */
      var inactive = 0;
      var i;
      /** @type {number} */
      i = 0;
      for (;i < self._audioNode.length;i++) {
        if (self._audioNode[i].paused) {
          inactive++;
        }
      }
      /** @type {number} */
      i = self._audioNode.length - 1;
      for (;i >= 0;i--) {
        if (inactive <= 5) {
          break;
        }
        if (self._audioNode[i].paused) {
          if (self._webAudio) {
            self._audioNode[i].disconnect(0);
          }
          inactive--;
          self._audioNode.splice(i, 1);
        }
      }
    },
    /**
     * @param {number} timerId
     * @return {undefined}
     */
    _clearEndTimer : function(timerId) {
      var self = this;
      var timer = self._onendTimer.indexOf(timerId);
      timer = timer >= 0 ? timer : 0;
      if (self._onendTimer[timer]) {
        clearTimeout(self._onendTimer[timer]);
        self._onendTimer.splice(timer, 1);
      }
    },
    /**
     * @return {?}
     */
    _setupAudioNode : function() {
      var self = this;
      var node = self._audioNode;
      var index = self._audioNode.length;
      node[index] = typeof ctx.createGain === "undefined" ? ctx.createGainNode() : ctx.createGain();
      node[index].gain.value = self._volume;
      /** @type {boolean} */
      node[index].paused = true;
      /** @type {number} */
      node[index]._pos = 0;
      /** @type {number} */
      node[index].readyState = 4;
      node[index].connect(masterGain);
      node[index].panner = ctx.createPanner();
      node[index].panner.setPosition(self._pos3d[0], self._pos3d[1], self._pos3d[2]);
      node[index].panner.connect(node[index]);
      return node[index];
    },
    /**
     * @param {string} event
     * @param {Function} fn
     * @return {?}
     */
    on : function(event, fn) {
      var self = this;
      var events = self["_on" + event];
      if (typeof fn === "function") {
        events.push(fn);
      } else {
        /** @type {number} */
        var i = 0;
        for (;i < events.length;i++) {
          if (fn) {
            events[i].call(self, fn);
          } else {
            events[i].call(self);
          }
        }
      }
      return self;
    },
    /**
     * @param {string} event
     * @param {?} fn
     * @return {?}
     */
    off : function(event, fn) {
      var self = this;
      var events = self["_on" + event];
      var fnString = fn.toString();
      /** @type {number} */
      var i = 0;
      for (;i < events.length;i++) {
        if (fnString === events[i].toString()) {
          events.splice(i, 1);
          break;
        }
      }
      return self;
    },
    /**
     * @return {undefined}
     */
    unload : function() {
      var self = this;
      var nodes = self._audioNode;
      /** @type {number} */
      var i = 0;
      for (;i < self._audioNode.length;i++) {
        self.stop(nodes[i].id);
        if (!self._webAudio) {
          /** @type {string} */
          nodes[i].src = "";
        } else {
          nodes[i].disconnect(0);
        }
      }
      var index = Howler._howls.indexOf(self);
      if (index) {
        Howler._howls.splice(index, 1);
      }
      delete cache[self._src];
      /** @type {null} */
      self = null;
    }
  };
  if (usingWebAudio) {
    /**
     * @param {Object} obj
     * @param {Array} url
     * @return {undefined}
     */
    var loadBuffer = function(obj, url) {
      if (url in cache) {
        obj._duration = cache[url].duration;
        loadSound(obj);
      } else {
        /** @type {XMLHttpRequest} */
        var xhr = new XMLHttpRequest;
        xhr.open("GET", url, true);
        /** @type {string} */
        xhr.responseType = "arraybuffer";
        /**
         * @return {undefined}
         */
        xhr.onload = function() {
          ctx.decodeAudioData(xhr.response, function(buffer) {
            if (buffer) {
              /** @type {Object} */
              cache[url] = buffer;
              loadSound(obj, buffer);
            }
          });
        };
        /**
         * @return {undefined}
         */
        xhr.onerror = function() {
          if (obj._webAudio) {
            /** @type {boolean} */
            obj._buffer = true;
            /** @type {boolean} */
            obj._webAudio = false;
            /** @type {Array} */
            obj._audioNode = [];
            delete obj._gainNode;
            obj.load();
          }
        };
        try {
          xhr.send();
        } catch (e) {
          xhr.onerror();
        }
      }
    };
    /**
     * @param {Object} obj
     * @param {Object} buffer
     * @return {undefined}
     */
    var loadSound = function(obj, buffer) {
      obj._duration = buffer ? buffer.duration : obj._duration;
      if (Object.getOwnPropertyNames(obj._sprite).length === 0) {
        obj._sprite = {
          _default : [0, obj._duration * 1E3]
        };
      }
      if (!obj._loaded) {
        /** @type {boolean} */
        obj._loaded = true;
        obj.on("load");
      }
      if (obj._autoplay) {
        obj.play();
      }
    };
    /**
     * @param {Object} obj
     * @param {Array} loop
     * @param {string} id
     * @return {undefined}
     */
    var refreshBuffer = function(obj, loop, id) {
      var node = obj._nodeById(id);
      node.bufferSource = ctx.createBufferSource();
      node.bufferSource.buffer = cache[obj._src];
      node.bufferSource.connect(node.panner);
      node.bufferSource.loop = loop[0];
      if (loop[0]) {
        node.bufferSource.loopStart = loop[1];
        node.bufferSource.loopEnd = loop[1] + loop[2];
      }
      node.bufferSource.playbackRate.value = obj._rate;
    };
  }
  if (typeof define === "function" && define.amd) {
    define(function() {
      return{
        Howler : Howler,
        /** @type {function (Object): undefined} */
        Howl : Howl
      };
    });
  }
  window.Howler = Howler;
  /** @type {function (Object): undefined} */
  window.Howl = Howl;
})();

