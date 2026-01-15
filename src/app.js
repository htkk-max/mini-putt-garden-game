/**
 * @return {undefined}
 */
function initSplash() {
  /** @type {string} */
  gameState = "splash";
  resizeCanvas();
  if (!(1 != audioType)) {
    if (!muted) {
      music.play();
    }
  }
  initStartScreen();
}
/**
 * @return {undefined}
 */
function initStartScreen() {
  /** @type {string} */
  gameState = "start";
  userInput.removeHitArea("moreGames");
  if (1 == audioType) {
    if (musicTween) {
      musicTween.kill();
    }
    musicTween = TweenLite.to(music, 1, {
      volume : 0.5,
      ease : "Linear.easeNone"
    });
  }
  background = new Elements.Background(assetLib.getData("background"), canvas.width, canvas.height);
  userInput.addHitArea("mute", butEventHandler, null, "rect", {
    aRect : [538, 0, canvas.width, 60]
  }, true);
  var name = {
    oImgData : assetLib.getData("uiButs"),
    aPos : [canvas.width / 2 + 4, 610],
    scale : 1,
    frame : 0
  };
  var value = {
    oImgData : assetLib.getData("uiButs"),
    aPos : [canvas.width / 2 + 4, 735],
    scale : 1,
    frame : 2
  };
  userInput.addHitArea("selectCourse", butEventHandler, null, "image", name);
  userInput.addHitArea("moreGames", butEventHandler, null, "image", value);
  /** @type {Array} */
  var node = new Array(name, value);
  panel = new Elements.Panel(assetLib.getData("panels1"), assetLib.getData("panels2"), assetLib.getData("bigNumbersDark"), assetLib.getData("smallNumbers"), gameState, node, canvas.width, canvas.height);
  panel.startTween1();
  /** @type {number} */
  previousTime = (new Date).getTime();
  /** @type {Array} */
  aPickUps = new Array;
  /** @type {number} */
  var e = 0;
  /** @type {number} */
  var f = 0;
  for (;10 > f;f++) {
    var copies = new Elements.FallingGem(assetLib.getData("pickUps"), {
      x : Math.random() * canvas.width,
      y : Math.random() * canvas.height,
      id : ++e % 5
    }, canvas.width, canvas.height);
    aPickUps.push(copies);
  }
  updateStartScreenEvent();
}
/**
 * @return {undefined}
 */
function initCreditsScreen() {
  /** @type {string} */
  gameState = "credits";
  var state = {
    oImgData : assetLib.getData("uiButs"),
    aPos : [104, 735],
    scale : 1,
    frame : 4
  };
  userInput.addHitArea("backFromCredits", butEventHandler, null, "image", state);
  /** @type {Array} */
  var stack = new Array(state);
  panel = new Elements.Panel(assetLib.getData("panels1"), assetLib.getData("panels2"), assetLib.getData("bigNumbersDark"), assetLib.getData("smallNumbers"), gameState, stack, canvas.width, canvas.height);
  panel.startTween2();
  /** @type {number} */
  previousTime = (new Date).getTime();
  updateCreditsScreenEvent();
}
/**
 * @return {undefined}
 */
function initCourseSelectScreen() {
  /** @type {string} */
  gameState = "courseSelect";
  /** @type {number} */
  levelScore = 0;
  /** @type {number} */
  totalScore = 0;
  /** @type {number} */
  levelNum = 0;
  var state = {
    oImgData : assetLib.getData("uiButs"),
    aPos : [104, 735],
    scale : 1,
    frame : 4
  };
  var y = {
    oImgData : assetLib.getData("uiButs"),
    aPos : [460, 300],
    scale : 1,
    frame : 0
  };
  var data = {
    oImgData : assetLib.getData("uiButs"),
    aPos : [460, 553],
    scale : 1,
    frame : 0
  };
  userInput.addHitArea("backFromCourseSelect", butEventHandler, null, "image", state);
  userInput.addHitArea("startGame", butEventHandler, {
    courseNum : 0
  }, "image", y);
  userInput.addHitArea("startGame", butEventHandler, {
    courseNum : 1
  }, "image", data);
  /** @type {Array} */
  var a = new Array(state, y, data);
  panel = new Elements.Panel(assetLib.getData("panels1"), assetLib.getData("panels2"), assetLib.getData("bigNumbersDark"), assetLib.getData("smallNumbers"), gameState, a, canvas.width, canvas.height);
  panel.aLevelStore = saveDataHandler.aLevelStore;
  panel.startTween1();
  /** @type {Array} */
  aPickUps = new Array;
  /** @type {number} */
  var e = 0;
  /** @type {number} */
  var f = 0;
  for (;10 > f;f++) {
    var copies = new Elements.FallingGem(assetLib.getData("pickUps"), {
      x : Math.random() * canvas.width,
      y : Math.random() * canvas.height,
      id : ++e % 5
    }, canvas.width, canvas.height);
    aPickUps.push(copies);
  }
  /** @type {number} */
  previousTime = (new Date).getTime();
  updateCourseSelectScreenEvent();
}
/**
 * @return {undefined}
 */
function initGame() {
  /** @type {string} */
  gameState = "game";
  if (1 == audioType) {
    musicTween.kill();
    musicTween = TweenLite.to(music, 2, {
      volume : 0,
      ease : "Linear.easeNone"
    });
  }
  userInput.addHitArea("pause", butEventHandler, null, "rect", {
    aRect : [480, 0, 538, 60]
  }, true);
  userInput.addHitArea("gameTouch", butEventHandler, {
    isDraggable : true,
    multiTouch : true
  }, "rect", {
    aRect : [0, 0, canvas.width, canvas.height]
  }, true);
  hud = new Elements.Hud(assetLib.getData("hud"), assetLib.getData("bigNumbersLight"), assetLib.getData("bigNumbersDark"), assetLib.getData("smallNumbers"), {
    hole : levelNum + 1,
    par : aLevelData[courseNum][levelNum].par,
    shotNum : 1,
    pickUps : 0
  }, canvas.width, canvas.height);
  /** @type {Array} */
  var r = new Array;
  /** @type {Array} */
  var contents = new Array;
  /** @type {Array} */
  aPickUps = new Array;
  /** @type {Array} */
  aBounces = new Array;
  /** @type {number} */
  var c = 0;
  /** @type {number} */
  var i = 0;
  for (;i < aLevelData[courseNum][levelNum].aData.length;i++) {
    if ("tee" == aLevelData[courseNum][levelNum].aData[i].type) {
      ball = new Elements.Ball(assetLib.getData("ball"), assetLib.getData("remarks"), {
        x : aLevelData[courseNum][levelNum].aData[i].p0.x,
        y : aLevelData[courseNum][levelNum].aData[i].p0.y
      }, ballCallback, canvas.width, canvas.height);
    } else {
      if ("hole" == aLevelData[courseNum][levelNum].aData[i].type) {
        oHolePos = {
          x : aLevelData[courseNum][levelNum].aData[i].p0.x,
          y : aLevelData[courseNum][levelNum].aData[i].p0.y
        };
      } else {
        if ("pickUp" == aLevelData[courseNum][levelNum].aData[i].type) {
          var copies = new Elements.PickUp(assetLib.getData("pickUps"), {
            x : aLevelData[courseNum][levelNum].aData[i].p0.x,
            y : aLevelData[courseNum][levelNum].aData[i].p0.y,
            id : ++c % 5
          }, canvas.width, canvas.height);
          aPickUps.push(copies);
        } else {
          if ("wall" == aLevelData[courseNum][levelNum].aData[i].type) {
            r.push({
              p0 : aLevelData[courseNum][levelNum].aData[i].p0,
              p1 : aLevelData[courseNum][levelNum].aData[i].p1,
              b : 1,
              f : 1
            });
          } else {
            if ("slope" == aLevelData[courseNum][levelNum].aData[i].type.slice(0, 5)) {
              contents.push({
                type : "slope",
                dir : parseInt(aLevelData[courseNum][levelNum].aData[i].type.slice(-1)),
                p0 : aLevelData[courseNum][levelNum].aData[i].p0,
                p1 : aLevelData[courseNum][levelNum].aData[i].p1
              });
            } else {
              if ("mud" == aLevelData[courseNum][levelNum].aData[i].type) {
                contents.push({
                  type : "mud",
                  p0 : aLevelData[courseNum][levelNum].aData[i].p0,
                  p1 : aLevelData[courseNum][levelNum].aData[i].p1
                });
              } else {
                if ("water" == aLevelData[courseNum][levelNum].aData[i].type) {
                  contents.push({
                    type : "water",
                    p0 : aLevelData[courseNum][levelNum].aData[i].p0,
                    p1 : aLevelData[courseNum][levelNum].aData[i].p1
                  });
                } else {
                  if ("teleport" == aLevelData[courseNum][levelNum].aData[i].type) {
                    contents.push({
                      type : "teleport",
                      p0 : aLevelData[courseNum][levelNum].aData[i].p0,
                      p1 : aLevelData[courseNum][levelNum].aData[i].p1
                    });
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  /** @type {Array} */
  ball.aSurfaces = contents;
  oPosData = {
    prevBallX : ball.oData.x,
    prevBallY : ball.oData.y,
    stageX : -(levelWidth - canvas.width) / 2,
    stageY : -(levelHeight - canvas.height) / 2,
    targStageX : -(levelWidth - canvas.width) / 2,
    targStageY : -(levelHeight - canvas.height) / 2,
    startDragX : 0,
    startDragY : 0,
    startStageX : 0,
    startStageY : 0
  };
  /** @type {number} */
  gameTouchState = 0;
  level = new Elements.Level(assetLib.getData("level" + courseNum + levelNum), canvas.width, canvas.height);
  arrow = new Elements.Arrow(assetLib.getData("arrow"), canvas.width, canvas.height);
  physics2D = new Utils.Physics2D(r, ball);
  playSound("start");
  /** @type {number} */
  previousTime = (new Date).getTime();
  updateGameEvent();
}
/**
 * @param {?} dataAndEvents
 * @param {Object} details
 * @return {?}
 */
function butEventHandler(dataAndEvents, details) {
  switch(dataAndEvents) {
    case "langSelect":
      console.log(details.lang);
      curLang = details.lang;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      userInput.removeHitArea("langSelect");
      initLoadAssets();
      break;
    case "selectCourse":
      playSound("click");
      userInput.removeHitArea("selectCourse");
      userInput.removeHitArea("moreGames");
      userInput.removeHitArea("credits");
      initCourseSelectScreen();
      break;
    case "backFromCourseSelect":
      playSound("click");
      userInput.removeHitArea("backFromCourseSelect");
      userInput.removeHitArea("startGame");
      initStartScreen();
      break;
    case "startGame":
      playSound("click");
      userInput.removeHitArea("backFromCourseSelect");
      userInput.removeHitArea("startGame");
      courseNum = details.courseNum;
      /** @type {Array} */
      aScores = new Array;
      /** @type {number} */
      var conditionIndex = 0;
      for (;conditionIndex < aLevelData[courseNum].length;conditionIndex++) {
        aScores[conditionIndex] = {};
        aScores[conditionIndex].par = aLevelData[courseNum][conditionIndex].par;
        /** @type {number} */
        aScores[conditionIndex].shotNum = 0;
        /** @type {number} */
        aScores[conditionIndex].pickUps = 0;
      }
      initGame();
      break;
    case "credits":
      playSound("click");
      userInput.removeHitArea("selectCourse");
      userInput.removeHitArea("moreGames");
      userInput.removeHitArea("credits");
      initCreditsScreen();
      break;
    case "backFromCredits":
      playSound("click");
      userInput.removeHitArea("backFromCredits");
      initStartScreen();
      break;
    case "moreGames":
    ;
    case "moreGamesPause":
      window.top.location.href = Play68.goHome();
      break;
    case "gameTouch":
      if (gameTouchState >= 3) {
        return;
      }
      if (details.isBeingDragged) {
        if (2 == gameTouchState) {
          targAimX = details.x;
          targAimY = details.y;
        }
      } else {
        if (details.isDown) {
          TweenLite.killTweensOf(oPosData);
          toggleHudButs(false);
          if (details.x < ball.x + 40) {
            if (details.x > ball.x - 40) {
              if (details.y < ball.y + 40) {
                if (details.y > ball.y - 40) {
                  /** @type {number} */
                  gameTouchState = 2;
                  aimX = targAimX = details.x;
                  aimY = targAimY = details.y;
                  ball.changeState("aiming");
                }
              }
            }
          }
        } else {
          if (toggleHudButs(true), 2 == gameTouchState && arrow.scaleX > 0.05) {
            return gameTouchState = 3, ball.changeState("moving", {
              power : arrow.hyp,
              angle : arrow.rotation
            }), aimX = targAimX = null, aimY = targAimY = null, playSound("hit"), void 0;
          }
          /** @type {number} */
          gameTouchState = 0;
          if ("waiting" != ball.state) {
            ball.changeState("waiting");
          }
        }
      }
      break;
    case "nextLevel":
      /** @type {boolean} */
      window.shareFlag = false;
      playSound("click");
      userInput.removeHitArea("nextLevel");
      userInput.removeHitArea("moreGames");
      userInput.removeHitArea("exitFromEnd");
      /** @type {number} */
      levelScore = 0;
      if (++levelNum < 9) {
        initGame();
      } else {
        /** @type {number} */
        totalScore = 0;
        /** @type {number} */
        levelNum = 0;
        initCourseSelectScreen();
      }
      break;
    case "exitFromEnd":
      playSound("click");
      userInput.removeHitArea("nextLevel");
      userInput.removeHitArea("moreGames");
      userInput.removeHitArea("exitFromEnd");
      initCourseSelectScreen();
      break;
    case "mute":
      playSound("click");
      toggleMute();
      break;
    case "pause":
    ;
    case "resumeFromPause":
      playSound("click");
      toggleManualPause();
      break;
    case "quitFromPause":
      playSound("click");
      toggleManualPause();
      userInput.removeHitArea("pause");
      userInput.removeHitArea("quitFromPause");
      userInput.removeHitArea("resumeFromPause");
      userInput.removeHitArea("moreGamesPause");
      /** @type {number} */
      levelScore = 0;
      /** @type {number} */
      totalScore = 0;
      initStartScreen();
  }
}
/**
 * @return {undefined}
 */
function initLevelComplete() {
  /** @type {string} */
  gameState = "levelComplete";
  if (1 == audioType) {
    musicTween.kill();
    musicTween = TweenLite.to(music, 0.5, {
      volume : 0.5,
      ease : "Linear.easeNone"
    });
  }
  userInput.removeHitArea("gameTouch");
  userInput.removeHitArea("pause");
  var state = {
    oImgData : assetLib.getData("uiButs"),
    aPos : [504, 735],
    scale : 1,
    frame : 2
  };
  var y = {
    oImgData : assetLib.getData("uiButs"),
    aPos : [canvas.width / 2 + 4, 610],
    scale : 1,
    frame : 0
  };
  var data = {
    oImgData : assetLib.getData("uiButs"),
    aPos : [104, 735],
    scale : 1,
    frame : 4
  };
  userInput.addHitArea("moreGames", butEventHandler, null, "image", state);
  userInput.addHitArea("nextLevel", butEventHandler, null, "image", y);
  userInput.addHitArea("exitFromEnd", butEventHandler, null, "image", data);
  /** @type {Array} */
  var a = new Array(state, y, data);
  panel = new Elements.Panel(assetLib.getData("panels1"), assetLib.getData("panels2"), assetLib.getData("bigNumbersDark"), assetLib.getData("smallNumbers"), gameState, a, canvas.width, canvas.height);
  panel.startTween1();
  /** @type {Array} */
  aPickUps = new Array;
  /** @type {number} */
  var e = 0;
  /** @type {number} */
  var f = 0;
  for (;10 > f;f++) {
    var copies = new Elements.FallingGem(assetLib.getData("pickUps"), {
      x : Math.random() * canvas.width,
      y : Math.random() * canvas.height,
      id : ++e % 5
    }, canvas.width, canvas.height);
    aPickUps.push(copies);
  }
  aScores[levelNum].shotNum = hud.oLevelData.shotNum;
  aScores[levelNum].pickUps = hud.oLevelData.pickUps;
  panel.aScores = aScores;
  try {
    window.kaisergames.submitHighscore(levelNum, saveDataHandler.aLevelStore[0] + saveDataHandler.aLevelStore[1]);
  } catch (h) {
  }
  /** @type {number} */
  previousTime = (new Date).getTime();
  updateLevelComplete();
}
/**
 * @param {?} dataAndEvents
 * @return {undefined}
 */
function ballCallback(dataAndEvents) {
  switch(dataAndEvents) {
    case "moveEnded":
      /** @type {number} */
      gameTouchState = 0;
      oPosData.prevBallX = ball.trackX;
      oPosData.prevBallY = ball.trackY;
      hud.oLevelData.shotNum++;
      playSound("bounce1");
      break;
    case "holeEnded":
      initLevelComplete();
      break;
    case "bounce":
      addBounce(ball.trackX, ball.trackY);
      playSound("bounce" + Math.ceil(2 * Math.random()));
      break;
    case "reset":
      /** @type {number} */
      gameTouchState = 0;
      ball.trackX = oPosData.prevBallX;
      ball.trackY = oPosData.prevBallY;
      hud.oLevelData.shotNum++;
      playSound("reset");
      break;
    case "teleport":
      playSound("teleport");
      /** @type {number} */
      var b = 0;
      for (;5 > b;b++) {
        addBounce(ball.trackX + 40 * Math.random() - 20, ball.trackY + 40 * Math.random() - 20);
      }
    ;
  }
}
/**
 * @return {?}
 */
function isNearHole() {
  /** @type {number} */
  var z0 = ball.trackX - oHolePos.x;
  /** @type {number} */
  var z1 = ball.trackY - oHolePos.y;
  /** @type {number} */
  var c = z0 * z0 + z1 * z1;
  return 500 > c ? true : false;
}
/**
 * @param {boolean} recurring
 * @return {undefined}
 */
function toggleHudButs(recurring) {
  if (recurring) {
    userInput.addHitArea("mute", butEventHandler, null, "rect", {
      aRect : [538, 0, canvas.width, 60]
    }, true);
    userInput.addHitArea("pause", butEventHandler, null, "rect", {
      aRect : [480, 0, 538, 60]
    }, true);
    userInput.addHitArea("gameTouch", butEventHandler, {
      isDraggable : true,
      multiTouch : true
    }, "rect", {
      aRect : [0, 0, canvas.width, canvas.height]
    }, true);
  } else {
    userInput.removeHitArea("mute");
    userInput.removeHitArea("pause");
  }
}
/**
 * @param {number} moveX
 * @param {number} moveY
 * @return {undefined}
 */
function addBounce(moveX, moveY) {
  var copies = new Elements.Bounce(assetLib.getData("bounce"), {
    x : moveX,
    y : moveY
  });
  aBounces.push(copies);
}
/**
 * @return {undefined}
 */
function updateGameEvent() {
  if (!manualPause && (!rotatePause && "game" == gameState)) {
    var delta = getDelta();
    if (2 == gameTouchState) {
      aimX += (targAimX - aimX) / 0.1 * delta;
      aimY += (targAimY - aimY) / 0.1 * delta;
      /** @type {number} */
      oPosData.targStageX = buffer > targAimX && ball.trackX < 200 ? -buffer / buffer * targAimX : targAimX > canvas.width - buffer && ball.trackX > levelWidth - 200 ? -buffer - buffer / buffer * (buffer - (canvas.width - targAimX)) : -buffer;
      /** @type {number} */
      oPosData.targStageY = buffer > targAimY && ball.trackY < 200 ? -buffer / buffer * targAimY : targAimY > canvas.height - buffer && ball.trackY > levelHeight - 200 ? -buffer - buffer / buffer * (buffer - (canvas.height - targAimY)) : -buffer;
      if (oPosData.targStageX > 0) {
        /** @type {number} */
        oPosData.targStageX = 0;
      } else {
        if (oPosData.targStageX < -200) {
          /** @type {number} */
          oPosData.targStageX = -200;
        }
      }
      if (oPosData.targStageY > 0) {
        /** @type {number} */
        oPosData.targStageY = 0;
      } else {
        if (oPosData.targStageY < -200) {
          /** @type {number} */
          oPosData.targStageY = -200;
        }
      }
    } else {
      /** @type {number} */
      oPosData.targStageX = -buffer;
      /** @type {number} */
      oPosData.targStageY = -buffer;
    }
    oPosData.stageX += (oPosData.targStageX - oPosData.stageX) / 0.3 * delta;
    oPosData.stageY += (oPosData.targStageY - oPosData.stageY) / 0.3 * delta;
    level.update(oPosData.stageX, oPosData.stageY, delta);
    level.render(ctx);
    /** @type {number} */
    var i = 0;
    for (;i < aPickUps.length;i++) {
      aPickUps[i].update(oPosData.stageX, oPosData.stageY, delta);
      renderSprite(aPickUps[i]);
      if (aPickUps[i].canHit) {
        if (checkSpriteCollision(ball, aPickUps[i])) {
          aPickUps[i].hit();
          hud.oLevelData.pickUps++;
          playSound("gem" + Math.ceil(4 * Math.random()));
        }
      }
      if (aPickUps[i].removeMe) {
        aPickUps.splice(i, 1);
        i -= 1;
      }
    }
    ball.update(oPosData.stageX, oPosData.stageY, delta);
    renderSprite(ball);
    /** @type {number} */
    i = 0;
    for (;i < aBounces.length;i++) {
      aBounces[i].update(oPosData.stageX, oPosData.stageY, delta);
      renderSprite(aBounces[i]);
      if (aBounces[i].removeMe) {
        aBounces.splice(i, 1);
        i -= 1;
      }
    }
    if (2 == gameTouchState) {
      arrow.update(ball.x, ball.y, aimX, aimY, delta);
      arrow.render(ctx);
    } else {
      if (3 == gameTouchState && isNearHole()) {
        /** @type {number} */
        var remarkId = 0;
        if (hud.oLevelData.shotNum > 1) {
          /** @type {number} */
          remarkId = Math.min(Math.max(hud.oLevelData.shotNum - hud.oLevelData.par + 5, 1), 7);
        }
        userInput.removeHitArea("pause");
        playSound("holed");
        ball.changeState("holed", {
          x : oHolePos.x,
          y : oHolePos.y,
          remarkId : remarkId
        });
        /** @type {number} */
        gameTouchState = 4;
      }
    }
    hud.render(ctx);
    if ("moving" == ball.state) {
      physics2D.update(delta);
    }
    renderMuteBut();
    requestAnimFrame(updateGameEvent);
  }
}
/**
 * @return {undefined}
 */
function updateCreditsScreenEvent() {
  if (!rotatePause && "credits" == gameState) {
    var delta = getDelta();
    panel.update(delta);
    panel.render(ctx);
    renderMuteBut();
    requestAnimFrame(updateCreditsScreenEvent);
  }
}
/**
 * @return {undefined}
 */
function updateCourseSelectScreenEvent() {
  if (!rotatePause && "courseSelect" == gameState) {
    var delta = getDelta();
    background.updateScroll(delta);
    background.renderScroll(ctx);
    /** @type {number} */
    var i = 0;
    for (;i < aPickUps.length;i++) {
      aPickUps[i].y += (150 + 20 * i) * delta;
      /** @type {number} */
      aPickUps[i].rotation = aPickUps[i].y / 50;
      /** @type {number} */
      aPickUps[i].x = aPickUps[i].x - 100 * Math.sin(aPickUps[i].y / 100) * delta;
      if (aPickUps[i].y > canvas.height + 100) {
        /** @type {number} */
        aPickUps[i].x = Math.random() * canvas.width;
        /** @type {number} */
        aPickUps[i].y = -200;
      }
      aPickUps[i].update(delta);
      renderSprite(aPickUps[i]);
    }
    panel.update(delta);
    panel.render(ctx);
    renderMuteBut();
    requestAnimFrame(updateCourseSelectScreenEvent);
  }
}
/**
 * @return {undefined}
 */
function updateLevelComplete() {
  if (!rotatePause && "levelComplete" == gameState) {
    var delta = getDelta();
    background.updateScroll(delta);
    background.renderScroll(ctx);
    /** @type {number} */
    var i = 0;
    for (;i < aPickUps.length;i++) {
      aPickUps[i].y += (150 + 20 * i) * delta;
      /** @type {number} */
      aPickUps[i].rotation = aPickUps[i].y / 50;
      /** @type {number} */
      aPickUps[i].x = aPickUps[i].x - 100 * Math.sin(aPickUps[i].y / 100) * delta;
      if (aPickUps[i].y > canvas.height + 100) {
        /** @type {number} */
        aPickUps[i].x = Math.random() * canvas.width;
        /** @type {number} */
        aPickUps[i].y = -200;
      }
      aPickUps[i].update(delta);
      renderSprite(aPickUps[i]);
    }
    panel.update(delta);
    panel.render(ctx);
    renderMuteBut();
    requestAnimFrame(updateLevelComplete);
  }
}
/**
 * @return {?}
 */
function updateSplashScreenEvent() {
  if (!rotatePause && "splash" == gameState) {
    var delta = getDelta();
    if (splashTimer += delta, splashTimer > 2.5) {
      return 1 != audioType || (muted || music.play()), initStartScreen(), void 0;
    }
    splash.render(ctx, delta);
    requestAnimFrame(updateSplashScreenEvent);
  }
}
/**
 * @return {undefined}
 */
function updateStartScreenEvent() {
  if (!rotatePause && "start" == gameState) {
    var delta = getDelta();
    background.updateScroll(delta);
    background.renderScroll(ctx);
    /** @type {number} */
    var i = 0;
    for (;i < aPickUps.length;i++) {
      aPickUps[i].y += (150 + 20 * i) * delta;
      /** @type {number} */
      aPickUps[i].rotation = aPickUps[i].y / 50;
      /** @type {number} */
      aPickUps[i].x = aPickUps[i].x - 100 * Math.sin(aPickUps[i].y / 100) * delta;
      if (aPickUps[i].y > canvas.height + 100) {
        /** @type {number} */
        aPickUps[i].x = Math.random() * canvas.width;
        /** @type {number} */
        aPickUps[i].y = -200;
      }
      aPickUps[i].update(delta);
      renderSprite(aPickUps[i]);
    }
    panel.update(delta);
    panel.render(ctx);
    renderMuteBut();
    requestAnimFrame(updateStartScreenEvent);
  }
}
/**
 * @return {?}
 */
function getDelta() {
  /** @type {number} */
  var time = (new Date).getTime();
  /** @type {number} */
  var s = (time - previousTime) / 1E3;
  return previousTime = time, s > 0.5 && (s = 0), s;
}
/**
 * @param {Object} t
 * @return {undefined}
 */
function renderSprite(t) {
  ctx.save();
  ctx.translate(t.x, t.y);
  ctx.scale(t.scaleX, t.scaleY);
  ctx.rotate(t.rotation);
  t.render(ctx);
  ctx.restore();
}
/**
 * @param {Object} c
 * @param {Object} b
 * @return {?}
 */
function checkSpriteCollision(c, b) {
  /** @type {number} */
  var z0 = c.x - b.x;
  /** @type {number} */
  var z1 = c.y - b.y;
  /** @type {number} */
  var s = z0 * z0 + z1 * z1;
  /** @type {number} */
  var ms = c.radius * b.radius;
  return ms > s ? true : false;
}
/**
 * @param {Object} item
 * @param {Array} options
 * @return {?}
 */
function getScaleImageToMax(item, options) {
  var c;
  return c = item.isSpriteSheet ? options[0] / item.oData.spriteWidth < options[1] / item.oData.spriteHeight ? Math.min(options[0] / item.oData.spriteWidth, 1) : Math.min(options[1] / item.oData.spriteHeight, 1) : options[0] / item.img.width < options[1] / item.img.height ? Math.min(options[0] / item.img.width, 1) : Math.min(options[1] / item.img.height, 1);
}
/**
 * @param {Array} dataAndEvents
 * @param {?} oInfo
 * @param {number} deepDataAndEvents
 * @return {?}
 */
function getCentreFromTopLeft(dataAndEvents, oInfo, deepDataAndEvents) {
  /** @type {Array} */
  var grafsOut = new Array;
  return grafsOut.push(dataAndEvents[0] + oInfo.oData.spriteWidth / 2 * deepDataAndEvents), grafsOut.push(dataAndEvents[1] + oInfo.oData.spriteHeight / 2 * deepDataAndEvents), grafsOut;
}
/**
 * @return {undefined}
 */
function loadPreAssets() {
  if (aLangs.length > 1) {
    preAssetLib = new Utils.AssetLoader(curLang, [{
      id : "langSelect",
      file : "images/langSelect.jpg"
    }, {
      id : "preloadImage",
      file : "images/preloadImage.jpg"
    }], ctx, canvas.width, canvas.height, false);
    preAssetLib.onReady(initLangSelect);
  } else {
    curLang = aLangs[0];
    preAssetLib = new Utils.AssetLoader(curLang, [{
      id : "preloadImage",
      file : "images/preloadImage.jpg"
    }], ctx, canvas.width, canvas.height, false);
    preAssetLib.onReady(initLoadAssets);
  }
}
/**
 * @return {undefined}
 */
function initLangSelect() {
  /** @type {string} */
  curLang = "EN";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  userInput.removeHitArea("langSelect");
  initLoadAssets();
}
/**
 * @return {undefined}
 */
function initLoadAssets() {
  var preloadImage = preAssetLib.getData("preloadImage");
  loadAssets();
}
/**
 * @return {undefined}
 */
function loadAssets() {
  assetLib = new Utils.AssetLoader(curLang, [{
    id : "background",
    file : "images/background.jpg"
  }, {
    id : "hud",
    file : "images/" + curLang + "/hud.png"
  }, {
    id : "uiButs",
    file : "images/" + curLang + "/uiButs_191x109.png"
  }, {
    id : "panels1",
    file : "images/" + curLang + "/panels1_600x800.png"
  }, {
    id : "panels2",
    file : "images/" + curLang + "/panels2_600x800.png"
  }, {
    id : "bigNumbersLight",
    file : "images/bigNumbersLight_24x45.png"
  }, {
    id : "bigNumbersDark",
    file : "images/bigNumbersDark_24x45.png"
  }, {
    id : "smallNumbers",
    file : "images/smallNumbers_17x32.png"
  }, {
    id : "ball",
    file : "images/ball_118x169.png",
    oAnims : {
      waiting : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19],
      moving : [19],
      inWater : [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34]
    }
  }, {
    id : "bounce",
    file : "images/bounce_46x44.png",
    oAnims : {
      explode : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }
  }, {
    id : "arrow",
    file : "images/arrow_101x60.png"
  }, {
    id : "remarks",
    file : "images/" + curLang + "/remarks_560x255.png"
  }, {
    id : "level00",
    file : "images/" + curLang + "/levelA0.jpg"
  }, {
    id : "level01",
    file : "images/" + curLang + "/levelA1.jpg"
  }, {
    id : "level02",
    file : "images/levelA2.jpg"
  }, {
    id : "level03",
    file : "images/levelA3.jpg"
  }, {
    id : "level04",
    file : "images/levelA4.jpg"
  }, {
    id : "level05",
    file : "images/levelA5.jpg"
  }, {
    id : "level06",
    file : "images/levelA6.jpg"
  }, {
    id : "level07",
    file : "images/levelA7.jpg"
  }, {
    id : "level08",
    file : "images/levelA8.jpg"
  }, {
    id : "level10",
    file : "images/levelB0.jpg"
  }, {
    id : "level11",
    file : "images/levelB1.jpg"
  }, {
    id : "level12",
    file : "images/levelB2.jpg"
  }, {
    id : "level13",
    file : "images/levelB3.jpg"
  }, {
    id : "level14",
    file : "images/levelB4.jpg"
  }, {
    id : "level15",
    file : "images/levelB5.jpg"
  }, {
    id : "level16",
    file : "images/levelB6.jpg"
  }, {
    id : "level17",
    file : "images/levelB7.jpg"
  }, {
    id : "level18",
    file : "images/levelB8.jpg"
  }, {
    id : "muteBut",
    file : "images/mute_53x53.png"
  }, {
    id : "pickUps",
    file : "images/pickUps_108x99.png",
    oAnims : {
      waiting0 : [0, 1, 2, 3, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      waiting1 : [5, 6, 7, 8, 9, 8, 7, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
      waiting2 : [10, 11, 12, 13, 14, 13, 12, 11, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
      waiting3 : [15, 16, 17, 18, 19, 18, 17, 16, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
      waiting4 : [20, 21, 22, 23, 24, 23, 22, 21, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
      explode : [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35],
      falling0 : [36],
      falling1 : [37],
      falling2 : [38],
      falling3 : [39],
      falling4 : [40]
    }
  }], ctx, canvas.width, canvas.height, false);
  assetLib.onReady(initSplash);
}
/**
 * @return {undefined}
 */
function resizeCanvas() {
  /** @type {number} */
  var width = window.innerWidth;
  /** @type {number} */
  var height = window.innerHeight;
  if (width > 480) {
    width -= 1;
    height -= 1;
  }
  if (window.innerWidth > window.innerHeight && isMobile) {
    if ("loading" != gameState) {
      rotatePauseOn();
    }
    if (width / canvas.width < height / canvas.height) {
      /** @type {string} */
      canvas.style.width = width + "px";
      /** @type {string} */
      canvas.style.height = width / canvas.width * canvas.height + "px";
      /** @type {number} */
      canvasX = 0;
      /** @type {number} */
      canvasY = (height - width / canvas.width * canvas.height) / 2;
      /** @type {number} */
      canvasScaleX = canvasScaleY = canvas.width / width;
      /** @type {string} */
      div.style.marginTop = canvasY + "px";
      /** @type {string} */
      div.style.marginLeft = canvasX + "px";
    } else {
      /** @type {string} */
      canvas.style.width = height / canvas.height * canvas.width + "px";
      /** @type {string} */
      canvas.style.height = height + "px";
      /** @type {number} */
      canvasX = (width - height / canvas.height * canvas.width) / 2;
      /** @type {number} */
      canvasY = 0;
      /** @type {number} */
      canvasScaleX = canvasScaleY = canvas.height / height;
      /** @type {string} */
      div.style.marginTop = canvasY + "px";
      /** @type {string} */
      div.style.marginLeft = canvasX + "px";
    }
  } else {
    if (isMobile) {
      if (rotatePause) {
        rotatePauseOff();
      }
      /** @type {number} */
      canvasX = canvasY = 0;
      /** @type {number} */
      canvasScaleX = canvas.width / width;
      /** @type {number} */
      canvasScaleY = canvas.height / height;
      /** @type {string} */
      canvas.style.width = width + "px";
      /** @type {string} */
      canvas.style.height = height + "px";
      /** @type {string} */
      div.style.marginTop = "0px";
      /** @type {string} */
      div.style.marginLeft = "0px";
    } else {
      if (rotatePause) {
        rotatePauseOff();
      }
      if (width / canvas.width < height / canvas.height) {
        /** @type {string} */
        canvas.style.width = width + "px";
        /** @type {string} */
        canvas.style.height = width / canvas.width * canvas.height + "px";
        /** @type {number} */
        canvasX = 0;
        /** @type {number} */
        canvasY = (height - width / canvas.width * canvas.height) / 2;
        /** @type {number} */
        canvasScaleX = canvasScaleY = canvas.width / width;
        /** @type {string} */
        div.style.marginTop = canvasY + "px";
        /** @type {string} */
        div.style.marginLeft = canvasX + "px";
      } else {
        /** @type {string} */
        canvas.style.width = height / canvas.height * canvas.width + "px";
        /** @type {string} */
        canvas.style.height = height + "px";
        /** @type {number} */
        canvasX = (width - height / canvas.height * canvas.width) / 2;
        /** @type {number} */
        canvasY = 0;
        /** @type {number} */
        canvasScaleX = canvasScaleY = canvas.height / height;
        /** @type {string} */
        div.style.marginTop = canvasY + "px";
        /** @type {string} */
        div.style.marginLeft = canvasX + "px";
      }
    }
  }
  userInput.setCanvas(canvasX, canvasY, canvasScaleX, canvasScaleY);
}
/**
 * @param {string} name
 * @return {undefined}
 */
function playSound(name) {
  if (1 == audioType) {
    sound.play(name);
  }
}
/**
 * @return {undefined}
 */
function toggleMute() {
  /** @type {boolean} */
  muted = !muted;
  if (1 == audioType) {
    if (muted) {
      Howler.mute();
    } else {
      Howler.unmute();
    }
  } else {
    if (2 == audioType) {
      if (muted) {
        music.pause();
      } else {
        music.play();
      }
    }
  }
  renderMuteBut();
}
/**
 * @return {undefined}
 */
function renderLogoBut() {
  ctx.drawImage(oLogoBut.oImgData.img, 0, 0, oLogoBut.oImgData.img.width, oLogoBut.oImgData.img.height, oLogoBut.aPos[0] - oLogoBut.oImgData.img.width / 2 * oLogoBut.scale, oLogoBut.aPos[1] - oLogoBut.oImgData.img.height / 2 * oLogoBut.scale, oLogoBut.oImgData.img.width * oLogoBut.scale, oLogoBut.oImgData.img.height * oLogoBut.scale);
}
/**
 * @return {undefined}
 */
function renderMuteBut() {
  if (0 != audioType) {
    var img = assetLib.getData("muteBut");
    /** @type {number} */
    var sectionLength = 0;
    if (muted) {
      /** @type {number} */
      sectionLength = 1;
    }
    /** @type {number} */
    var startX = sectionLength * img.oData.spriteWidth % img.img.width;
    /** @type {number} */
    var offsetY = Math.floor(sectionLength / (img.img.width / img.oData.spriteWidth)) * img.oData.spriteHeight;
    ctx.drawImage(img.img, startX, offsetY, img.oData.spriteWidth, img.oData.spriteHeight, 538, 7, img.oData.spriteWidth, img.oData.spriteHeight);
  }
}
/**
 * @return {undefined}
 */
function toggleManualPause() {
  if (manualPause) {
    /** @type {boolean} */
    manualPause = false;
    userInput.removeHitArea("quitFromPause");
    userInput.removeHitArea("resumeFromPause");
    userInput.removeHitArea("moreGamesPause");
    pauseCoreOff();
  } else {
    /** @type {boolean} */
    manualPause = true;
    pauseCoreOn();
    var state = {
      oImgData : assetLib.getData("uiButs"),
      aPos : [104, 535],
      scale : 1,
      frame : 1
    };
    var y = {
      oImgData : assetLib.getData("uiButs"),
      aPos : [504, 535],
      scale : 1,
      frame : 0
    };
    var data = {
      oImgData : assetLib.getData("uiButs"),
      aPos : [canvas.width / 2 + 4, 535],
      scale : 1,
      frame : 2
    };
    /** @type {Array} */
    var a = new Array(state, y, data);
    userInput.addHitArea("quitFromPause", butEventHandler, null, "image", state);
    userInput.addHitArea("resumeFromPause", butEventHandler, null, "image", y);
    userInput.addHitArea("moreGamesPause", butEventHandler, null, "image", data);
    panel = new Elements.Panel(assetLib.getData("panels1"), assetLib.getData("panels2"), assetLib.getData("bigNumbersDark"), assetLib.getData("smallNumbers"), "pause", a, canvas.width, canvas.height);
    panel.render(ctx);
    userInput.addHitArea("pause", butEventHandler, null, "rect", {
      aRect : [480, 0, 538, 60]
    }, true);
  }
}
/**
 * @return {undefined}
 */
function rotatePauseOn() {
}
/**
 * @return {undefined}
 */
function rotatePauseOff() {
  /** @type {boolean} */
  rotatePause = false;
  userInput.removeHitArea("quitFromPause");
  userInput.removeHitArea("resumeFromPause");
  userInput.removeHitArea("moreGamesPause");
  pauseCoreOff();
}
/**
 * @return {undefined}
 */
function pauseCoreOn() {
  switch(1 == audioType ? Howler.mute() : 2 == audioType && music.pause(), gameState) {
    case "start":
      break;
    case "help":
      break;
    case "game":
      userInput.removeHitArea("gameTouch");
      break;
    case "end":
    ;
  }
}
/**
 * @return {undefined}
 */
function pauseCoreOff() {
  switch(1 == audioType ? muted || Howler.unmute() : 2 == audioType && (muted || music.play()), previousTime = (new Date).getTime(), userInput.pauseIsOn = false, gameState) {
    case "splash":
      updateSplashScreenEvent();
      break;
    case "start":
      initStartScreen();
      break;
    case "courseSelect":
      initCourseSelectScreen();
      break;
    case "credits":
      initCreditsScreen();
      break;
    case "game":
      /** @type {boolean} */
      manualPause = false;
      userInput.addHitArea("gameTouch", butEventHandler, {
        isDraggable : true,
        multiTouch : true
      }, "rect", {
        aRect : [0, 0, canvas.width, canvas.height]
      }, true);
      updateGameEvent();
      break;
    case "levelComplete":
      initLevelComplete();
  }
}
var Utils;
!function(eventHandle) {
  var elem = function() {
    /**
     * @param {?} e
     * @param {Array} codeSegments
     * @param {Object} dataAndEvents
     * @param {number} canvasWidth
     * @param {?} canvasHeight
     * @param {boolean} io
     * @return {undefined}
     */
    function canvas_onclick_func(e, codeSegments, dataAndEvents, canvasWidth, canvasHeight, io) {
      if ("undefined" == typeof io) {
        /** @type {boolean} */
        io = true;
      }
      this.oAssetData = {};
      /** @type {number} */
      this.assetsLoaded = 0;
      this.totalAssets = codeSegments.length;
      /** @type {Object} */
      this.ctx = dataAndEvents;
      /** @type {number} */
      this.canvasWidth = canvasWidth;
      this.canvasHeight = canvasHeight;
      /** @type {boolean} */
      this.showBar = io;
      /** @type {number} */
      this.topLeftX = this.canvasWidth / 2 - canvasWidth / 4;
      /** @type {number} */
      this.topLeftY = 440;
      if (this.showBar) {
        /** @type {string} */
        ctx.strokeStyle = "#5B6394";
        /** @type {number} */
        ctx.lineWidth = 2;
        /** @type {string} */
        ctx.fillStyle = "#95A8E9";
        ctx.moveTo(this.topLeftX, this.topLeftY);
        ctx.lineTo(this.topLeftX + canvasWidth / 2, this.topLeftY + 0);
        ctx.lineTo(this.topLeftX + canvasWidth / 2, this.topLeftY + 40);
        ctx.lineTo(this.topLeftX + 0, this.topLeftY + 40);
        ctx.lineTo(this.topLeftX + 0, this.topLeftY + 0);
        ctx.stroke();
      }
      /** @type {number} */
      var i = 0;
      for (;i < codeSegments.length;i++) {
        this.loadImage(codeSegments[i]);
      }
    }
    return canvas_onclick_func.prototype.loadImage = function(item) {
      var self = this;
      /** @type {Image} */
      var img = new Image;
      /**
       * @return {undefined}
       */
      img.onload = function() {
        self.oAssetData[item.id] = {};
        /** @type {Image} */
        self.oAssetData[item.id].img = img;
        self.oAssetData[item.id].oData = {};
        var spriteWidth = self.getSpriteSize(item.file);
        if (0 != spriteWidth[0]) {
          self.oAssetData[item.id].oData.spriteWidth = spriteWidth[0];
          self.oAssetData[item.id].oData.spriteHeight = spriteWidth[1];
        } else {
          self.oAssetData[item.id].oData.spriteWidth = self.oAssetData[item.id].img.width;
          self.oAssetData[item.id].oData.spriteHeight = self.oAssetData[item.id].img.height;
        }
        if (item.oAnims) {
          self.oAssetData[item.id].oData.oAnims = item.oAnims;
        }
        ++self.assetsLoaded;
        if (self.showBar) {
          ctx.fillRect(self.topLeftX + 2, self.topLeftY + 2, (self.canvasWidth / 2 - 4) / self.totalAssets * self.assetsLoaded, 36);
        }
        self.checkLoadComplete();
      };
      img.src = item.file;
    }, canvas_onclick_func.prototype.getSpriteSize = function(tail) {
      /** @type {Array} */
      var other = new Array;
      /** @type {string} */
      var s = "";
      /** @type {string} */
      var str = "";
      /** @type {number} */
      var e = 0;
      var length = tail.lastIndexOf(".");
      /** @type {boolean} */
      var g = true;
      for (;g;) {
        length--;
        if (0 == e && this.isNumber(tail.charAt(length))) {
          s = tail.charAt(length) + s;
        } else {
          if (0 == e && (s.length > 0 && "x" == tail.charAt(length))) {
            length--;
            /** @type {number} */
            e = 1;
            str = tail.charAt(length) + str;
          } else {
            if (1 == e && this.isNumber(tail.charAt(length))) {
              str = tail.charAt(length) + str;
            } else {
              if (1 == e && (str.length > 0 && "_" == tail.charAt(length))) {
                /** @type {boolean} */
                g = false;
                /** @type {Array} */
                other = [parseInt(str), parseInt(s)];
              } else {
                /** @type {boolean} */
                g = false;
                /** @type {Array} */
                other = [0, 0];
              }
            }
          }
        }
      }
      return other;
    }, canvas_onclick_func.prototype.isNumber = function(n) {
      return!isNaN(parseFloat(n)) && isFinite(n);
    }, canvas_onclick_func.prototype.checkLoadComplete = function() {
      if (this.assetsLoaded == this.totalAssets) {
        this.loadedCallback();
      }
    }, canvas_onclick_func.prototype.onReady = function(options) {
      /** @type {Function} */
      this.loadedCallback = options;
    }, canvas_onclick_func.prototype.getImg = function(key) {
      return this.oAssetData[key].img;
    }, canvas_onclick_func.prototype.getData = function(name) {
      return this.oAssetData[name];
    }, canvas_onclick_func;
  }();
  eventHandle.AssetLoader = elem;
}(Utils || (Utils = {}));
!function(eventHandle) {
  var elem = function() {
    /**
     * @param {?} far
     * @param {Blob} fps
     * @param {Blob} radius
     * @param {string} near
     * @return {undefined}
     */
    function Camera(far, fps, radius, near) {
      /** @type {number} */
      this.x = 0;
      /** @type {number} */
      this.y = 0;
      /** @type {number} */
      this.rotation = 0;
      /** @type {number} */
      this.radius = 10;
      /** @type {boolean} */
      this.removeMe = false;
      /** @type {number} */
      this.frameInc = 0;
      /** @type {string} */
      this.animType = "loop";
      /** @type {number} */
      this.offsetX = 0;
      /** @type {number} */
      this.offsetY = 0;
      /** @type {number} */
      this.scaleX = 1;
      /** @type {number} */
      this.scaleY = 1;
      this.oImgData = far;
      this.oAnims = this.oImgData.oData.oAnims;
      /** @type {Blob} */
      this.fps = fps;
      /** @type {Blob} */
      this.radius = radius;
      /** @type {string} */
      this.animId = near;
    }
    return Camera.prototype.updateAnimation = function(oldAnimation) {
      this.frameInc += this.fps * oldAnimation;
    }, Camera.prototype.resetAnim = function() {
      /** @type {number} */
      this.frameInc = 0;
    }, Camera.prototype.setFrame = function(args) {
      /** @type {number} */
      this.fixedFrame = args;
    }, Camera.prototype.setAnimType = function(callback, eventName, e) {
      switch("undefined" == typeof e && (e = true), this.animId = eventName, this.animType = callback, e && this.resetAnim(), callback) {
        case "loop":
          break;
        case "once":
          /** @type {number} */
          this.maxIdx = this.oAnims[this.animId].length - 1;
      }
    }, Camera.prototype.render = function(ctx) {
      if (null != this.animId) {
        var spaces1 = this.oAnims[this.animId].length;
        /** @type {number} */
        var num1 = Math.floor(this.frameInc);
        var sectionLength = this.oAnims[this.animId][num1 % spaces1];
        /** @type {number} */
        var startX = sectionLength * this.oImgData.oData.spriteWidth % this.oImgData.img.width;
        /** @type {number} */
        var offsetY = Math.floor(sectionLength / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
        if ("once" == this.animType && num1 > this.maxIdx) {
          this.fixedFrame = this.oAnims[this.animId][spaces1 - 1];
          /** @type {null} */
          this.animId = null;
          this.animEndedFunc();
          /** @type {number} */
          startX = this.fixedFrame * this.oImgData.oData.spriteWidth % this.oImgData.img.width;
          /** @type {number} */
          offsetY = Math.floor(this.fixedFrame / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
        }
      } else {
        /** @type {number} */
        startX = this.fixedFrame * this.oImgData.oData.spriteWidth % this.oImgData.img.width;
        /** @type {number} */
        offsetY = Math.floor(this.fixedFrame / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
      }
      ctx.drawImage(this.oImgData.img, startX, offsetY, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight, -this.oImgData.oData.spriteWidth / 2 + this.offsetX, -this.oImgData.oData.spriteHeight / 2 + this.offsetY, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight);
    }, Camera;
  }();
  eventHandle.AnimSprite = elem;
}(Utils || (Utils = {}));
!function(eventHandle) {
  var elem = function() {
    /**
     * @param {?} far
     * @param {Blob} radius
     * @param {number} args
     * @return {undefined}
     */
    function Camera(far, radius, args) {
      if ("undefined" == typeof args) {
        /** @type {number} */
        args = 0;
      }
      /** @type {number} */
      this.x = 0;
      /** @type {number} */
      this.y = 0;
      /** @type {number} */
      this.rotation = 0;
      /** @type {number} */
      this.radius = 10;
      /** @type {boolean} */
      this.removeMe = false;
      /** @type {number} */
      this.offsetX = 0;
      /** @type {number} */
      this.offsetY = 0;
      /** @type {number} */
      this.scaleX = 1;
      /** @type {number} */
      this.scaleY = 1;
      this.oImgData = far;
      /** @type {Blob} */
      this.radius = radius;
      this.setFrame(args);
    }
    return Camera.prototype.setFrame = function(args) {
      /** @type {number} */
      this.frameNum = args;
    }, Camera.prototype.render = function(ctx) {
      /** @type {number} */
      var startX = this.frameNum * this.oImgData.oData.spriteWidth % this.oImgData.img.width;
      /** @type {number} */
      var offsetY = Math.floor(this.frameNum / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
      ctx.drawImage(this.oImgData.img, startX, offsetY, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight, -this.oImgData.oData.spriteWidth / 2 + this.offsetX, -this.oImgData.oData.spriteHeight / 2 + this.offsetY, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight);
    }, Camera;
  }();
  eventHandle.BasicSprite = elem;
}(Utils || (Utils = {}));
!function(eventHandle) {
  var elem = function() {
    /**
     * @param {HTMLElement} el
     * @param {?} e
     * @return {undefined}
     */
    function onTouchStart(el, e) {
      var self = this;
      /** @type {number} */
      this.canvasX = 0;
      /** @type {number} */
      this.canvasY = 0;
      /** @type {number} */
      this.canvasScaleX = 1;
      /** @type {number} */
      this.canvasScaleY = 1;
      /** @type {number} */
      this.prevHitTime = 0;
      /** @type {boolean} */
      this.pauseIsOn = false;
      /** @type {boolean} */
      this.isDown = false;
      /** @type {boolean} */
      this.isDetectingKeys = false;
      this.isBugBrowser = e;
      el.addEventListener("touchstart", function(e) {
        /** @type {number} */
        var i = 0;
        for (;i < e.changedTouches.length;i++) {
          self.hitDown(e, e.changedTouches[i].pageX, e.changedTouches[i].pageY, e.changedTouches[i].identifier);
        }
      }, false);
      el.addEventListener("touchend", function(e) {
        /** @type {number} */
        var i = 0;
        for (;i < e.changedTouches.length;i++) {
          self.hitUp(e, e.changedTouches[i].pageX, e.changedTouches[i].pageY, e.changedTouches[i].identifier);
        }
      }, false);
      el.addEventListener("touchmove", function(e) {
        /** @type {number} */
        var i = 0;
        for (;i < self.aHitAreas.length;i++) {
          self.move(e, e.changedTouches[i].pageX, e.changedTouches[i].pageY, e.changedTouches[i].identifier, true);
        }
      }, false);
      el.addEventListener("mousedown", function(event) {
        /** @type {boolean} */
        self.isDown = true;
        self.hitDown(event, event.pageX, event.pageY, 1);
      }, false);
      el.addEventListener("mouseup", function(event) {
        /** @type {boolean} */
        self.isDown = false;
        self.hitUp(event, event.pageX, event.pageY, 1);
      }, false);
      el.addEventListener("mousemove", function(e) {
        self.move(e, e.pageX, e.pageY, 1, self.isDown);
      }, false);
      /** @type {Array} */
      this.aHitAreas = new Array;
      /** @type {Array} */
      this.aKeys = new Array;
    }
    return onTouchStart.prototype.setCanvas = function(canvasX, canvasY, lanyardCanvas, dataAndEvents) {
      /** @type {number} */
      this.canvasX = canvasX;
      /** @type {number} */
      this.canvasY = canvasY;
      /** @type {number} */
      this.canvasScaleX = lanyardCanvas;
      /** @type {number} */
      this.canvasScaleY = dataAndEvents;
    }, onTouchStart.prototype.hitDown = function(event, x, y, ensure) {
      if (!this.pauseIsOn) {
        /** @type {number} */
        var prevHitTime = (new Date).getTime();
        if (!(prevHitTime - this.prevHitTime < 500 && isBugBrowser)) {
          /** @type {number} */
          this.prevHitTime = prevHitTime;
          event.preventDefault();
          event.stopPropagation();
          /** @type {number} */
          x = (x - this.canvasX) * this.canvasScaleX;
          /** @type {number} */
          y = (y - this.canvasY) * this.canvasScaleY;
          /** @type {number} */
          var i = 0;
          for (;i < this.aHitAreas.length;i++) {
            if (this.aHitAreas[i].rect && (x > this.aHitAreas[i].area[0] && (y > this.aHitAreas[i].area[1] && (x < this.aHitAreas[i].area[2] && y < this.aHitAreas[i].area[3])))) {
              this.aHitAreas[i].aTouchIdentifiers.push(ensure);
              if (!this.aHitAreas[i].oData.isDown) {
                /** @type {boolean} */
                this.aHitAreas[i].oData.isDown = true;
                /** @type {number} */
                this.aHitAreas[i].oData.x = x;
                /** @type {number} */
                this.aHitAreas[i].oData.y = y;
                this.aHitAreas[i].callback(this.aHitAreas[i].id, this.aHitAreas[i].oData);
              }
              break;
            }
          }
        }
      }
    }, onTouchStart.prototype.hitUp = function(event, hour, minute, dataAndEvents) {
      if (!this.pauseIsOn) {
        event.preventDefault();
        event.stopPropagation();
        /** @type {number} */
        hour = (hour - this.canvasX) * this.canvasScaleX;
        /** @type {number} */
        minute = (minute - this.canvasY) * this.canvasScaleY;
        /** @type {number} */
        var i = 0;
        for (;i < this.aHitAreas.length;i++) {
          if (this.aHitAreas[i].rect && (hour > this.aHitAreas[i].area[0] && (minute > this.aHitAreas[i].area[1] && (hour < this.aHitAreas[i].area[2] && minute < this.aHitAreas[i].area[3])))) {
            /** @type {number} */
            var it = 0;
            for (;it < this.aHitAreas[i].aTouchIdentifiers.length;it++) {
              if (this.aHitAreas[i].aTouchIdentifiers[it] == dataAndEvents) {
                this.aHitAreas[i].aTouchIdentifiers.splice(it, 1);
                it -= 1;
              }
            }
            if (0 == this.aHitAreas[i].aTouchIdentifiers.length) {
              /** @type {boolean} */
              this.aHitAreas[i].oData.isDown = false;
              if (this.aHitAreas[i].oData.multiTouch) {
                this.aHitAreas[i].callback(this.aHitAreas[i].id, this.aHitAreas[i].oData);
              }
            }
            break;
          }
        }
      }
    }, onTouchStart.prototype.move = function(edge, x, y, row, dataAndEvents) {
      if (!this.pauseIsOn && dataAndEvents) {
        /** @type {number} */
        x = (x - this.canvasX) * this.canvasScaleX;
        /** @type {number} */
        y = (y - this.canvasY) * this.canvasScaleY;
        /** @type {number} */
        var i = 0;
        for (;i < this.aHitAreas.length;i++) {
          if (this.aHitAreas[i].rect) {
            if (x > this.aHitAreas[i].area[0] && (y > this.aHitAreas[i].area[1] && (x < this.aHitAreas[i].area[2] && y < this.aHitAreas[i].area[3]))) {
              try {
                if (this.aHitAreas[i] != undefined) {
                  if (this.aHitAreas[i].oData) {
                    if (!this.aHitAreas[i].oData.isDown) {
                      /** @type {boolean} */
                      this.aHitAreas[i].oData.isDown = true;
                      /** @type {number} */
                      this.aHitAreas[i].oData.x = x;
                      /** @type {number} */
                      this.aHitAreas[i].oData.y = y;
                      this.aHitAreas[i].aTouchIdentifiers.push(row);
                      if (this.aHitAreas[i] != undefined) {
                        if (this.aHitAreas[i].oData.multiTouch) {
                          this.aHitAreas[i].callback(this.aHitAreas[i].id, this.aHitAreas[i].oData);
                        }
                      }
                    }
                    if (this.aHitAreas[i].oData.isDraggable) {
                      /** @type {boolean} */
                      this.aHitAreas[i].oData.isBeingDragged = true;
                      /** @type {number} */
                      this.aHitAreas[i].oData.x = x;
                      /** @type {number} */
                      this.aHitAreas[i].oData.y = y;
                      this.aHitAreas[i].callback(this.aHitAreas[i].id, this.aHitAreas[i].oData);
                      /** @type {boolean} */
                      this.aHitAreas[i].oData.isBeingDragged = false;
                    }
                  }
                }
              } catch (eee) {
              }
            } else {
              if (this.aHitAreas[i].oData.isDown) {
                /** @type {number} */
                var n = 0;
                for (;n < this.aHitAreas[i].aTouchIdentifiers.length;n++) {
                  if (this.aHitAreas[i].aTouchIdentifiers[n] == row) {
                    this.aHitAreas[i].aTouchIdentifiers.splice(n, 1);
                    n -= 1;
                  }
                }
                if (0 == this.aHitAreas[i].aTouchIdentifiers.length) {
                  /** @type {boolean} */
                  this.aHitAreas[i].oData.isDown = false;
                  if (this.aHitAreas[i].oData.multiTouch) {
                    this.aHitAreas[i].callback(this.aHitAreas[i].id, this.aHitAreas[i].oData);
                  }
                }
              }
            }
          }
        }
      }
    }, onTouchStart.prototype.keyDown = function(ev) {
      /** @type {number} */
      var i = 0;
      for (;i < this.aKeys.length;i++) {
        if (ev.keyCode == this.aKeys[i].keyCode) {
          /** @type {boolean} */
          this.aKeys[i].oData.isDown = true;
          this.aKeys[i].callback(this.aKeys[i].id, this.aKeys[i].oData);
        }
      }
    }, onTouchStart.prototype.keyUp = function(e) {
      /** @type {number} */
      var i = 0;
      for (;i < this.aKeys.length;i++) {
        if (e.keyCode == this.aKeys[i].keyCode) {
          /** @type {boolean} */
          this.aKeys[i].oData.isDown = false;
          this.aKeys[i].callback(this.aKeys[i].id, this.aKeys[i].oData);
        }
      }
    }, onTouchStart.prototype.addKey = function(sessionId, callback, value, key) {
      var self = this;
      if (!this.isDetectingKeys) {
        window.addEventListener("keydown", function(ev) {
          self.keyDown(ev);
        }, false);
        window.addEventListener("keyup", function(e) {
          self.keyUp(e);
        }, false);
        /** @type {boolean} */
        this.isDetectingKeys = true;
      }
      if (null == value) {
        /** @type {Object} */
        value = new Object;
      }
      this.aKeys.push({
        id : sessionId,
        /** @type {Function} */
        callback : callback,
        oData : value,
        keyCode : key
      });
    }, onTouchStart.prototype.removeKey = function(value) {
      /** @type {number} */
      var i = 0;
      for (;i < this.aKeys.length;i++) {
        if (this.aKeys[i].id == value) {
          this.aKeys.splice(i, 1);
          i -= 1;
        }
      }
    }, onTouchStart.prototype.addHitArea = function(key, callback, lab, type, o, dataAndEvents) {
      if ("undefined" == typeof dataAndEvents) {
        /** @type {boolean} */
        dataAndEvents = false;
      }
      if (null == lab) {
        /** @type {Object} */
        lab = new Object;
      }
      if (dataAndEvents) {
        this.removeHitArea(key);
      }
      /** @type {Array} */
      var other = new Array;
      switch(type) {
        case "image":
          var val;
          /** @type {Array} */
          val = new Array(o.aPos[0] - o.oImgData.oData.spriteWidth / 2 * o.scale, o.aPos[1] - o.oImgData.oData.spriteHeight / 2 * o.scale, o.aPos[0] + o.oImgData.oData.spriteWidth / 2 * o.scale, o.aPos[1] + o.oImgData.oData.spriteHeight / 2 * o.scale);
          this.aHitAreas.push({
            id : key,
            aTouchIdentifiers : other,
            /** @type {Function} */
            callback : callback,
            oData : lab,
            rect : true,
            area : val
          });
          break;
        case "rect":
          this.aHitAreas.push({
            id : key,
            aTouchIdentifiers : other,
            /** @type {Function} */
            callback : callback,
            oData : lab,
            rect : true,
            area : o.aRect
          });
      }
    }, onTouchStart.prototype.removeHitArea = function(key) {
      /** @type {number} */
      var i = 0;
      for (;i < this.aHitAreas.length;i++) {
        if (this.aHitAreas[i].id == key) {
          this.aHitAreas.splice(i, 1);
          i -= 1;
        }
      }
    }, onTouchStart;
  }();
  eventHandle.UserInput = elem;
}(Utils || (Utils = {}));
!function(dataAndEvents) {
  var FpsMeter = function() {
    /**
     * @param {?} rows
     * @return {undefined}
     */
    function render(rows) {
      /** @type {number} */
      this.updateFreq = 10;
      /** @type {number} */
      this.updateInc = 0;
      /** @type {number} */
      this.frameAverage = 0;
      /** @type {number} */
      this.display = 1;
      /** @type {string} */
      this.log = "";
      /**
       * @param {CanvasRenderingContext2D} context
       * @return {undefined}
       */
      this.render = function(context) {
        this.frameAverage += this.delta / this.updateFreq;
        if (++this.updateInc >= this.updateFreq) {
          /** @type {number} */
          this.updateInc = 0;
          this.display = this.frameAverage;
          /** @type {number} */
          this.frameAverage = 0;
        }
        /** @type {string} */
        context.textAlign = "left";
        /** @type {string} */
        ctx.font = "10px Helvetica";
        /** @type {string} */
        context.fillStyle = "#333333";
        context.beginPath();
        context.rect(0, this.canvasHeight - 15, 40, 15);
        context.closePath();
        context.fill();
        /** @type {string} */
        context.fillStyle = "#ffffff";
        context.fillText(Math.round(1E3 / (1E3 * this.display)) + " fps " + this.log, 5, this.canvasHeight - 5);
      };
      this.canvasHeight = rows;
    }
    return render.prototype.update = function(delta) {
      this.delta = delta;
    }, render;
  }();
  dataAndEvents.FpsMeter = FpsMeter;
}(Utils || (Utils = {}));
var Elements;
!function(eventHandle) {
  var elem = function() {
    /**
     * @param {?} initialState
     * @param {number} canvasWidth
     * @param {?} canvasHeight
     * @return {undefined}
     */
    function Game(initialState, canvasWidth, canvasHeight) {
      /** @type {number} */
      this.x = 0;
      /** @type {number} */
      this.y = 0;
      /** @type {number} */
      this.targY = 0;
      /** @type {number} */
      this.incY = 0;
      /** @type {Array} */
      this.aScrollPos = new Array({
        offsetX : 0,
        offsetY : 0
      }, {
        offsetX : 1,
        offsetY : 0
      }, {
        offsetX : 1,
        offsetY : 1
      }, {
        offsetX : 0,
        offsetY : 1
      });
      this.oImgData = initialState;
      /** @type {number} */
      this.canvasWidth = canvasWidth;
      this.canvasHeight = canvasHeight;
    }
    return Game.prototype.updateScroll = function(e) {
      this.incY += 5 * e;
      /** @type {number} */
      this.x = this.x - 50 * Math.sin(this.incY / 10) * e;
      /** @type {number} */
      this.y = this.y - 50 * e;
    }, Game.prototype.renderScroll = function(ctx) {
      /** @type {number} */
      this.x = this.x % this.canvasWidth;
      /** @type {number} */
      this.y = this.y % this.canvasHeight;
      /** @type {number} */
      var i = 0;
      for (;4 > i;i++) {
        ctx.drawImage(this.oImgData.img, 0, 0, this.oImgData.img.width, this.oImgData.img.height, this.x + this.aScrollPos[i].offsetX * this.canvasWidth, this.y + this.aScrollPos[i].offsetY * this.canvasHeight, this.canvasWidth, this.canvasHeight);
      }
    }, Game;
  }();
  eventHandle.Background = elem;
}(Elements || (Elements = {}));
!function(eventHandle) {
  var elem = function() {
    /**
     * @param {?} contentHTML
     * @param {?} canvasWidth
     * @param {?} canvasHeight
     * @return {undefined}
     */
    function initialize(contentHTML, canvasWidth, canvasHeight) {
      /** @type {number} */
      this.inc = 0;
      this.oSplashScreenImgData = contentHTML;
      this.canvasWidth = canvasWidth;
      this.canvasHeight = canvasHeight;
      /** @type {number} */
      this.posY = -this.canvasHeight;
      TweenLite.to(this, 0.5, {
        posY : 0
      });
    }
    return initialize.prototype.render = function(ctx, delta) {
      this.inc += 5 * delta;
      ctx.drawImage(this.oSplashScreenImgData.img, 0, 0 - this.posY);
    }, initialize;
  }();
  eventHandle.Splash = elem;
}(Elements || (Elements = {}));
!function(Stopwatch) {
  var stopwatchPanel = function() {
    /**
     * @param {?} far
     * @param {?} near
     * @param {?} _game
     * @param {?} shader
     * @param {?} runtime
     * @param {?} turtle
     * @param {number} w
     * @param {?} h
     * @return {undefined}
     */
    function Scene(far, near, _game, shader, runtime, turtle, w, h) {
      /** @type {number} */
      this.timer = 0.3;
      /** @type {number} */
      this.endTime = 0;
      /** @type {Array} */
      this.aScores = new Array;
      /** @type {number} */
      this.posY = 0;
      /** @type {number} */
      this.bigCharSpace = 24;
      /** @type {number} */
      this.smallCharSpace = 16;
      /** @type {number} */
      this.incY = 0;
      /** @type {Array} */
      this.aLevelStore = new Array;
      this.oPanels1ImgData = far;
      this.oPanels2ImgData = near;
      this.oBigNumbersImgData = _game;
      this.oSmallNumbersImgData = shader;
      this.panelType = runtime;
      this.aButs = turtle;
      /** @type {number} */
      this.canvasWidth = w;
      this.canvasHeight = h;
    }
    return Scene.prototype.update = function(delta) {
      this.incY += 5 * delta;
    }, Scene.prototype.startTween1 = function() {
      /** @type {number} */
      this.posY = 800;
      TweenLite.to(this, 0.8, {
        posY : 0,
        ease : "Back.easeOut"
      });
    }, Scene.prototype.startTween2 = function() {
      /** @type {number} */
      this.posY = 800;
      TweenLite.to(this, 0.5, {
        posY : 0,
        ease : "Quad.easeOut"
      });
    }, Scene.prototype.render = function(ctx) {
      switch(this.panelType) {
        case "start":
          /** @type {number} */
          var to = 0;
          /** @type {number} */
          var startX = to * this.oPanels1ImgData.oData.spriteWidth % this.oPanels1ImgData.img.width;
          /** @type {number} */
          var offsetY = Math.floor(to / (this.oPanels1ImgData.img.width / this.oPanels1ImgData.oData.spriteWidth)) * this.oPanels1ImgData.oData.spriteHeight;
          ctx.drawImage(this.oPanels1ImgData.img, startX, offsetY, this.oPanels1ImgData.oData.spriteWidth, this.oPanels1ImgData.oData.spriteHeight, 0, 0 + this.posY, this.oPanels1ImgData.oData.spriteWidth, this.oPanels1ImgData.oData.spriteHeight);
          break;
        case "credits":
          /** @type {number} */
          to = 1;
          /** @type {number} */
          startX = to * this.oPanels1ImgData.oData.spriteWidth % this.oPanels1ImgData.img.width;
          /** @type {number} */
          offsetY = Math.floor(to / (this.oPanels1ImgData.img.width / this.oPanels1ImgData.oData.spriteWidth)) * this.oPanels1ImgData.oData.spriteHeight;
          ctx.drawImage(this.oPanels1ImgData.img, startX, offsetY, this.oPanels1ImgData.oData.spriteWidth, this.oPanels1ImgData.oData.spriteHeight, 0, 0 + this.posY, this.oPanels1ImgData.oData.spriteWidth, this.oPanels1ImgData.oData.spriteHeight);
          break;
        case "courseSelect":
          /** @type {number} */
          to = 2;
          /** @type {number} */
          startX = to * this.oPanels1ImgData.oData.spriteWidth % this.oPanels1ImgData.img.width;
          /** @type {number} */
          offsetY = Math.floor(to / (this.oPanels1ImgData.img.width / this.oPanels1ImgData.oData.spriteWidth)) * this.oPanels1ImgData.oData.spriteHeight;
          ctx.drawImage(this.oPanels1ImgData.img, startX, offsetY, this.oPanels1ImgData.oData.spriteWidth, this.oPanels1ImgData.oData.spriteHeight, 0, 0 + this.posY, this.oPanels1ImgData.oData.spriteWidth, this.oPanels1ImgData.oData.spriteHeight);
          /** @type {number} */
          var i = 0;
          for (;i < this.aLevelStore.length;i++) {
            part = this.aLevelStore[i];
            /** @type {number} */
            var n = 0;
            for (;n < part.toString().length;n++) {
              /** @type {number} */
              to = parseFloat(part.toString().charAt(n));
              /** @type {number} */
              startX = to * this.oSmallNumbersImgData.oData.spriteWidth % this.oSmallNumbersImgData.img.width;
              /** @type {number} */
              offsetY = Math.floor(to / (this.oSmallNumbersImgData.img.width / this.oSmallNumbersImgData.oData.spriteWidth)) * this.oSmallNumbersImgData.oData.spriteHeight;
              ctx.drawImage(this.oSmallNumbersImgData.img, startX, offsetY, this.oSmallNumbersImgData.oData.spriteWidth, this.oSmallNumbersImgData.oData.spriteHeight, 255 + n * this.smallCharSpace - this.smallCharSpace * part.toString().length / 2, 308 + 256 * i + this.posY, this.oSmallNumbersImgData.oData.spriteWidth, this.oSmallNumbersImgData.oData.spriteHeight);
            }
          }
          /** @type {boolean} */
          window.shareFlag = false;
          break;
        case "levelComplete":
          /** @type {number} */
          to = 1;
          /** @type {number} */
          startX = to * this.oPanels2ImgData.oData.spriteWidth % this.oPanels2ImgData.img.width;
          /** @type {number} */
          offsetY = Math.floor(to / (this.oPanels2ImgData.img.width / this.oPanels2ImgData.oData.spriteWidth)) * this.oPanels2ImgData.oData.spriteHeight;
          ctx.drawImage(this.oPanels2ImgData.img, startX, offsetY, this.oPanels2ImgData.oData.spriteWidth, this.oPanels2ImgData.oData.spriteHeight, 0, 0 + this.posY, this.oPanels2ImgData.oData.spriteWidth, this.oPanels2ImgData.oData.spriteHeight);
          var part;
          /** @type {number} */
          var expected = 0;
          /** @type {number} */
          var num = 0;
          /** @type {number} */
          var dstUri = 0;
          /** @type {number} */
          var k = 0;
          /** @type {number} */
          i = 0;
          for (;i < this.aScores.length && 0 != this.aScores[i].shotNum;i++) {
            k++;
            expected += this.aScores[i].par;
            num += this.aScores[i].shotNum;
            dstUri += this.aScores[i].pickUps;
            part = this.aScores[i].par;
            /** @type {number} */
            n = 0;
            for (;n < part.toString().length;n++) {
              /** @type {number} */
              to = parseFloat(part.toString().charAt(n));
              /** @type {number} */
              startX = to * this.oSmallNumbersImgData.oData.spriteWidth % this.oSmallNumbersImgData.img.width;
              /** @type {number} */
              offsetY = Math.floor(to / (this.oSmallNumbersImgData.img.width / this.oSmallNumbersImgData.oData.spriteWidth)) * this.oSmallNumbersImgData.oData.spriteHeight;
              ctx.drawImage(this.oSmallNumbersImgData.img, startX, offsetY, this.oSmallNumbersImgData.oData.spriteWidth, this.oSmallNumbersImgData.oData.spriteHeight, 143 + 50 * i + n * this.smallCharSpace - this.smallCharSpace * part.toString().length / 2, 270 + this.posY, this.oSmallNumbersImgData.oData.spriteWidth, this.oSmallNumbersImgData.oData.spriteHeight);
            }
            part = this.aScores[i].shotNum;
            /** @type {number} */
            n = 0;
            for (;n < part.toString().length;n++) {
              /** @type {number} */
              to = parseFloat(part.toString().charAt(n));
              /** @type {number} */
              startX = to * this.oSmallNumbersImgData.oData.spriteWidth % this.oSmallNumbersImgData.img.width;
              /** @type {number} */
              offsetY = Math.floor(to / (this.oSmallNumbersImgData.img.width / this.oSmallNumbersImgData.oData.spriteWidth)) * this.oSmallNumbersImgData.oData.spriteHeight;
              ctx.drawImage(this.oSmallNumbersImgData.img, startX, offsetY, this.oSmallNumbersImgData.oData.spriteWidth, this.oSmallNumbersImgData.oData.spriteHeight, 143 + 50 * i + n * this.smallCharSpace - this.smallCharSpace * part.toString().length / 2, 320 + this.posY, this.oSmallNumbersImgData.oData.spriteWidth, this.oSmallNumbersImgData.oData.spriteHeight);
            }
          }
          /** @type {number} */
          i = 0;
          for (;i < expected.toString().length;i++) {
            /** @type {number} */
            to = parseFloat(expected.toString().charAt(i));
            /** @type {number} */
            startX = to * this.oSmallNumbersImgData.oData.spriteWidth % this.oSmallNumbersImgData.img.width;
            /** @type {number} */
            offsetY = Math.floor(to / (this.oSmallNumbersImgData.img.width / this.oSmallNumbersImgData.oData.spriteWidth)) * this.oSmallNumbersImgData.oData.spriteHeight;
            ctx.drawImage(this.oSmallNumbersImgData.img, startX, offsetY, this.oSmallNumbersImgData.oData.spriteWidth, this.oSmallNumbersImgData.oData.spriteHeight, 262 + i * this.smallCharSpace - this.smallCharSpace * expected.toString().length / 2, 404 + this.posY, this.oSmallNumbersImgData.oData.spriteWidth, this.oSmallNumbersImgData.oData.spriteHeight);
          }
          /** @type {number} */
          i = 0;
          for (;i < num.toString().length;i++) {
            /** @type {number} */
            to = parseFloat(num.toString().charAt(i));
            /** @type {number} */
            startX = to * this.oSmallNumbersImgData.oData.spriteWidth % this.oSmallNumbersImgData.img.width;
            /** @type {number} */
            offsetY = Math.floor(to / (this.oSmallNumbersImgData.img.width / this.oSmallNumbersImgData.oData.spriteWidth)) * this.oSmallNumbersImgData.oData.spriteHeight;
            ctx.drawImage(this.oSmallNumbersImgData.img, startX, offsetY, this.oSmallNumbersImgData.oData.spriteWidth, this.oSmallNumbersImgData.oData.spriteHeight, 262 + i * this.smallCharSpace - this.smallCharSpace * num.toString().length / 2, 454 + this.posY, this.oSmallNumbersImgData.oData.spriteWidth, this.oSmallNumbersImgData.oData.spriteHeight);
          }
          /** @type {number} */
          i = 0;
          for (;i < dstUri.toString().length;i++) {
            /** @type {number} */
            to = parseFloat(dstUri.toString().charAt(i));
            /** @type {number} */
            startX = to * this.oSmallNumbersImgData.oData.spriteWidth % this.oSmallNumbersImgData.img.width;
            /** @type {number} */
            offsetY = Math.floor(to / (this.oSmallNumbersImgData.img.width / this.oSmallNumbersImgData.oData.spriteWidth)) * this.oSmallNumbersImgData.oData.spriteHeight;
            ctx.drawImage(this.oSmallNumbersImgData.img, startX, offsetY, this.oSmallNumbersImgData.oData.spriteWidth, this.oSmallNumbersImgData.oData.spriteHeight, 375 + i * this.smallCharSpace - this.smallCharSpace * dstUri.toString().length / 2, 429 + this.posY, this.oSmallNumbersImgData.oData.spriteWidth, this.oSmallNumbersImgData.oData.spriteHeight);
          }
          /** @type {number} */
          var expr = 10 * dstUri + 100 * Math.max(expected - num, 0) + 50 * k;
          /** @type {number} */
          i = 0;
          for (;i < expr.toString().length;i++) {
            /** @type {number} */
            to = parseFloat(expr.toString().charAt(i));
            /** @type {number} */
            startX = to * this.oBigNumbersImgData.oData.spriteWidth % this.oBigNumbersImgData.img.width;
            /** @type {number} */
            offsetY = Math.floor(to / (this.oBigNumbersImgData.img.width / this.oBigNumbersImgData.oData.spriteWidth)) * this.oBigNumbersImgData.oData.spriteHeight;
            ctx.drawImage(this.oBigNumbersImgData.img, startX, offsetY, this.oBigNumbersImgData.oData.spriteWidth, this.oBigNumbersImgData.oData.spriteHeight, 495 + i * this.bigCharSpace - this.bigCharSpace * expr.toString().length / 2, 438 + this.posY, this.oBigNumbersImgData.oData.spriteWidth, this.oBigNumbersImgData.oData.spriteHeight);
          }
          if (!window.shareFlag) {
            /** @type {boolean} */
            window.shareFlag = true;
            var arg = this.aScores.length;
            /** @type {number} */
            num = 0;
            for (;num < this.aScores.length;num++) {
              if (this.aScores[num].pickUps == 0) {
                /** @type {number} */
                arg = num;
                break;
              }
            }
            /** @type {number} */
            var old = expr;
            if (arg == 9) {
              /** @type {number} */
              old = expr;
            }
          }
          if (saveDataHandler.aLevelStore[courseNum] < expr) {
            /** @type {number} */
            saveDataHandler.aLevelStore[courseNum] = expr;
            saveDataHandler.saveData();
          }
          break;
        case "pause":
          /** @type {number} */
          to = 0;
          /** @type {number} */
          startX = to * this.oPanels2ImgData.oData.spriteWidth % this.oPanels2ImgData.img.width;
          /** @type {number} */
          offsetY = Math.floor(to / (this.oPanels2ImgData.img.width / this.oPanels2ImgData.oData.spriteWidth)) * this.oPanels2ImgData.oData.spriteHeight;
          ctx.drawImage(this.oPanels2ImgData.img, startX, offsetY, this.oPanels2ImgData.oData.spriteWidth, this.oPanels2ImgData.oData.spriteHeight, 0, 0, this.oPanels2ImgData.oData.spriteWidth, this.oPanels2ImgData.oData.spriteHeight);
      }
      /** @type {number} */
      i = 0;
      for (;i < this.aButs.length;i++) {
        var w = this.posY;
        /** @type {number} */
        var py = 0;
        if (0 != this.incY) {
          /** @type {number} */
          py = 3 * Math.sin(this.incY + 45 * i);
        }
        to = this.aButs[i].frame;
        /** @type {number} */
        startX = to * this.aButs[i].oImgData.oData.spriteWidth % this.aButs[i].oImgData.img.width;
        /** @type {number} */
        offsetY = Math.floor(to / (this.aButs[i].oImgData.img.width / this.aButs[i].oImgData.oData.spriteWidth)) * this.aButs[i].oImgData.oData.spriteHeight;
        ctx.drawImage(this.aButs[i].oImgData.img, startX, offsetY, this.aButs[i].oImgData.oData.spriteWidth, this.aButs[i].oImgData.oData.spriteHeight, this.aButs[i].aPos[0] - this.aButs[i].oImgData.oData.spriteWidth / 2 + w, this.aButs[i].aPos[1] - this.aButs[i].oImgData.oData.spriteHeight / 2 - py, this.aButs[i].oImgData.oData.spriteWidth * this.aButs[i].scale, this.aButs[i].oImgData.oData.spriteHeight * this.aButs[i].scale);
      }
    }, Scene;
  }();
  Stopwatch.Panel = stopwatchPanel;
}(Elements || (Elements = {}));
!function(eventHandle) {
  var elem = function() {
    /**
     * @param {?} Mh
     * @param {?} Mw
     * @param {?} span
     * @param {?} event
     * @param {?} e
     * @param {number} canvasWidth
     * @param {?} canvasHeight
     * @return {undefined}
     */
    function Zoom(Mh, Mw, span, event, e, canvasWidth, canvasHeight) {
      /** @type {number} */
      this.bigCharSpace = 20;
      /** @type {number} */
      this.smallCharSpace = 10;
      this.oHudImgData = Mh;
      this.oBigNumbersLightImgData = Mw;
      this.oBigNumbersDarkImgData = span;
      this.oSmallNumbersImgData = event;
      this.oLevelData = e;
      /** @type {number} */
      this.canvasWidth = canvasWidth;
      this.canvasHeight = canvasHeight;
    }
    return Zoom.prototype.render = function(ctx) {
      ctx.drawImage(this.oHudImgData.img, 0, 0);
      /** @type {number} */
      var n = 0;
      for (;n < this.oLevelData.hole.toString().length;n++) {
        /** @type {number} */
        var key = parseFloat(this.oLevelData.hole.toString().charAt(n));
        /** @type {number} */
        var startX = key * this.oBigNumbersLightImgData.oData.spriteWidth % this.oBigNumbersLightImgData.img.width;
        /** @type {number} */
        var offsetY = Math.floor(key / (this.oBigNumbersLightImgData.img.width / this.oBigNumbersLightImgData.oData.spriteWidth)) * this.oBigNumbersLightImgData.oData.spriteHeight;
        ctx.drawImage(this.oBigNumbersLightImgData.img, startX, offsetY, this.oBigNumbersLightImgData.oData.spriteWidth, this.oBigNumbersLightImgData.oData.spriteHeight, 150 + n * this.bigCharSpace, 10, this.oBigNumbersLightImgData.oData.spriteWidth, this.oBigNumbersLightImgData.oData.spriteHeight);
      }
      /** @type {number} */
      n = 0;
      for (;n < this.oLevelData.par.toString().length;n++) {
        /** @type {number} */
        key = parseFloat(this.oLevelData.par.toString().charAt(n));
        /** @type {number} */
        startX = key * this.oSmallNumbersImgData.oData.spriteWidth % this.oSmallNumbersImgData.img.width;
        /** @type {number} */
        offsetY = Math.floor(key / (this.oSmallNumbersImgData.img.width / this.oSmallNumbersImgData.oData.spriteWidth)) * this.oSmallNumbersImgData.oData.spriteHeight;
        ctx.drawImage(this.oSmallNumbersImgData.img, startX, offsetY, this.oSmallNumbersImgData.oData.spriteWidth, this.oSmallNumbersImgData.oData.spriteHeight, 293 + n * this.smallCharSpace, 16, this.oSmallNumbersImgData.oData.spriteWidth, this.oSmallNumbersImgData.oData.spriteHeight);
      }
      /** @type {number} */
      n = 0;
      for (;n < this.oLevelData.shotNum.toString().length;n++) {
        /** @type {number} */
        key = parseFloat(this.oLevelData.shotNum.toString().charAt(n));
        /** @type {number} */
        startX = key * this.oBigNumbersDarkImgData.oData.spriteWidth % this.oBigNumbersDarkImgData.img.width;
        /** @type {number} */
        offsetY = Math.floor(key / (this.oBigNumbersDarkImgData.img.width / this.oBigNumbersDarkImgData.oData.spriteWidth)) * this.oBigNumbersDarkImgData.oData.spriteHeight;
        ctx.drawImage(this.oBigNumbersDarkImgData.img, startX, offsetY, this.oBigNumbersDarkImgData.oData.spriteWidth, this.oBigNumbersDarkImgData.oData.spriteHeight, 432 + n * this.bigCharSpace, 10, this.oBigNumbersDarkImgData.oData.spriteWidth, this.oBigNumbersDarkImgData.oData.spriteHeight);
      }
    }, Zoom;
  }();
  eventHandle.Hud = elem;
}(Elements || (Elements = {}));
/** @type {function (Function, Function): undefined} */
var __extends = this.__extends || function(child, b) {
  /**
   * @return {undefined}
   */
  function __() {
    /** @type {Function} */
    this.constructor = child;
  }
  __.prototype = b.prototype;
  child.prototype = new __;
};
!function(exports) {
  var Ball = function(_super) {
    /**
     * @param {?} game
     * @param {?} initial
     * @param {Function} oData
     * @param {?} model
     * @param {?} canvasWidth
     * @param {?} canvasHeight
     * @return {undefined}
     */
    function Ship(game, initial, oData, model, canvasWidth, canvasHeight) {
      _super.call(this, game, 24, 36, "waiting");
      /** @type {number} */
      this.radian = Math.PI / 180;
      /** @type {number} */
      this.angle = 0;
      /** @type {number} */
      this.inc = 0;
      /** @type {Array} */
      this.aTilt = new Array({
        vx : 0,
        vy : -3
      }, {
        vx : 3,
        vy : 0
      }, {
        vx : 0,
        vy : 3
      }, {
        vx : -3,
        vy : 0
      });
      /** @type {null} */
      this.surfaceOn = null;
      /** @type {number} */
      this.vx = 0;
      /** @type {number} */
      this.vy = 0;
      /** @type {number} */
      this.m = 1;
      /** @type {number} */
      this.f = 1;
      /** @type {number} */
      this.b = 1;
      this.oRemarkImgData = initial;
      /** @type {Function} */
      this.oData = oData;
      this.ballCallback = model;
      this.trackX = this.oData.x;
      this.trackY = this.oData.y;
      this.p0 = {
        x : this.x,
        y : this.y
      };
      this.p1 = {
        x : this.x,
        y : this.y
      };
      /** @type {number} */
      this.bounceY = -50;
      /** @type {number} */
      this.bounceInc = 0;
      /** @type {number} */
      this.offsetY = -26;
      this.canvasWidth = canvasWidth;
      this.canvasHeight = canvasHeight;
      this.animEndedFunc = this.inWaterEnded;
      this.renderFunc = this.renderBall;
      this.changeState("waiting");
    }
    return __extends(Ship, _super), Ship.prototype.changeState = function(eventName, params) {
      switch("undefined" == typeof params && (params = null), this.state = eventName, eventName) {
        case "reset":
          /** @type {number} */
          this.fps = 24;
          this.updateFunc = this.updateWaiting;
          this.renderFunc = this.renderBall;
          /** @type {number} */
          this.bounceY = -50;
          /** @type {number} */
          this.bounceInc = 0;
          this.setAnimType("loop", "waiting");
          break;
        case "waiting":
          this.updateFunc = this.updateWaiting;
          this.setAnimType("loop", "waiting");
          break;
        case "aiming":
          this.updateFunc = this.updateWaiting;
          this.setAnimType("loop", "moving");
          break;
        case "moving":
          /** @type {number} */
          this.vx = params.power / 15 * Math.cos(params.angle);
          /** @type {number} */
          this.vy = params.power / 15 * Math.sin(params.angle);
          /** @type {number} */
          this.vz = 1;
          /** @type {number} */
          this.dec = 1;
          /** @type {null} */
          this.surfaceOn = null;
          /** @type {number} */
          var i = 0;
          for (;i < this.aSurfaces.length;i++) {
            if (this.trackX > this.aSurfaces[i].p0.x) {
              if (this.trackX < this.aSurfaces[i].p1.x) {
                if (this.trackY > this.aSurfaces[i].p0.y) {
                  if (this.trackY < this.aSurfaces[i].p1.y) {
                    if ("teleport" == this.aSurfaces[i].type) {
                      /** @type {string} */
                      this.surfaceOn = "teleport";
                    }
                  }
                }
              }
            }
          }
          this.setAnimType("loop", "moving");
          this.tween = TweenLite.to(this, 4 * (Math.max(Math.abs(this.vx), Math.abs(this.vy)) / 6.67), {
            dec : 0,
            ease : "Quad.easeOut",
            onComplete : this.moveEnded,
            onCompleteParams : [this]
          });
          /** @type {number} */
          this.bounceY = 0;
          /** @type {number} */
          this.bounceInc = 1.5 * -params.power;
          this.p0 = {
            x : this.trackX,
            y : this.trackY
          };
          this.p1 = {
            x : this.trackX,
            y : this.trackY
          };
          this.updateFunc = this.updateMoving;
          break;
        case "holed":
          this.tween.kill();
          this.remarkId = params.remarkId;
          this.tween = TweenLite.to(this, 0.5, {
            trackX : params.x,
            trackY : params.y,
            scaleX : 0,
            scaleY : 0,
            ease : "Quad.easeOut",
            onComplete : this.ballHoled,
            onCompleteParams : [this]
          });
          this.updateFunc = this.updateWaiting;
          break;
        case "remarking":
          /** @type {number} */
          this.scaleX = this.scaleY = 1;
          this.remarkX = this.x;
          this.remarkY = this.y;
          /** @type {number} */
          this.x = this.y = 0;
          /** @type {number} */
          this.remarkScale = 0;
          this.tween = TweenLite.to(this, 2, {
            remarkX : this.canvasWidth / 2,
            remarkY : this.canvasHeight / 2,
            remarkScale : 1,
            ease : "Back.easeOut",
            onComplete : this.remarkEnded,
            onCompleteParams : [this]
          });
          this.updateFunc = this.updateRemarking;
          this.renderFunc = this.renderRemarking;
          break;
        case "inWater":
          this.tween.kill();
          /** @type {number} */
          this.fps = 15;
          this.setAnimType("once", "inWater");
          this.updateFunc = this.updateInWater;
          this.renderFunc = this.renderInWater;
      }
    }, Ship.prototype.moveEnded = function(self) {
      self.changeState("waiting");
      self.ballCallback("moveEnded");
    }, Ship.prototype.ballHoled = function(Util) {
      Util.changeState("remarking");
    }, Ship.prototype.remarkEnded = function(dataAndEvents) {
      dataAndEvents.ballCallback("holeEnded");
    }, Ship.prototype.inWaterEnded = function() {
      this.ballCallback("reset");
      this.changeState("reset");
    }, Ship.prototype.update = function(delta, message, dt) {
      this.updateFunc(delta, message, dt);
    }, Ship.prototype.updateInWater = function(opt_fromIndex, childrenVarArgs, dt) {
      _super.prototype.updateAnimation.call(this, dt);
    }, Ship.prototype.render = function(ctx) {
      this.renderFunc(ctx);
    }, Ship.prototype.updateMoving = function(x, y, dt) {
      _super.prototype.updateAnimation.call(this, dt);
      /** @type {number} */
      var vz = this.dec / this.vz;
      this.vz *= vz;
      this.vx *= vz;
      this.vy *= vz;
      this.x = this.trackX + x;
      this.y = this.trackY + y;
      /** @type {boolean} */
      var f = false;
      /** @type {number} */
      var i = 0;
      for (;i < this.aSurfaces.length;i++) {
        if (this.trackX > this.aSurfaces[i].p0.x && (this.trackX < this.aSurfaces[i].p1.x && (this.trackY > this.aSurfaces[i].p0.y && this.trackY < this.aSurfaces[i].p1.y))) {
          if ("slope" == this.aSurfaces[i].type) {
            this.tween.kill();
            /** @type {string} */
            this.surfaceOn = "slope";
            /** @type {boolean} */
            f = true;
            this.vx = this.vx + this.aTilt[this.aSurfaces[i].dir].vx * dt;
            this.vy = this.vy + this.aTilt[this.aSurfaces[i].dir].vy * dt;
            /** @type {number} */
            var vx = Math.abs(this.vx);
            /** @type {number} */
            var vy = Math.abs(this.vy);
            if (vx > 6.67) {
              /** @type {number} */
              this.vx = Math.max(Math.min(this.vx, 6.67), -6.67);
              /** @type {number} */
              this.vy = this.vy * (6.67 / vx);
            } else {
              if (vy > 6.67) {
                /** @type {number} */
                this.vy = Math.max(Math.min(this.vy, 6.67), -6.67);
                /** @type {number} */
                this.vx = this.vx * (6.67 / vy);
              }
            }
          } else {
            if ("mud" == this.aSurfaces[i].type) {
              if ("mud" != this.surfaceOn) {
                this.tween.timeScale(4);
                playSound("mud");
                /** @type {string} */
                this.surfaceOn = "mud";
              }
              /** @type {boolean} */
              f = true;
            } else {
              if ("water" == this.aSurfaces[i].type && (this.bounceY > -15 && this.bounceInc >= 0 || this.bounceY > -1)) {
                playSound("splash");
                this.changeState("inWater");
              } else {
                if ("teleport" == this.aSurfaces[i].type) {
                  if ("teleport" != this.surfaceOn) {
                    this.teleportMe(i);
                  }
                  /** @type {boolean} */
                  f = true;
                }
              }
            }
          }
        }
      }
      if (!f) {
        if ("slope" == this.surfaceOn) {
          this.tween = TweenLite.to(this, 4 * (Math.max(Math.abs(this.vx), Math.abs(this.vy)) / 6.67), {
            dec : 0,
            ease : "Quad.easeOut",
            onComplete : this.moveEnded,
            onCompleteParams : [this]
          });
          /** @type {null} */
          this.surfaceOn = null;
        } else {
          if ("mud" == this.surfaceOn) {
            this.tween.kill();
            this.tween = TweenLite.to(this, 4 * (Math.max(Math.abs(this.vx), Math.abs(this.vy)) / 6.67), {
              dec : 0,
              ease : "Quad.easeOut",
              onComplete : this.moveEnded,
              onCompleteParams : [this]
            });
            /** @type {null} */
            this.surfaceOn = null;
          } else {
            if ("teleport" == this.surfaceOn) {
              /** @type {null} */
              this.surfaceOn = null;
            }
          }
        }
      }
      this.bounceInc += 650 * dt;
      this.bounceY += this.bounceInc * dt;
      if (this.bounceY > 0) {
        /** @type {number} */
        this.bounceY = 0;
        if (this.bounceInc > 75) {
          this.ballCallback("bounce");
        }
        this.bounceInc *= -0.8;
      }
    }, Ship.prototype.teleportMe = function(e) {
      /** @type {Array} */
      var values = new Array;
      /** @type {number} */
      var i = 0;
      for (;i < this.aSurfaces.length;i++) {
        if ("teleport" == this.aSurfaces[i].type) {
          if (i != e) {
            values.push(this.aSurfaces[i]);
          }
        }
      }
      var value = values[Math.floor(Math.random() * values.length)];
      this.ballCallback("teleport");
      this.trackX = value.p0.x + (value.p1.x - value.p0.x) / 2;
      this.trackY = value.p0.y + (value.p1.y - value.p0.y) / 2;
      this.p0 = {
        x : this.trackX,
        y : this.trackY
      };
      this.p1 = {
        x : this.trackX,
        y : this.trackY
      };
      /** @type {string} */
      this.surfaceOn = "teleport";
    }, Ship.prototype.updateWaiting = function(x, y, message) {
      _super.prototype.updateAnimation.call(this, message);
      this.x = this.trackX + x;
      this.y = this.trackY + y;
      this.bounceInc += 800 * message;
      this.bounceY += this.bounceInc * message;
      if (this.bounceY > 0) {
        /** @type {number} */
        this.bounceY = 0;
        this.bounceInc *= -0.5;
      }
    }, Ship.prototype.updateRemarking = function() {
    }, Ship.prototype.renderInWater = function(env) {
      _super.prototype.render.call(this, env);
    }, Ship.prototype.renderBall = function(ctx) {
      _super.prototype.render.call(this, ctx);
      /** @type {number} */
      var startX = 20 * this.oImgData.oData.spriteWidth % this.oImgData.img.width;
      /** @type {number} */
      var offsetY = Math.floor(20 / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
      ctx.drawImage(this.oImgData.img, startX, offsetY, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight, -this.oImgData.oData.spriteWidth / 2, -this.oImgData.oData.spriteHeight / 2 + this.bounceY - 26, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight);
    }, Ship.prototype.renderRemarking = function(ctx) {
      /** @type {number} */
      var startX = this.remarkId * this.oRemarkImgData.oData.spriteWidth % this.oRemarkImgData.img.width;
      /** @type {number} */
      var offsetY = Math.floor(this.remarkId / (this.oRemarkImgData.img.width / this.oRemarkImgData.oData.spriteWidth)) * this.oRemarkImgData.oData.spriteHeight;
      ctx.drawImage(this.oRemarkImgData.img, startX, offsetY, this.oRemarkImgData.oData.spriteWidth, this.oRemarkImgData.oData.spriteHeight, this.remarkX - this.oRemarkImgData.oData.spriteWidth / 2 * this.remarkScale, this.remarkY - this.oRemarkImgData.oData.spriteHeight / 2 * this.remarkScale, this.oRemarkImgData.oData.spriteWidth * this.remarkScale, this.oRemarkImgData.oData.spriteHeight * this.remarkScale);
    }, Ship;
  }(Utils.AnimSprite);
  exports.Ball = Ball;
}(Elements || (Elements = {}));
!function(b) {
  var Level = function() {
    /**
     * @param {?} initialState
     * @param {?} canvasWidth
     * @param {?} canvasHeight
     * @return {undefined}
     */
    function Game(initialState, canvasWidth, canvasHeight) {
      /** @type {number} */
      this.radian = Math.PI / 180;
      this.oLevelImgData = initialState;
      this.canvasWidth = canvasWidth;
      this.canvasHeight = canvasHeight;
    }
    return Game.prototype.update = function(delta, yPosition) {
      /** @type {number} */
      this.x = delta;
      /** @type {number} */
      this.y = yPosition;
    }, Game.prototype.render = function(ctx) {
      ctx.drawImage(this.oLevelImgData.img, -this.x, -this.y, this.canvasWidth, this.canvasHeight, 0, 0, this.canvasWidth, this.canvasHeight);
    }, Game;
  }();
  b.Level = Level;
}(Elements || (Elements = {}));
!function(G) {
  var Arrow = function() {
    /**
     * @param {?} far
     * @param {?} canvasWidth
     * @param {?} canvasHeight
     * @return {undefined}
     */
    function Camera(far, canvasWidth, canvasHeight) {
      /** @type {number} */
      this.x = 0;
      /** @type {number} */
      this.y = 0;
      /** @type {number} */
      this.scaleX = 0;
      /** @type {number} */
      this.scaleY = 1;
      /** @type {number} */
      this.maxLength = 100;
      this.oArrowImgData = far;
      this.canvasWidth = canvasWidth;
      this.canvasHeight = canvasHeight;
    }
    return Camera.prototype.update = function(delta, yPosition, x, y) {
      /** @type {number} */
      this.x = delta;
      /** @type {number} */
      this.y = yPosition;
      /** @type {number} */
      this.lengthX = this.x - x;
      /** @type {number} */
      this.lengthY = this.y - y;
      /** @type {number} */
      this.hyp = Math.min(Math.sqrt(this.lengthX * this.lengthX + this.lengthY * this.lengthY), this.maxLength);
      /** @type {number} */
      this.scaleX = Math.min(this.hyp / this.maxLength, 1);
      /** @type {number} */
      this.rotation = Math.atan2(this.lengthY, this.lengthX);
    }, Camera.prototype.render = function(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.scale(this.scaleX, this.scaleY);
      /** @type {number} */
      var startX = 0 * this.oArrowImgData.oData.spriteWidth % this.oArrowImgData.img.width;
      /** @type {number} */
      var offsetY = Math.floor(0 / (this.oArrowImgData.img.width / this.oArrowImgData.oData.spriteWidth)) * this.oArrowImgData.oData.spriteHeight;
      ctx.drawImage(this.oArrowImgData.img, startX, offsetY, this.oArrowImgData.oData.spriteWidth, this.oArrowImgData.oData.spriteHeight, 0, -this.oArrowImgData.oData.spriteHeight / 2, this.oArrowImgData.oData.spriteWidth, this.oArrowImgData.oData.spriteHeight);
      ctx.restore();
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      /** @type {number} */
      startX = 1 * this.oArrowImgData.oData.spriteWidth % this.oArrowImgData.img.width;
      /** @type {number} */
      offsetY = Math.floor(1 / (this.oArrowImgData.img.width / this.oArrowImgData.oData.spriteWidth)) * this.oArrowImgData.oData.spriteHeight;
      ctx.drawImage(this.oArrowImgData.img, startX, offsetY, this.oArrowImgData.oData.spriteWidth, this.oArrowImgData.oData.spriteHeight, this.hyp - 1, -this.oArrowImgData.oData.spriteHeight / 2, this.oArrowImgData.oData.spriteWidth, this.oArrowImgData.oData.spriteHeight);
      ctx.restore();
    }, Camera;
  }();
  G.Arrow = Arrow;
}(Elements || (Elements = {}));
!function(eventHandle) {
  var elem = function(_super) {
    /**
     * @param {?} game
     * @param {Object} model
     * @param {?} canvasWidth
     * @param {?} canvasHeight
     * @return {undefined}
     */
    function GameObject(game, model, canvasWidth, canvasHeight) {
      _super.call(this, game, 22, 45, "waiting" + model.id);
      /** @type {boolean} */
      this.canHit = true;
      /** @type {Object} */
      this.oData = model;
      this.canvasWidth = canvasWidth;
      this.canvasHeight = canvasHeight;
      this.trackX = this.oData.x;
      this.trackY = this.oData.y;
      /** @type {number} */
      this.offsetY = -4;
      /** @type {number} */
      this.offsetX = -3;
      /** @type {number} */
      this.frameInc = Math.ceil(100 * Math.random());
      /**
       * @return {undefined}
       */
      this.animEndedFunc = function() {
        /** @type {boolean} */
        this.removeMe = true;
      };
    }
    return __extends(GameObject, _super), GameObject.prototype.hit = function() {
      /** @type {boolean} */
      this.canHit = false;
      this.setAnimType("once", "explode");
    }, GameObject.prototype.update = function(delta, y, dt) {
      _super.prototype.updateAnimation.call(this, dt);
      this.x = this.trackX + delta;
      this.y = this.trackY + y;
    }, GameObject;
  }(Utils.AnimSprite);
  eventHandle.PickUp = elem;
}(Elements || (Elements = {}));
!function(Functions) {
  var Bounce = function(_super) {
    /**
     * @param {?} game
     * @param {Function} oData
     * @return {undefined}
     */
    function GameObject(game, oData) {
      _super.call(this, game, 20, 30, "explode");
      /** @type {Function} */
      this.oData = oData;
      this.trackX = this.oData.x;
      this.trackY = this.oData.y;
      this.setAnimType("once", "explode");
      /**
       * @return {undefined}
       */
      this.animEndedFunc = function() {
        /** @type {boolean} */
        this.removeMe = true;
      };
    }
    return __extends(GameObject, _super), GameObject.prototype.update = function(delta, y, dt) {
      _super.prototype.updateAnimation.call(this, dt);
      this.x = this.trackX + delta;
      this.y = this.trackY + y;
    }, GameObject;
  }(Utils.AnimSprite);
  Functions.Bounce = Bounce;
}(Elements || (Elements = {}));
!function(eventHandle) {
  var elem = function(_super) {
    /**
     * @param {?} canvas
     * @param {Function} oData
     * @param {number} canvasWidth
     * @param {?} canvasHeight
     * @return {undefined}
     */
    function Game(canvas, oData, canvasWidth, canvasHeight) {
      _super.call(this, canvas, 22, 45, "falling" + oData.id);
      /** @type {Function} */
      this.oData = oData;
      this.x = this.oData.x;
      this.y = this.oData.y;
      /** @type {number} */
      this.canvasWidth = canvasWidth;
      this.canvasHeight = canvasHeight;
    }
    return __extends(Game, _super), Game.prototype.update = function(delta) {
      _super.prototype.updateAnimation.call(this, delta);
    }, Game;
  }(Utils.AnimSprite);
  eventHandle.FallingGem = elem;
}(Elements || (Elements = {}));
!function(eventHandle) {
  var elem = function() {
    /**
     * @param {Array} blockHolder
     * @param {?} state
     * @return {undefined}
     */
    function $(blockHolder, state) {
      /** @type {Array} */
      this.aLines = new Array;
      /** @type {Array} */
      this.aBalls = new Array;
      /** @type {Array} */
      this.aLines = blockHolder;
      this.aBalls.push(state);
      /** @type {number} */
      var conditionIndex = 0;
      for (;conditionIndex < this.aLines.length;conditionIndex++) {
        this.updateVector(this.aLines[conditionIndex], null, true);
      }
    }
    return $.prototype.drawAll = function(delay) {
      /** @type {number} */
      var i = 0;
      for (;i < this.aBalls.length;i++) {
        if ("moving" == this.aBalls[i].state) {
          var p = this.aBalls[i];
          p.trackX = p.p1.x;
          p.trackY = p.p1.y;
          p.p0 = p.p1;
          this.updateVector(p, delay);
        }
      }
    }, $.prototype.update = function(delta) {
      var ii;
      /** @type {number} */
      ii = 0;
      for (;ii < this.aBalls.length;ii++) {
        var p = this.aBalls[ii];
        this.updateVector(p, delta);
        /** @type {number} */
        var conditionIndex = 0;
        for (;conditionIndex < this.aLines.length;conditionIndex++) {
          this.fi = this.findIntersection(p, this.aLines[conditionIndex]);
          this.updateVector(this.fi, delta, false);
          /** @type {number} */
          var factor = p.radius - this.fi.len;
          if (factor >= 0) {
            addBounce(p.p1.x, p.p1.y);
            playSound("wall" + Math.ceil(2 * Math.random()));
            p.p1.x += this.fi.dx * factor;
            p.p1.y += this.fi.dy * factor;
            var out = {
              dx : this.fi.lx,
              dy : this.fi.ly,
              lx : this.fi.dx,
              ly : this.fi.dy,
              b : 1,
              f : 1
            };
            var player = this.bounce(p, out);
            p.vx = player.vx;
            p.vy = player.vy;
          }
        }
      }
      this.drawAll(delta);
    }, $.prototype.updateVector = function(p, t, recurring) {
      if ("undefined" == typeof recurring) {
        /** @type {boolean} */
        recurring = false;
      }
      if (null == t) {
        /** @type {number} */
        t = 0.016;
      }
      if (1 == recurring) {
        /** @type {number} */
        p.vx = p.p1.x - p.p0.x;
        /** @type {number} */
        p.vy = p.p1.y - p.p0.y;
      } else {
        p.p1.x = p.p0.x + 60 * p.vx * t;
        p.p1.y = p.p0.y + 60 * p.vy * t;
      }
      this.makeVector(p);
    }, $.prototype.makeVector = function(obj) {
      /** @type {number} */
      obj.len = Math.sqrt(obj.vx * obj.vx + obj.vy * obj.vy);
      if (obj.len > 0) {
        /** @type {number} */
        obj.dx = obj.vx / obj.len;
        /** @type {number} */
        obj.dy = obj.vy / obj.len;
      } else {
        /** @type {number} */
        obj.dx = 0;
        /** @type {number} */
        obj.dy = 0;
      }
      /** @type {number} */
      obj.rx = -obj.dy;
      obj.ry = obj.dx;
      obj.lx = obj.dy;
      /** @type {number} */
      obj.ly = -obj.dx;
    }, $.prototype.dotP = function(obj, plr) {
      /** @type {number} */
      var dotP = obj.vx * plr.vx + obj.vy * plr.vy;
      return dotP;
    }, $.prototype.projectVector = function(p, dt, vy) {
      /** @type {number} */
      var vx = p.vx * dt + p.vy * vy;
      var dot = {};
      return dot.vx = vx * dt, dot.vy = vx * vy, dot;
    }, $.prototype.bounceBalls = function(obj, props, matrix) {
      var p = this.projectVector(obj, matrix.dx, matrix.dy);
      var self = this.projectVector(obj, matrix.lx, matrix.ly);
      var A = this.projectVector(props, matrix.dx, matrix.dy);
      var options = this.projectVector(props, matrix.lx, matrix.ly);
      /** @type {number} */
      var a = obj.m * p.vx + props.m * A.vx;
      /** @type {number} */
      var x = p.vx - A.vx;
      /** @type {number} */
      var end = (a + x * obj.m) / (obj.m + props.m);
      /** @type {number} */
      var i = end - x;
      /** @type {number} */
      a = obj.m * p.vy + props.m * A.vy;
      /** @type {number} */
      x = p.vy - A.vy;
      /** @type {number} */
      var r = (a + x * obj.m) / (obj.m + props.m);
      /** @type {number} */
      var d = r - x;
      var e = {};
      return e.vx1 = self.vx + i, e.vy1 = self.vy + d, e.vx2 = options.vx + end, e.vy2 = options.vy + r, e;
    }, $.prototype.bounce = function(p, matrix) {
      var ps = this.projectVector(p, matrix.dx, matrix.dy);
      var obj = this.projectVector(p, matrix.lx, matrix.ly);
      var A = {};
      return obj.len = Math.sqrt(obj.vx * obj.vx + obj.vy * obj.vy), obj.vx = matrix.lx * obj.len, obj.vy = matrix.ly * obj.len, A.vx = p.f * matrix.f * ps.vx + p.b * matrix.b * obj.vx, A.vy = p.f * matrix.f * ps.vy + p.b * matrix.b * obj.vy, A;
    }, $.prototype.findIntersection = function(point, p) {
      var path = {};
      var particle = {};
      /** @type {number} */
      particle.vx = point.p1.x - p.p0.x;
      /** @type {number} */
      particle.vy = point.p1.y - p.p0.y;
      /** @type {number} */
      var e = particle.vx * p.dx + particle.vy * p.dy;
      if (0 > e) {
        path = particle;
      } else {
        var obj = {};
        /** @type {number} */
        obj.vx = point.p1.x - p.p1.x;
        /** @type {number} */
        obj.vy = point.p1.y - p.p1.y;
        /** @type {number} */
        e = obj.vx * p.dx + obj.vy * p.dy;
        path = e > 0 ? obj : this.projectVector(particle, p.lx, p.ly);
      }
      return path.p0 = {
        x : 0,
        y : 0
      }, path.p1 = {
        x : 0,
        y : 0
      }, path;
    }, $;
  }();
  eventHandle.Physics2D = elem;
}(Utils || (Utils = {}));
!function(eventHandle) {
  var elem = function() {
    /**
     * @param {?} not
     * @param {?} inplace
     * @return {undefined}
     */
    function filter(not, inplace) {
      this.saveDataId = not;
      this.totalLevels = inplace;
      /** @type {Array} */
      this.aLevelStore = new Array;
      /** @type {number} */
      var totalLevels = 0;
      for (;totalLevels < this.totalLevels;totalLevels++) {
        this.aLevelStore.push(0);
      }
      this.setInitialData();
    }
    return filter.prototype.setInitialData = function() {
      if ("undefined" != typeof Storage) {
        if (null != localStorage.getItem(this.saveDataId)) {
          this.aLevelStore = localStorage.getItem(this.saveDataId).split(",");
          var _idx;
          for (_idx in this.aLevelStore) {
            /** @type {number} */
            this.aLevelStore[_idx] = parseInt(this.aLevelStore[_idx]);
          }
        } else {
          this.saveData();
        }
      }
    }, filter.prototype.saveData = function() {
      if ("undefined" != typeof Storage) {
        /** @type {string} */
        var text = "";
        /** @type {number} */
        var p = 0;
        for (;p < this.aLevelStore.length;p++) {
          text += this.aLevelStore[p];
          if (p < this.aLevelStore.length - 1) {
            text += ",";
          }
        }
        localStorage.setItem(this.saveDataId, text);
      }
    }, filter;
  }();
  eventHandle.SaveDataHandler = elem;
}(Utils || (Utils = {}));
var requestAnimFrame = function() {
  return window.requestAnimationFrame || (window.webkitRequestAnimationFrame || (window.mozRequestAnimationFrame || (window.oRequestAnimationFrame || (window.msRequestAnimationFrame || function(after) {
    window.setTimeout(after, 1E3 / 60, (new Date).getTime());
  }))));
}();
var previousTime;
/** @type {(HTMLElement|null)} */
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 600, canvas.height = 800;
var canvasX;
var canvasY;
var canvasScaleX;
var canvasScaleY;
/** @type {(HTMLElement|null)} */
var div = document.getElementById("viewporter");
var sound;
var music;
/** @type {number} */
var audioType = 0;
/** @type {boolean} */
var muted = false;
var splash;
/** @type {number} */
var splashTimer = 0;
var assetLib;
var preAssetLib;
/** @type {boolean} */
var rotatePause = false;
/** @type {boolean} */
var manualPause = false;
/** @type {boolean} */
var isMobile = false;
/** @type {string} */
var gameState = "loading";
/** @type {Array} */
var aLangs = new Array("EN", "DE", "TR");
/** @type {string} */
var curLang = "";
/** @type {boolean} */
var isBugBrowser = false;
/** @type {boolean} */
var isIE10 = false;
if (navigator.userAgent.match(/MSIE\s([\d]+)/)) {
  /** @type {boolean} */
  isIE10 = true;
}
/** @type {string} */
var deviceAgent = navigator.userAgent.toLowerCase();
if (deviceAgent.match(/(iphone|ipod|ipad)/) || (deviceAgent.match(/(android)/) || (deviceAgent.match(/(iemobile)/) || (deviceAgent.match(/iphone/i) || (deviceAgent.match(/ipad/i) || (deviceAgent.match(/ipod/i) || (deviceAgent.match(/blackberry/i) || deviceAgent.match(/bada/i)))))))) {
  /** @type {boolean} */
  isMobile = true;
  if (deviceAgent.match(/(android)/)) {
    if (!/Chrome/.test(navigator.userAgent)) {
      /** @type {boolean} */
      isBugBrowser = true;
    }
  }
}
var userInput = new Utils.UserInput(canvas, isBugBrowser);
resizeCanvas(), window.onresize = function() {
  setTimeout(function() {
    resizeCanvas();
  }, 1);
}, window.addEventListener("load", function() {
  setTimeout(function() {
    resizeCanvas();
  }, 0);
  window.addEventListener("orientationchange", function() {
    resizeCanvas();
  }, false);
}), isIE10 || "undefined" == typeof window.AudioContext && ("undefined" == typeof window.webkitAudioContext && -1 != navigator.userAgent.indexOf("Android")) ? (audioType = 0, music = new Audio("audio/music.ogg"), music.addEventListener("ended", function() {
  /** @type {number} */
  this.currentTime = 0;
  this.play();
}, false), music.play()) : (audioType = 1, sound = new Howl({
  urls : ["audio/sound.ogg", "audio/sound.m4a"],
  sprite : {
    splash : [0, 1500],
    bounce1 : [2E3, 300],
    wall1 : [2500, 300],
    bounce2 : [3E3, 300],
    wall2 : [3500, 500],
    teleport : [4500, 750],
    start : [5500, 1500],
    reset : [7500, 1200],
    gem1 : [9E3, 750],
    gem2 : [10500, 750],
    gem3 : [12E3, 750],
    gem4 : [13500, 750],
    holed : [15E3, 2500],
    hit : [18E3, 500],
    mud : [19E3, 500],
    click : [2E4, 500]
  }
}), music = new Howl({
  urls : ["audio/music.ogg", "audio/music.m4a"],
  volume : 0.5,
  loop : true
}));
var panel;
var hud;
var background;
/** @type {number} */
var totalScore = 0;
/** @type {number} */
var levelScore = 0;
var levelNum;
var aScores;
/** @type {Array} */
var aTutorials = new Array;
var panelFrame;
var oLogoData = {};
var oLogoBut;
var ball;
var oHolePos;
var physics2D;
var level;
var gameTouchState;
var oPosData = {
  prevBallX : 0,
  prevBallY : 0,
  stageX : 0,
  stageY : 0,
  targStageX : 0,
  targStageY : 0,
  startDragX : 0,
  startDragY : 0,
  startStageX : 0,
  startStageY : 0
};
var aimX;
var aimY;
var targAimX;
var targAimY;
var vx;
var vy;
var arrow;
var scollBackInc;
/** @type {number} */
var levelWidth = 800;
/** @type {number} */
var levelHeight = 1E3;
/** @type {number} */
var buffer = 100;
var aPickUps;
var aBounces;
var courseNum;
var musicTween;
var saveDataHandler = new Utils.SaveDataHandler("miniPutt1", 2);
/** @type {Array} */
var aLevelData = new Array([{
  par : 2,
  aData : [{
    type : "tee",
    p0 : {
      x : 469,
      y : 732
    },
    p1 : {
      x : 469,
      y : 732
    }
  }, {
    type : "hole",
    p0 : {
      x : 322,
      y : 317
    },
    p1 : {
      x : 322,
      y : 317
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 455,
      y : 611
    },
    p1 : {
      x : 455,
      y : 611
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 428,
      y : 531
    },
    p1 : {
      x : 428,
      y : 531
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 400,
      y : 450
    },
    p1 : {
      x : 400,
      y : 450
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 373,
      y : 370
    },
    p1 : {
      x : 373,
      y : 370
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 396,
      y : 631
    },
    p1 : {
      x : 396,
      y : 631
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 369,
      y : 551
    },
    p1 : {
      x : 369,
      y : 551
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 341,
      y : 470
    },
    p1 : {
      x : 341,
      y : 470
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 314,
      y : 390
    },
    p1 : {
      x : 314,
      y : 390
    }
  }, {
    type : "wall",
    p0 : {
      x : 267,
      y : 196
    },
    p1 : {
      x : 177,
      y : 387
    }
  }, {
    type : "wall",
    p0 : {
      x : 286,
      y : 189
    },
    p1 : {
      x : 477,
      y : 280
    }
  }, {
    type : "wall",
    p0 : {
      x : 184,
      y : 274
    },
    p1 : {
      x : 401,
      y : 196
    }
  }, {
    type : "wall",
    p0 : {
      x : 607,
      y : 770
    },
    p1 : {
      x : 401,
      y : 196
    }
  }, {
    type : "wall",
    p0 : {
      x : 390,
      y : 848
    },
    p1 : {
      x : 607,
      y : 770
    }
  }, {
    type : "wall",
    p0 : {
      x : 184,
      y : 274
    },
    p1 : {
      x : 390,
      y : 848
    }
  }]
}, {
  par : 2,
  aData : [{
    type : "tee",
    p0 : {
      x : 236,
      y : 771
    },
    p1 : {
      x : 236,
      y : 771
    }
  }, {
    type : "hole",
    p0 : {
      x : 589,
      y : 409
    },
    p1 : {
      x : 589,
      y : 409
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 478,
      y : 318
    },
    p1 : {
      x : 478,
      y : 318
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 432,
      y : 362
    },
    p1 : {
      x : 432,
      y : 362
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 525,
      y : 367
    },
    p1 : {
      x : 525,
      y : 367
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 479,
      y : 411
    },
    p1 : {
      x : 479,
      y : 411
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 225,
      y : 489
    },
    p1 : {
      x : 225,
      y : 489
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 225,
      y : 553
    },
    p1 : {
      x : 225,
      y : 553
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 293,
      y : 489
    },
    p1 : {
      x : 293,
      y : 489
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 304,
      y : 379
    },
    p1 : {
      x : 304,
      y : 379
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 293,
      y : 553
    },
    p1 : {
      x : 293,
      y : 553
    }
  }, {
    type : "wall",
    p0 : {
      x : 89,
      y : 449
    },
    p1 : {
      x : 511,
      y : 28
    }
  }, {
    type : "wall",
    p0 : {
      x : 444,
      y : 136
    },
    p1 : {
      x : 865,
      y : 557
    }
  }, {
    type : "wall",
    p0 : {
      x : 667,
      y : 224
    },
    p1 : {
      x : 667,
      y : 820
    }
  }, {
    type : "wall",
    p0 : {
      x : 747,
      y : 831
    },
    p1 : {
      x : 151,
      y : 831
    }
  }, {
    type : "wall",
    p0 : {
      x : 947,
      y : 537
    },
    p1 : {
      x : 359,
      y : 442
    }
  }, {
    type : "wall",
    p0 : {
      x : 355,
      y : 441
    },
    p1 : {
      x : 259,
      y : 1029
    }
  }, {
    type : "wall",
    p0 : {
      x : 757,
      y : 245
    },
    p1 : {
      x : 161,
      y : 245
    }
  }, {
    type : "wall",
    p0 : {
      x : 177,
      y : 245
    },
    p1 : {
      x : 177,
      y : 841
    }
  }]
}, {
  par : 4,
  aData : [{
    type : "tee",
    p0 : {
      x : 624,
      y : 801
    },
    p1 : {
      x : 624,
      y : 801
    }
  }, {
    type : "hole",
    p0 : {
      x : 175,
      y : 801
    },
    p1 : {
      x : 175,
      y : 801
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 622,
      y : 409
    },
    p1 : {
      x : 622,
      y : 409
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 622,
      y : 510
    },
    p1 : {
      x : 622,
      y : 510
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 621,
      y : 611
    },
    p1 : {
      x : 621,
      y : 611
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 354,
      y : 708
    },
    p1 : {
      x : 354,
      y : 708
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 452,
      y : 711
    },
    p1 : {
      x : 452,
      y : 711
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 354,
      y : 608
    },
    p1 : {
      x : 354,
      y : 608
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 452,
      y : 611
    },
    p1 : {
      x : 452,
      y : 611
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 175,
      y : 409
    },
    p1 : {
      x : 175,
      y : 409
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 175,
      y : 510
    },
    p1 : {
      x : 175,
      y : 510
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 174,
      y : 611
    },
    p1 : {
      x : 174,
      y : 611
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 177,
      y : 710
    },
    p1 : {
      x : 177,
      y : 710
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 263,
      y : 357
    },
    p1 : {
      x : 263,
      y : 357
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 354,
      y : 354
    },
    p1 : {
      x : 354,
      y : 354
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 452,
      y : 357
    },
    p1 : {
      x : 452,
      y : 357
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 543,
      y : 360
    },
    p1 : {
      x : 543,
      y : 360
    }
  }, {
    type : "wall",
    p0 : {
      x : 94,
      y : 301
    },
    p1 : {
      x : 250,
      y : 145
    }
  }, {
    type : "wall",
    p0 : {
      x : 712,
      y : 301
    },
    p1 : {
      x : 556,
      y : 145
    }
  }, {
    type : "wall",
    p0 : {
      x : 403,
      y : 301
    },
    p1 : {
      x : 247,
      y : 145
    }
  }, {
    type : "wall",
    p0 : {
      x : 403,
      y : 301
    },
    p1 : {
      x : 559,
      y : 145
    }
  }, {
    type : "wall",
    p0 : {
      x : 540,
      y : 1100
    },
    p1 : {
      x : 540,
      y : 410
    }
  }, {
    type : "wall",
    p0 : {
      x : 260,
      y : 410
    },
    p1 : {
      x : 260,
      y : 1100
    }
  }, {
    type : "wall",
    p0 : {
      x : 100,
      y : 190
    },
    p1 : {
      x : 700,
      y : 190
    }
  }, {
    type : "wall",
    p0 : {
      x : 700,
      y : 880
    },
    p1 : {
      x : 700,
      y : 190
    }
  }, {
    type : "wall",
    p0 : {
      x : 100,
      y : 880
    },
    p1 : {
      x : 700,
      y : 880
    }
  }, {
    type : "wall",
    p0 : {
      x : 100,
      y : 190
    },
    p1 : {
      x : 100,
      y : 880
    }
  }, {
    type : "slope0",
    p0 : {
      x : 256,
      y : 414
    },
    p1 : {
      x : 540,
      y : 874
    }
  }]
}, {
  par : 4,
  aData : [{
    type : "tee",
    p0 : {
      x : 543,
      y : 769
    },
    p1 : {
      x : 543,
      y : 769
    }
  }, {
    type : "hole",
    p0 : {
      x : 168,
      y : 310
    },
    p1 : {
      x : 168,
      y : 310
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 242,
      y : 532
    },
    p1 : {
      x : 242,
      y : 532
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 391,
      y : 371
    },
    p1 : {
      x : 391,
      y : 371
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 633,
      y : 329
    },
    p1 : {
      x : 633,
      y : 329
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 636,
      y : 510
    },
    p1 : {
      x : 636,
      y : 510
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 500,
      y : 447
    },
    p1 : {
      x : 500,
      y : 447
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 188,
      y : 760
    },
    p1 : {
      x : 188,
      y : 760
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 281,
      y : 299
    },
    p1 : {
      x : 281,
      y : 299
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 147,
      y : 436
    },
    p1 : {
      x : 147,
      y : 436
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 645,
      y : 678
    },
    p1 : {
      x : 645,
      y : 678
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 448,
      y : 680
    },
    p1 : {
      x : 448,
      y : 680
    }
  }, {
    type : "wall",
    p0 : {
      x : 592,
      y : 441
    },
    p1 : {
      x : 506,
      y : 526
    }
  }, {
    type : "wall",
    p0 : {
      x : 734,
      y : 338
    },
    p1 : {
      x : 592,
      y : 196
    }
  }, {
    type : "wall",
    p0 : {
      x : 588,
      y : 701
    },
    p1 : {
      x : 504,
      y : 701
    }
  }, {
    type : "wall",
    p0 : {
      x : 588,
      y : 628
    },
    p1 : {
      x : 588,
      y : 697
    }
  }, {
    type : "wall",
    p0 : {
      x : 277,
      y : 625
    },
    p1 : {
      x : 277,
      y : 826
    }
  }, {
    type : "wall",
    p0 : {
      x : 281,
      y : 425
    },
    p1 : {
      x : 281,
      y : 343
    }
  }, {
    type : "wall",
    p0 : {
      x : 734,
      y : 718
    },
    p1 : {
      x : 592,
      y : 860
    }
  }, {
    type : "wall",
    p0 : {
      x : 355,
      y : 718
    },
    p1 : {
      x : 497,
      y : 860
    }
  }, {
    type : "wall",
    p0 : {
      x : 100,
      y : 826
    },
    p1 : {
      x : 700,
      y : 826
    }
  }, {
    type : "wall",
    p0 : {
      x : 504,
      y : 628
    },
    p1 : {
      x : 588,
      y : 628
    }
  }, {
    type : "wall",
    p0 : {
      x : 277,
      y : 625
    },
    p1 : {
      x : 390,
      y : 625
    }
  }, {
    type : "wall",
    p0 : {
      x : 280,
      y : 425
    },
    p1 : {
      x : 198,
      y : 425
    }
  }, {
    type : "wall",
    p0 : {
      x : 504,
      y : 701
    },
    p1 : {
      x : 504,
      y : 632
    }
  }, {
    type : "wall",
    p0 : {
      x : 391,
      y : 625
    },
    p1 : {
      x : 391,
      y : 826
    }
  }, {
    type : "wall",
    p0 : {
      x : 100,
      y : 236
    },
    p1 : {
      x : 700,
      y : 236
    }
  }, {
    type : "wall",
    p0 : {
      x : 700,
      y : 880
    },
    p1 : {
      x : 700,
      y : 190
    }
  }, {
    type : "wall",
    p0 : {
      x : 100,
      y : 190
    },
    p1 : {
      x : 100,
      y : 880
    }
  }, {
    type : "slope1",
    p0 : {
      x : 188,
      y : 420
    },
    p1 : {
      x : 290,
      y : 614
    }
  }, {
    type : "slope2",
    p0 : {
      x : 291,
      y : 245
    },
    p1 : {
      x : 475,
      y : 427
    }
  }]
}, {
  par : 4,
  aData : [{
    type : "tee",
    p0 : {
      x : 395,
      y : 454
    },
    p1 : {
      x : 395,
      y : 454
    }
  }, {
    type : "hole",
    p0 : {
      x : 394,
      y : 575
    },
    p1 : {
      x : 394,
      y : 575
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 215,
      y : 264
    },
    p1 : {
      x : 215,
      y : 264
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 587,
      y : 264
    },
    p1 : {
      x : 587,
      y : 264
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 215,
      y : 814
    },
    p1 : {
      x : 215,
      y : 814
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 587,
      y : 814
    },
    p1 : {
      x : 587,
      y : 814
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 557,
      y : 522
    },
    p1 : {
      x : 557,
      y : 522
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 243,
      y : 522
    },
    p1 : {
      x : 243,
      y : 522
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 504,
      y : 586
    },
    p1 : {
      x : 504,
      y : 586
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 288,
      y : 586
    },
    p1 : {
      x : 288,
      y : 586
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 504,
      y : 457
    },
    p1 : {
      x : 504,
      y : 457
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 288,
      y : 457
    },
    p1 : {
      x : 288,
      y : 457
    }
  }, {
    type : "wall",
    p0 : {
      x : 400,
      y : 258
    },
    p1 : {
      x : 192,
      y : 173
    }
  }, {
    type : "wall",
    p0 : {
      x : 399,
      y : 258
    },
    p1 : {
      x : 608,
      y : 173
    }
  }, {
    type : "wall",
    p0 : {
      x : 399,
      y : 801
    },
    p1 : {
      x : 191,
      y : 886
    }
  }, {
    type : "wall",
    p0 : {
      x : 398,
      y : 801
    },
    p1 : {
      x : 607,
      y : 886
    }
  }, {
    type : "wall",
    p0 : {
      x : -28,
      y : 512
    },
    p1 : {
      x : 197,
      y : 512
    }
  }, {
    type : "wall",
    p0 : {
      x : 611,
      y : 512
    },
    p1 : {
      x : 836,
      y : 512
    }
  }, {
    type : "wall",
    p0 : {
      x : 100,
      y : 866
    },
    p1 : {
      x : 700,
      y : 866
    }
  }, {
    type : "wall",
    p0 : {
      x : 286,
      y : 512
    },
    p1 : {
      x : 511,
      y : 512
    }
  }, {
    type : "wall",
    p0 : {
      x : 100,
      y : 197
    },
    p1 : {
      x : 700,
      y : 197
    }
  }, {
    type : "wall",
    p0 : {
      x : 640,
      y : 880
    },
    p1 : {
      x : 640,
      y : 190
    }
  }, {
    type : "wall",
    p0 : {
      x : 160,
      y : 190
    },
    p1 : {
      x : 160,
      y : 880
    }
  }, {
    type : "slope0",
    p0 : {
      x : 254,
      y : 303
    },
    p1 : {
      x : 540,
      y : 403
    }
  }, {
    type : "slope2",
    p0 : {
      x : 250,
      y : 631
    },
    p1 : {
      x : 536,
      y : 733
    }
  }]
}, {
  par : 5,
  aData : [{
    type : "tee",
    p0 : {
      x : 190,
      y : 244
    },
    p1 : {
      x : 190,
      y : 244
    }
  }, {
    type : "hole",
    p0 : {
      x : 343,
      y : 498
    },
    p1 : {
      x : 343,
      y : 498
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 486,
      y : 700
    },
    p1 : {
      x : 486,
      y : 700
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 493,
      y : 378
    },
    p1 : {
      x : 493,
      y : 378
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 340,
      y : 572
    },
    p1 : {
      x : 340,
      y : 572
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 486,
      y : 542
    },
    p1 : {
      x : 486,
      y : 542
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 214,
      y : 392
    },
    p1 : {
      x : 214,
      y : 392
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 199,
      y : 819
    },
    p1 : {
      x : 199,
      y : 819
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 595,
      y : 805
    },
    p1 : {
      x : 595,
      y : 805
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 610,
      y : 543
    },
    p1 : {
      x : 610,
      y : 543
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 614,
      y : 259
    },
    p1 : {
      x : 614,
      y : 259
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 339,
      y : 255
    },
    p1 : {
      x : 339,
      y : 255
    }
  }, {
    type : "wall",
    p0 : {
      x : 716,
      y : 302
    },
    p1 : {
      x : 574,
      y : 160
    }
  }, {
    type : "wall",
    p0 : {
      x : 217,
      y : 303
    },
    p1 : {
      x : 75,
      y : 444
    }
  }, {
    type : "wall",
    p0 : {
      x : 705,
      y : 774
    },
    p1 : {
      x : 564,
      y : 916
    }
  }, {
    type : "wall",
    p0 : {
      x : 432,
      y : 635
    },
    p1 : {
      x : 432,
      y : 421
    }
  }, {
    type : "wall",
    p0 : {
      x : 253,
      y : 420
    },
    p1 : {
      x : 432,
      y : 420
    }
  }, {
    type : "wall",
    p0 : {
      x : 252,
      y : 755
    },
    p1 : {
      x : 252,
      y : 420
    }
  }, {
    type : "wall",
    p0 : {
      x : 252,
      y : 755
    },
    p1 : {
      x : 547,
      y : 755
    }
  }, {
    type : "wall",
    p0 : {
      x : 547,
      y : 755
    },
    p1 : {
      x : 547,
      y : 301
    }
  }, {
    type : "wall",
    p0 : {
      x : 2,
      y : 300
    },
    p1 : {
      x : 546,
      y : 300
    }
  }, {
    type : "wall",
    p0 : {
      x : 132,
      y : 190
    },
    p1 : {
      x : 676,
      y : 190
    }
  }, {
    type : "wall",
    p0 : {
      x : 676,
      y : 880
    },
    p1 : {
      x : 676,
      y : 190
    }
  }, {
    type : "wall",
    p0 : {
      x : 132,
      y : 880
    },
    p1 : {
      x : 676,
      y : 880
    }
  }, {
    type : "wall",
    p0 : {
      x : 132,
      y : 190
    },
    p1 : {
      x : 132,
      y : 880
    }
  }, {
    type : "slope0",
    p0 : {
      x : 135,
      y : 455
    },
    p1 : {
      x : 251,
      y : 636
    }
  }, {
    type : "slope2",
    p0 : {
      x : 550,
      y : 455
    },
    p1 : {
      x : 672,
      y : 636
    }
  }]
}, {
  par : 4,
  aData : [{
    type : "tee",
    p0 : {
      x : 398,
      y : 277
    },
    p1 : {
      x : 398,
      y : 277
    }
  }, {
    type : "hole",
    p0 : {
      x : 403,
      y : 780
    },
    p1 : {
      x : 403,
      y : 780
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 245,
      y : 461
    },
    p1 : {
      x : 245,
      y : 461
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 557,
      y : 623
    },
    p1 : {
      x : 557,
      y : 623
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 426,
      y : 645
    },
    p1 : {
      x : 426,
      y : 645
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 319,
      y : 645
    },
    p1 : {
      x : 319,
      y : 645
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 456,
      y : 412
    },
    p1 : {
      x : 456,
      y : 412
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 349,
      y : 412
    },
    p1 : {
      x : 349,
      y : 412
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 191,
      y : 542
    },
    p1 : {
      x : 191,
      y : 542
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 605,
      y : 541
    },
    p1 : {
      x : 605,
      y : 541
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 318,
      y : 719
    },
    p1 : {
      x : 318,
      y : 719
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 457,
      y : 337
    },
    p1 : {
      x : 457,
      y : 337
    }
  }, {
    type : "wall",
    p0 : {
      x : 361,
      y : 691
    },
    p1 : {
      x : 905,
      y : 691
    }
  }, {
    type : "wall",
    p0 : {
      x : -128,
      y : 348
    },
    p1 : {
      x : 416,
      y : 347
    }
  }, {
    type : "wall",
    p0 : {
      x : 401,
      y : 178
    },
    p1 : {
      x : 700,
      y : 534
    }
  }, {
    type : "wall",
    p0 : {
      x : 401,
      y : 890
    },
    p1 : {
      x : 700,
      y : 534
    }
  }, {
    type : "wall",
    p0 : {
      x : 101,
      y : 534
    },
    p1 : {
      x : 401,
      y : 890
    }
  }, {
    type : "wall",
    p0 : {
      x : 401,
      y : 178
    },
    p1 : {
      x : 101,
      y : 534
    }
  }, {
    type : "mud",
    p0 : {
      x : 258,
      y : 445
    },
    p1 : {
      x : 550,
      y : 604
    }
  }]
}, {
  par : 4,
  aData : [{
    type : "tee",
    p0 : {
      x : 289,
      y : 275
    },
    p1 : {
      x : 289,
      y : 275
    }
  }, {
    type : "hole",
    p0 : {
      x : 529,
      y : 419
    },
    p1 : {
      x : 529,
      y : 419
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 546,
      y : 650
    },
    p1 : {
      x : 546,
      y : 650
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 504,
      y : 730
    },
    p1 : {
      x : 504,
      y : 730
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 437,
      y : 773
    },
    p1 : {
      x : 437,
      y : 773
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 355,
      y : 773
    },
    p1 : {
      x : 355,
      y : 773
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 303,
      y : 722
    },
    p1 : {
      x : 303,
      y : 722
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 284,
      y : 646
    },
    p1 : {
      x : 284,
      y : 646
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 538,
      y : 348
    },
    p1 : {
      x : 538,
      y : 348
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 463,
      y : 412
    },
    p1 : {
      x : 463,
      y : 412
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 592,
      y : 427
    },
    p1 : {
      x : 592,
      y : 427
    }
  }, {
    type : "wall",
    p0 : {
      x : 546,
      y : 477
    },
    p1 : {
      x : 540,
      y : 520
    }
  }, {
    type : "wall",
    p0 : {
      x : 485,
      y : 513
    },
    p1 : {
      x : 540,
      y : 520
    }
  }, {
    type : "wall",
    p0 : {
      x : 491,
      y : 470
    },
    p1 : {
      x : 485,
      y : 513
    }
  }, {
    type : "wall",
    p0 : {
      x : 546,
      y : 477
    },
    p1 : {
      x : 491,
      y : 470
    }
  }, {
    type : "wall",
    p0 : {
      x : 398,
      y : 230
    },
    p1 : {
      x : 398,
      y : 636
    }
  }, {
    type : "wall",
    p0 : {
      x : 203,
      y : 201
    },
    p1 : {
      x : 680,
      y : 268
    }
  }, {
    type : "wall",
    p0 : {
      x : 595,
      y : 877
    },
    p1 : {
      x : 680,
      y : 268
    }
  }, {
    type : "wall",
    p0 : {
      x : 118,
      y : 810
    },
    p1 : {
      x : 595,
      y : 877
    }
  }, {
    type : "wall",
    p0 : {
      x : 203,
      y : 201
    },
    p1 : {
      x : 118,
      y : 810
    }
  }, {
    type : "mud",
    p0 : {
      x : 247,
      y : 333
    },
    p1 : {
      x : 395,
      y : 392
    }
  }, {
    type : "mud",
    p0 : {
      x : 169,
      y : 441
    },
    p1 : {
      x : 317,
      y : 500
    }
  }, {
    type : "slope0",
    p0 : {
      x : 396,
      y : 302
    },
    p1 : {
      x : 682,
      y : 375
    }
  }, {
    type : "mud",
    p0 : {
      x : 251,
      y : 557
    },
    p1 : {
      x : 399,
      y : 616
    }
  }, {
    type : "slope2",
    p0 : {
      x : 400,
      y : 549
    },
    p1 : {
      x : 686,
      y : 620
    }
  }, {
    type : "slope0",
    p0 : {
      x : 107,
      y : 673
    },
    p1 : {
      x : 659,
      y : 886
    }
  }]
}, {
  par : 5,
  aData : [{
    type : "tee",
    p0 : {
      x : 604,
      y : 266
    },
    p1 : {
      x : 604,
      y : 266
    }
  }, {
    type : "hole",
    p0 : {
      x : 196,
      y : 825
    },
    p1 : {
      x : 196,
      y : 825
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 413,
      y : 813
    },
    p1 : {
      x : 413,
      y : 813
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 413,
      y : 681
    },
    p1 : {
      x : 413,
      y : 681
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 560,
      y : 720
    },
    p1 : {
      x : 560,
      y : 720
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 272,
      y : 646
    },
    p1 : {
      x : 272,
      y : 646
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 413,
      y : 530
    },
    p1 : {
      x : 413,
      y : 530
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 560,
      y : 569
    },
    p1 : {
      x : 560,
      y : 569
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 272,
      y : 495
    },
    p1 : {
      x : 272,
      y : 495
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 413,
      y : 382
    },
    p1 : {
      x : 413,
      y : 382
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 560,
      y : 421
    },
    p1 : {
      x : 560,
      y : 421
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 272,
      y : 347
    },
    p1 : {
      x : 272,
      y : 347
    }
  }, {
    type : "wall",
    p0 : {
      x : 126,
      y : 752
    },
    p1 : {
      x : 438,
      y : 752
    }
  }, {
    type : "wall",
    p0 : {
      x : 420,
      y : 323
    },
    p1 : {
      x : 718,
      y : 398
    }
  }, {
    type : "wall",
    p0 : {
      x : 677,
      y : 747
    },
    p1 : {
      x : 590,
      y : 899
    }
  }, {
    type : "wall",
    p0 : {
      x : 674,
      y : 194
    },
    p1 : {
      x : 599,
      y : 511
    }
  }, {
    type : "wall",
    p0 : {
      x : 599,
      y : 512
    },
    p1 : {
      x : 680,
      y : 743
    }
  }, {
    type : "wall",
    p0 : {
      x : 207,
      y : 162
    },
    p1 : {
      x : 207,
      y : 592
    }
  }, {
    type : "wall",
    p0 : {
      x : 207,
      y : 594
    },
    p1 : {
      x : 133,
      y : 729
    }
  }, {
    type : "wall",
    p0 : {
      x : 674,
      y : 880
    },
    p1 : {
      x : 130,
      y : 880
    }
  }, {
    type : "wall",
    p0 : {
      x : 130,
      y : 190
    },
    p1 : {
      x : 130,
      y : 880
    }
  }, {
    type : "wall",
    p0 : {
      x : 130,
      y : 191
    },
    p1 : {
      x : 674,
      y : 190
    }
  }, {
    type : "wall",
    p0 : {
      x : 413,
      y : 595
    },
    p1 : {
      x : 743,
      y : 678
    }
  }, {
    type : "wall",
    p0 : {
      x : 138,
      y : 386
    },
    p1 : {
      x : 436,
      y : 461
    }
  }, {
    type : "slope1",
    p0 : {
      x : 140,
      y : 185
    },
    p1 : {
      x : 330,
      y : 752
    }
  }, {
    type : "slope3",
    p0 : {
      x : 444,
      y : 757
    },
    p1 : {
      x : 666,
      y : 872
    }
  }]
}], [{
  par : 3,
  aData : [{
    type : "tee",
    p0 : {
      x : 391,
      y : 288
    },
    p1 : {
      x : 391,
      y : 288
    }
  }, {
    type : "hole",
    p0 : {
      x : 392,
      y : 747
    },
    p1 : {
      x : 392,
      y : 747
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 323,
      y : 742
    },
    p1 : {
      x : 323,
      y : 742
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 234,
      y : 762
    },
    p1 : {
      x : 234,
      y : 762
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 237,
      y : 610
    },
    p1 : {
      x : 237,
      y : 610
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 246,
      y : 463
    },
    p1 : {
      x : 246,
      y : 463
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 273,
      y : 363
    },
    p1 : {
      x : 273,
      y : 363
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 461,
      y : 742
    },
    p1 : {
      x : 461,
      y : 742
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 558,
      y : 762
    },
    p1 : {
      x : 558,
      y : 762
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 550,
      y : 610
    },
    p1 : {
      x : 550,
      y : 610
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 541,
      y : 463
    },
    p1 : {
      x : 541,
      y : 463
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 514,
      y : 363
    },
    p1 : {
      x : 514,
      y : 363
    }
  }, {
    type : "wall",
    p0 : {
      x : 610,
      y : 351
    },
    p1 : {
      x : 468,
      y : 210
    }
  }, {
    type : "wall",
    p0 : {
      x : 170,
      y : 351
    },
    p1 : {
      x : 311,
      y : 210
    }
  }, {
    type : "wall",
    p0 : {
      x : 678,
      y : 730
    },
    p1 : {
      x : 536,
      y : 871
    }
  }, {
    type : "wall",
    p0 : {
      x : 130,
      y : 730
    },
    p1 : {
      x : 271,
      y : 871
    }
  }, {
    type : "wall",
    p0 : {
      x : 316,
      y : 411
    },
    p1 : {
      x : 316,
      y : 618
    }
  }, {
    type : "wall",
    p0 : {
      x : 474,
      y : 411
    },
    p1 : {
      x : 474,
      y : 618
    }
  }, {
    type : "wall",
    p0 : {
      x : 568,
      y : 222
    },
    p1 : {
      x : 665,
      y : 852
    }
  }, {
    type : "wall",
    p0 : {
      x : 210,
      y : 221
    },
    p1 : {
      x : 143,
      y : 859
    }
  }, {
    type : "wall",
    p0 : {
      x : 144,
      y : 847
    },
    p1 : {
      x : 664,
      y : 847
    }
  }, {
    type : "wall",
    p0 : {
      x : 210,
      y : 220
    },
    p1 : {
      x : 568,
      y : 220
    }
  }, {
    type : "water",
    p0 : {
      x : 315,
      y : 422
    },
    p1 : {
      x : 476,
      y : 641
    }
  }]
}, {
  par : 3,
  aData : [{
    type : "tee",
    p0 : {
      x : 591,
      y : 733
    },
    p1 : {
      x : 591,
      y : 733
    }
  }, {
    type : "hole",
    p0 : {
      x : 388,
      y : 261
    },
    p1 : {
      x : 388,
      y : 261
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 473,
      y : 700
    },
    p1 : {
      x : 473,
      y : 700
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 375,
      y : 673
    },
    p1 : {
      x : 375,
      y : 673
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 273,
      y : 658
    },
    p1 : {
      x : 273,
      y : 658
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 273,
      y : 558
    },
    p1 : {
      x : 273,
      y : 558
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 273,
      y : 467
    },
    p1 : {
      x : 273,
      y : 467
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 310,
      y : 293
    },
    p1 : {
      x : 310,
      y : 293
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 273,
      y : 377
    },
    p1 : {
      x : 273,
      y : 377
    }
  }, {
    type : "wall",
    p0 : {
      x : 212,
      y : 290
    },
    p1 : {
      x : -103,
      y : 290
    }
  }, {
    type : "wall",
    p0 : {
      x : 215,
      y : 286
    },
    p1 : {
      x : 343,
      y : 158
    }
  }, {
    type : "wall",
    p0 : {
      x : 207,
      y : 567
    },
    p1 : {
      x : 118,
      y : 806
    }
  }, {
    type : "wall",
    p0 : {
      x : 208,
      y : 565
    },
    p1 : {
      x : -107,
      y : 565
    }
  }, {
    type : "wall",
    p0 : {
      x : 671,
      y : 672
    },
    p1 : {
      x : 602,
      y : 858
    }
  }, {
    type : "wall",
    p0 : {
      x : 670,
      y : 677
    },
    p1 : {
      x : 447,
      y : 583
    }
  }, {
    type : "wall",
    p0 : {
      x : 670,
      y : 872
    },
    p1 : {
      x : 447,
      y : 778
    }
  }, {
    type : "wall",
    p0 : {
      x : 446,
      y : 183
    },
    p1 : {
      x : 446,
      y : 583
    }
  }, {
    type : "wall",
    p0 : {
      x : 446,
      y : 778
    },
    p1 : {
      x : 126,
      y : 778
    }
  }, {
    type : "wall",
    p0 : {
      x : 445,
      y : 180
    },
    p1 : {
      x : 130,
      y : 180
    }
  }, {
    type : "wall",
    p0 : {
      x : 127,
      y : 180
    },
    p1 : {
      x : 127,
      y : 776
    }
  }, {
    type : "mud",
    p0 : {
      x : 221,
      y : 636
    },
    p1 : {
      x : 332,
      y : 686
    }
  }, {
    type : "water",
    p0 : {
      x : 328,
      y : 340
    },
    p1 : {
      x : 441,
      y : 517
    }
  }, {
    type : "water",
    p0 : {
      x : 103,
      y : 299
    },
    p1 : {
      x : 216,
      y : 558
    }
  }]
}, {
  par : 5,
  aData : [{
    type : "tee",
    p0 : {
      x : 588,
      y : 240
    },
    p1 : {
      x : 588,
      y : 240
    }
  }, {
    type : "hole",
    p0 : {
      x : 169,
      y : 804
    },
    p1 : {
      x : 169,
      y : 804
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 315,
      y : 519
    },
    p1 : {
      x : 315,
      y : 519
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 624,
      y : 639
    },
    p1 : {
      x : 624,
      y : 639
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 429,
      y : 311
    },
    p1 : {
      x : 429,
      y : 311
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 206,
      y : 307
    },
    p1 : {
      x : 206,
      y : 307
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 319,
      y : 273
    },
    p1 : {
      x : 319,
      y : 273
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 174,
      y : 402
    },
    p1 : {
      x : 174,
      y : 402
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 464,
      y : 396
    },
    p1 : {
      x : 464,
      y : 396
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 264,
      y : 797
    },
    p1 : {
      x : 264,
      y : 797
    }
  }, {
    type : "wall",
    p0 : {
      x : 332,
      y : 715
    },
    p1 : {
      x : 546,
      y : 715
    }
  }, {
    type : "wall",
    p0 : {
      x : -83,
      y : 700
    },
    p1 : {
      x : 212,
      y : 700
    }
  }, {
    type : "wall",
    p0 : {
      x : 213,
      y : 699
    },
    p1 : {
      x : 57,
      y : 543
    }
  }, {
    type : "wall",
    p0 : {
      x : 92,
      y : 308
    },
    p1 : {
      x : 248,
      y : 152
    }
  }, {
    type : "wall",
    p0 : {
      x : 543,
      y : 308
    },
    p1 : {
      x : 387,
      y : 152
    }
  }, {
    type : "wall",
    p0 : {
      x : 545,
      y : 551
    },
    p1 : {
      x : 545,
      y : 310
    }
  }, {
    type : "wall",
    p0 : {
      x : 330,
      y : 716
    },
    p1 : {
      x : 330,
      y : 942
    }
  }, {
    type : "wall",
    p0 : {
      x : 100,
      y : 190
    },
    p1 : {
      x : 700,
      y : 190
    }
  }, {
    type : "wall",
    p0 : {
      x : 700,
      y : 880
    },
    p1 : {
      x : 700,
      y : 190
    }
  }, {
    type : "wall",
    p0 : {
      x : 100,
      y : 880
    },
    p1 : {
      x : 700,
      y : 880
    }
  }, {
    type : "wall",
    p0 : {
      x : 100,
      y : 190
    },
    p1 : {
      x : 100,
      y : 880
    }
  }, {
    type : "water",
    p0 : {
      x : 242,
      y : 332
    },
    p1 : {
      x : 389,
      y : 454
    }
  }, {
    type : "water",
    p0 : {
      x : 333,
      y : 720
    },
    p1 : {
      x : 554,
      y : 878
    }
  }, {
    type : "slope3",
    p0 : {
      x : 320,
      y : 563
    },
    p1 : {
      x : 555,
      y : 704
    }
  }]
}, {
  par : 6,
  aData : [{
    type : "tee",
    p0 : {
      x : 582,
      y : 496
    },
    p1 : {
      x : 582,
      y : 496
    }
  }, {
    type : "hole",
    p0 : {
      x : 555,
      y : 253
    },
    p1 : {
      x : 555,
      y : 253
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 607,
      y : 647
    },
    p1 : {
      x : 607,
      y : 647
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 588,
      y : 770
    },
    p1 : {
      x : 588,
      y : 770
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 426,
      y : 798
    },
    p1 : {
      x : 426,
      y : 798
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 197,
      y : 416
    },
    p1 : {
      x : 197,
      y : 416
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 377,
      y : 682
    },
    p1 : {
      x : 377,
      y : 682
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 212,
      y : 534
    },
    p1 : {
      x : 212,
      y : 534
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 319,
      y : 285
    },
    p1 : {
      x : 319,
      y : 285
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 263,
      y : 634
    },
    p1 : {
      x : 263,
      y : 634
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 204,
      y : 292
    },
    p1 : {
      x : 204,
      y : 292
    }
  }, {
    type : "wall",
    p0 : {
      x : 62,
      y : 322
    },
    p1 : {
      x : 222,
      y : 154
    }
  }, {
    type : "wall",
    p0 : {
      x : 421,
      y : 245
    },
    p1 : {
      x : 255,
      y : 148
    }
  }, {
    type : "wall",
    p0 : {
      x : 487,
      y : 131
    },
    p1 : {
      x : 421,
      y : 244
    }
  }, {
    type : "wall",
    p0 : {
      x : 568,
      y : 900
    },
    p1 : {
      x : 728,
      y : 731
    }
  }, {
    type : "wall",
    p0 : {
      x : 518,
      y : 727
    },
    p1 : {
      x : 449,
      y : 706
    }
  }, {
    type : "wall",
    p0 : {
      x : 555,
      y : 600
    },
    p1 : {
      x : 518,
      y : 726
    }
  }, {
    type : "wall",
    p0 : {
      x : 486,
      y : 580
    },
    p1 : {
      x : 555,
      y : 600
    }
  }, {
    type : "wall",
    p0 : {
      x : 449,
      y : 706
    },
    p1 : {
      x : 486,
      y : 580
    }
  }, {
    type : "wall",
    p0 : {
      x : 470,
      y : 347
    },
    p1 : {
      x : 647,
      y : 263
    }
  }, {
    type : "wall",
    p0 : {
      x : 515,
      y : 444
    },
    p1 : {
      x : 470,
      y : 347
    }
  }, {
    type : "wall",
    p0 : {
      x : 694,
      y : 360
    },
    p1 : {
      x : 516,
      y : 443
    }
  }, {
    type : "wall",
    p0 : {
      x : 350,
      y : 780
    },
    p1 : {
      x : 290,
      y : 857
    }
  }, {
    type : "wall",
    p0 : {
      x : 209,
      y : 669
    },
    p1 : {
      x : 349,
      y : 780
    }
  }, {
    type : "wall",
    p0 : {
      x : 149,
      y : 746
    },
    p1 : {
      x : 209,
      y : 670
    }
  }, {
    type : "wall",
    p0 : {
      x : 319,
      y : 470
    },
    p1 : {
      x : 253,
      y : 463
    }
  }, {
    type : "wall",
    p0 : {
      x : 332,
      y : 349
    },
    p1 : {
      x : 319,
      y : 470
    }
  }, {
    type : "wall",
    p0 : {
      x : 266,
      y : 342
    },
    p1 : {
      x : 332,
      y : 349
    }
  }, {
    type : "wall",
    p0 : {
      x : 253,
      y : 463
    },
    p1 : {
      x : 266,
      y : 343
    }
  }, {
    type : "wall",
    p0 : {
      x : 675,
      y : 840
    },
    p1 : {
      x : 160,
      y : 869
    }
  }, {
    type : "wall",
    p0 : {
      x : 638,
      y : 175
    },
    p1 : {
      x : 675,
      y : 839
    }
  }, {
    type : "wall",
    p0 : {
      x : 122,
      y : 204
    },
    p1 : {
      x : 638,
      y : 175
    }
  }, {
    type : "wall",
    p0 : {
      x : 159,
      y : 869
    },
    p1 : {
      x : 122,
      y : 206
    }
  }, {
    type : "water",
    p0 : {
      x : 298,
      y : 341
    },
    p1 : {
      x : 522,
      y : 606
    }
  }]
}, {
  par : 6,
  aData : [{
    type : "tee",
    p0 : {
      x : 200,
      y : 775
    },
    p1 : {
      x : 200,
      y : 775
    }
  }, {
    type : "hole",
    p0 : {
      x : 398,
      y : 703
    },
    p1 : {
      x : 398,
      y : 703
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 239,
      y : 433
    },
    p1 : {
      x : 239,
      y : 433
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 562,
      y : 431
    },
    p1 : {
      x : 562,
      y : 431
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 562,
      y : 504
    },
    p1 : {
      x : 562,
      y : 504
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 482,
      y : 504
    },
    p1 : {
      x : 482,
      y : 504
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 239,
      y : 504
    },
    p1 : {
      x : 239,
      y : 504
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 563,
      y : 364
    },
    p1 : {
      x : 563,
      y : 364
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 483,
      y : 364
    },
    p1 : {
      x : 483,
      y : 364
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 403,
      y : 364
    },
    p1 : {
      x : 403,
      y : 364
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 323,
      y : 364
    },
    p1 : {
      x : 323,
      y : 364
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 243,
      y : 364
    },
    p1 : {
      x : 243,
      y : 364
    }
  }, {
    type : "wall",
    p0 : {
      x : 442,
      y : 586
    },
    p1 : {
      x : 364,
      y : 586
    }
  }, {
    type : "wall",
    p0 : {
      x : 755,
      y : 275
    },
    p1 : {
      x : 541,
      y : 275
    }
  }, {
    type : "wall",
    p0 : {
      x : 698,
      y : 388
    },
    p1 : {
      x : 586,
      y : 277
    }
  }, {
    type : "wall",
    p0 : {
      x : 302,
      y : 721
    },
    p1 : {
      x : 566,
      y : 1336
    }
  }, {
    type : "wall",
    p0 : {
      x : 214,
      y : 666
    },
    p1 : {
      x : -1,
      y : 666
    }
  }, {
    type : "wall",
    p0 : {
      x : 46,
      y : 275
    },
    p1 : {
      x : 261,
      y : 275
    }
  }, {
    type : "wall",
    p0 : {
      x : 104,
      y : 388
    },
    p1 : {
      x : 215,
      y : 277
    }
  }, {
    type : "wall",
    p0 : {
      x : 426,
      y : 430
    },
    p1 : {
      x : 162,
      y : 1046
    }
  }, {
    type : "wall",
    p0 : {
      x : 316,
      y : 450
    },
    p1 : {
      x : 370,
      y : 542
    }
  }, {
    type : "wall",
    p0 : {
      x : 316,
      y : 449
    },
    p1 : {
      x : 421,
      y : 429
    }
  }, {
    type : "wall",
    p0 : {
      x : 81,
      y : 853
    },
    p1 : {
      x : 721,
      y : 853
    }
  }, {
    type : "wall",
    p0 : {
      x : 81,
      y : 204
    },
    p1 : {
      x : 721,
      y : 204
    }
  }, {
    type : "wall",
    p0 : {
      x : 657,
      y : 866
    },
    p1 : {
      x : 657,
      y : 197
    }
  }, {
    type : "wall",
    p0 : {
      x : 145,
      y : 197
    },
    p1 : {
      x : 145,
      y : 866
    }
  }, {
    type : "water",
    p0 : {
      x : 315,
      y : 762
    },
    p1 : {
      x : 660,
      y : 843
    }
  }, {
    type : "water",
    p0 : {
      x : 140,
      y : 206
    },
    p1 : {
      x : 662,
      y : 287
    }
  }, {
    type : "slope0",
    p0 : {
      x : 145,
      y : 418
    },
    p1 : {
      x : 653,
      y : 581
    }
  }]
}, {
  par : 6,
  aData : [{
    type : "tee",
    p0 : {
      x : 416,
      y : 817
    },
    p1 : {
      x : 416,
      y : 817
    }
  }, {
    type : "hole",
    p0 : {
      x : 189,
      y : 264
    },
    p1 : {
      x : 189,
      y : 264
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 605,
      y : 804
    },
    p1 : {
      x : 605,
      y : 804
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 515,
      y : 724
    },
    p1 : {
      x : 515,
      y : 724
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 605,
      y : 724
    },
    p1 : {
      x : 605,
      y : 724
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 515,
      y : 804
    },
    p1 : {
      x : 515,
      y : 804
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 402,
      y : 358
    },
    p1 : {
      x : 402,
      y : 358
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 312,
      y : 278
    },
    p1 : {
      x : 312,
      y : 278
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 402,
      y : 278
    },
    p1 : {
      x : 402,
      y : 278
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 313,
      y : 825
    },
    p1 : {
      x : 313,
      y : 825
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 312,
      y : 358
    },
    p1 : {
      x : 312,
      y : 358
    }
  }, {
    type : "wall",
    p0 : {
      x : 277,
      y : 427
    },
    p1 : {
      x : 341,
      y : 427
    }
  }, {
    type : "wall",
    p0 : {
      x : 381,
      y : 764
    },
    p1 : {
      x : 445,
      y : 764
    }
  }, {
    type : "wall",
    p0 : {
      x : 243,
      y : 229
    },
    p1 : {
      x : 384,
      y : 87
    }
  }, {
    type : "wall",
    p0 : {
      x : 243,
      y : 229
    },
    p1 : {
      x : 102,
      y : 87
    }
  }, {
    type : "wall",
    p0 : {
      x : 638,
      y : 643
    },
    p1 : {
      x : 780,
      y : 502
    }
  }, {
    type : "wall",
    p0 : {
      x : 638,
      y : 643
    },
    p1 : {
      x : 780,
      y : 785
    }
  }, {
    type : "wall",
    p0 : {
      x : 249,
      y : 891
    },
    p1 : {
      x : 108,
      y : 750
    }
  }, {
    type : "wall",
    p0 : {
      x : 200,
      y : 352
    },
    p1 : {
      x : 58,
      y : 211
    }
  }, {
    type : "wall",
    p0 : {
      x : 200,
      y : 352
    },
    p1 : {
      x : 58,
      y : 493
    }
  }, {
    type : "wall",
    p0 : {
      x : 132,
      y : 190
    },
    p1 : {
      x : 676,
      y : 190
    }
  }, {
    type : "wall",
    p0 : {
      x : 676,
      y : 880
    },
    p1 : {
      x : 676,
      y : 190
    }
  }, {
    type : "wall",
    p0 : {
      x : 132,
      y : 880
    },
    p1 : {
      x : 676,
      y : 880
    }
  }, {
    type : "wall",
    p0 : {
      x : 132,
      y : 190
    },
    p1 : {
      x : 132,
      y : 880
    }
  }, {
    type : "water",
    p0 : {
      x : 451,
      y : 188
    },
    p1 : {
      x : 676,
      y : 646
    }
  }, {
    type : "water",
    p0 : {
      x : 247,
      y : 433
    },
    p1 : {
      x : 373,
      y : 775
    }
  }, {
    type : "mud",
    p0 : {
      x : 379,
      y : 651
    },
    p1 : {
      x : 447,
      y : 769
    }
  }, {
    type : "slope0",
    p0 : {
      x : 135,
      y : 433
    },
    p1 : {
      x : 242,
      y : 873
    }
  }, {
    type : "slope2",
    p0 : {
      x : 377,
      y : 432
    },
    p1 : {
      x : 448,
      y : 646
    }
  }]
}, {
  par : 7,
  aData : [{
    type : "tee",
    p0 : {
      x : 192,
      y : 271
    },
    p1 : {
      x : 192,
      y : 271
    }
  }, {
    type : "hole",
    p0 : {
      x : 592,
      y : 808
    },
    p1 : {
      x : 592,
      y : 808
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 424,
      y : 728
    },
    p1 : {
      x : 424,
      y : 728
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 202,
      y : 411
    },
    p1 : {
      x : 202,
      y : 411
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 358,
      y : 395
    },
    p1 : {
      x : 358,
      y : 395
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 508,
      y : 285
    },
    p1 : {
      x : 508,
      y : 285
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 338,
      y : 285
    },
    p1 : {
      x : 338,
      y : 285
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 518,
      y : 395
    },
    p1 : {
      x : 518,
      y : 395
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 192,
      y : 557
    },
    p1 : {
      x : 192,
      y : 557
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 204,
      y : 708
    },
    p1 : {
      x : 204,
      y : 708
    }
  }, {
    type : "wall",
    p0 : {
      x : 193,
      y : 768
    },
    p1 : {
      x : 139,
      y : 714
    }
  }, {
    type : "wall",
    p0 : {
      x : 193,
      y : 334
    },
    p1 : {
      x : 139,
      y : 389
    }
  }, {
    type : "wall",
    p0 : {
      x : 442,
      y : 139
    },
    p1 : {
      x : 662,
      y : 359
    }
  }, {
    type : "wall",
    p0 : {
      x : 149,
      y : 331
    },
    p1 : {
      x : 460,
      y : 331
    }
  }, {
    type : "wall",
    p0 : {
      x : 140,
      y : 214
    },
    p1 : {
      x : 569,
      y : 214
    }
  }, {
    type : "wall",
    p0 : {
      x : 245,
      y : 447
    },
    p1 : {
      x : 461,
      y : 447
    }
  }, {
    type : "wall",
    p0 : {
      x : 463,
      y : 448
    },
    p1 : {
      x : 463,
      y : 571
    }
  }, {
    type : "wall",
    p0 : {
      x : 572,
      y : 215
    },
    p1 : {
      x : 571,
      y : 571
    }
  }, {
    type : "wall",
    p0 : {
      x : 574,
      y : 572
    },
    p1 : {
      x : 665,
      y : 572
    }
  }, {
    type : "wall",
    p0 : {
      x : 371,
      y : 572
    },
    p1 : {
      x : 463,
      y : 572
    }
  }, {
    type : "wall",
    p0 : {
      x : 139,
      y : 217
    },
    p1 : {
      x : 139,
      y : 785
    }
  }, {
    type : "wall",
    p0 : {
      x : 245,
      y : 453
    },
    p1 : {
      x : 245,
      y : 663
    }
  }, {
    type : "wall",
    p0 : {
      x : 246,
      y : 664
    },
    p1 : {
      x : 369,
      y : 663
    }
  }, {
    type : "wall",
    p0 : {
      x : 114,
      y : 772
    },
    p1 : {
      x : 369,
      y : 772
    }
  }, {
    type : "wall",
    p0 : {
      x : 370,
      y : 774
    },
    p1 : {
      x : 370,
      y : 865
    }
  }, {
    type : "wall",
    p0 : {
      x : 660,
      y : 866
    },
    p1 : {
      x : 660,
      y : 572
    }
  }, {
    type : "wall",
    p0 : {
      x : 370,
      y : 866
    },
    p1 : {
      x : 658,
      y : 866
    }
  }, {
    type : "wall",
    p0 : {
      x : 370,
      y : 572
    },
    p1 : {
      x : 370,
      y : 664
    }
  }, {
    type : "slope2",
    p0 : {
      x : 470,
      y : 436
    },
    p1 : {
      x : 559,
      y : 584
    }
  }, {
    type : "water",
    p0 : {
      x : 475,
      y : 673
    },
    p1 : {
      x : 552,
      y : 752
    }
  }]
}, {
  par : 7,
  aData : [{
    type : "tee",
    p0 : {
      x : 207,
      y : 249
    },
    p1 : {
      x : 207,
      y : 249
    }
  }, {
    type : "hole",
    p0 : {
      x : 427,
      y : 675
    },
    p1 : {
      x : 427,
      y : 675
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 603,
      y : 671
    },
    p1 : {
      x : 603,
      y : 671
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 609,
      y : 550
    },
    p1 : {
      x : 609,
      y : 550
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 313,
      y : 278
    },
    p1 : {
      x : 313,
      y : 278
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 606,
      y : 278
    },
    p1 : {
      x : 606,
      y : 278
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 311,
      y : 390
    },
    p1 : {
      x : 311,
      y : 390
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 311,
      y : 749
    },
    p1 : {
      x : 311,
      y : 749
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 208,
      y : 749
    },
    p1 : {
      x : 208,
      y : 749
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 254,
      y : 809
    },
    p1 : {
      x : 254,
      y : 809
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 499,
      y : 671
    },
    p1 : {
      x : 499,
      y : 671
    }
  }, {
    type : "wall",
    p0 : {
      x : 264,
      y : 246
    },
    p1 : {
      x : 399,
      y : 111
    }
  }, {
    type : "wall",
    p0 : {
      x : 256,
      y : 904
    },
    p1 : {
      x : 391,
      y : 769
    }
  }, {
    type : "wall",
    p0 : {
      x : 116,
      y : 758
    },
    p1 : {
      x : 251,
      y : 893
    }
  }, {
    type : "wall",
    p0 : {
      x : 257,
      y : 430
    },
    p1 : {
      x : 257,
      y : 747
    }
  }, {
    type : "wall",
    p0 : {
      x : 257,
      y : -315
    },
    p1 : {
      x : 257,
      y : 333
    }
  }, {
    type : "wall",
    p0 : {
      x : 568,
      y : 781
    },
    p1 : {
      x : 704,
      y : 646
    }
  }, {
    type : "wall",
    p0 : {
      x : 573,
      y : 162
    },
    p1 : {
      x : 709,
      y : 297
    }
  }, {
    type : "wall",
    p0 : {
      x : 361,
      y : 360
    },
    p1 : {
      x : 553,
      y : 360
    }
  }, {
    type : "wall",
    p0 : {
      x : 361,
      y : 448
    },
    p1 : {
      x : 553,
      y : 448
    }
  }, {
    type : "wall",
    p0 : {
      x : 365,
      y : 736
    },
    p1 : {
      x : 674,
      y : 736
    }
  }, {
    type : "wall",
    p0 : {
      x : 157,
      y : 202
    },
    p1 : {
      x : 669,
      y : 202
    }
  }, {
    type : "wall",
    p0 : {
      x : 675,
      y : 191
    },
    p1 : {
      x : 675,
      y : 737
    }
  }, {
    type : "wall",
    p0 : {
      x : 361,
      y : 589
    },
    p1 : {
      x : 553,
      y : 589
    }
  }, {
    type : "wall",
    p0 : {
      x : 157,
      y : 202
    },
    p1 : {
      x : 157,
      y : 850
    }
  }, {
    type : "wall",
    p0 : {
      x : 160,
      y : 850
    },
    p1 : {
      x : 358,
      y : 850
    }
  }, {
    type : "wall",
    p0 : {
      x : 359,
      y : 590
    },
    p1 : {
      x : 359,
      y : 873
    }
  }, {
    type : "slope2",
    p0 : {
      x : 352,
      y : 211
    },
    p1 : {
      x : 559,
      y : 270
    }
  }, {
    type : "slope2",
    p0 : {
      x : 559,
      y : 358
    },
    p1 : {
      x : 666,
      y : 464
    }
  }, {
    type : "water",
    p0 : {
      x : 353,
      y : 296
    },
    p1 : {
      x : 559,
      y : 368
    }
  }, {
    type : "water",
    p0 : {
      x : 353,
      y : 455
    },
    p1 : {
      x : 559,
      y : 520
    }
  }]
}, {
  par : 6,
  aData : [{
    type : "tee",
    p0 : {
      x : 485,
      y : 235
    },
    p1 : {
      x : 485,
      y : 235
    }
  }, {
    type : "hole",
    p0 : {
      x : 395,
      y : 518
    },
    p1 : {
      x : 395,
      y : 518
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 454,
      y : 659
    },
    p1 : {
      x : 454,
      y : 659
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 394,
      y : 659
    },
    p1 : {
      x : 394,
      y : 659
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 334,
      y : 659
    },
    p1 : {
      x : 334,
      y : 659
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 459,
      y : 370
    },
    p1 : {
      x : 459,
      y : 370
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 399,
      y : 370
    },
    p1 : {
      x : 399,
      y : 370
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 339,
      y : 370
    },
    p1 : {
      x : 339,
      y : 370
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 484,
      y : 566
    },
    p1 : {
      x : 484,
      y : 566
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 484,
      y : 516
    },
    p1 : {
      x : 484,
      y : 516
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 484,
      y : 466
    },
    p1 : {
      x : 484,
      y : 466
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 314,
      y : 566
    },
    p1 : {
      x : 314,
      y : 566
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 314,
      y : 516
    },
    p1 : {
      x : 314,
      y : 516
    }
  }, {
    type : "pickUp",
    p0 : {
      x : 314,
      y : 466
    },
    p1 : {
      x : 314,
      y : 466
    }
  }, {
    type : "wall",
    p0 : {
      x : 541,
      y : 473
    },
    p1 : {
      x : 562,
      y : 494
    }
  }, {
    type : "wall",
    p0 : {
      x : 237,
      y : 540
    },
    p1 : {
      x : 258,
      y : 561
    }
  }, {
    type : "wall",
    p0 : {
      x : 135,
      y : 187
    },
    p1 : {
      x : 660,
      y : 187
    }
  }, {
    type : "wall",
    p0 : {
      x : 660,
      y : 857
    },
    p1 : {
      x : 660,
      y : 187
    }
  }, {
    type : "wall",
    p0 : {
      x : 135,
      y : 857
    },
    p1 : {
      x : 660,
      y : 857
    }
  }, {
    type : "wall",
    p0 : {
      x : 135,
      y : 187
    },
    p1 : {
      x : 135,
      y : 857
    }
  }, {
    type : "water",
    p0 : {
      x : 353,
      y : 166
    },
    p1 : {
      x : 441,
      y : 292
    }
  }, {
    type : "water",
    p0 : {
      x : 353,
      y : 738
    },
    p1 : {
      x : 441,
      y : 864
    }
  }, {
    type : "mud",
    p0 : {
      x : 151,
      y : 451
    },
    p1 : {
      x : 181,
      y : 581
    }
  }, {
    type : "mud",
    p0 : {
      x : 611,
      y : 451
    },
    p1 : {
      x : 641,
      y : 581
    }
  }, {
    type : "water",
    p0 : {
      x : 352,
      y : 552
    },
    p1 : {
      x : 440,
      y : 587
    }
  }, {
    type : "water",
    p0 : {
      x : 352,
      y : 444
    },
    p1 : {
      x : 440,
      y : 479
    }
  }, {
    type : "slope2",
    p0 : {
      x : 144,
      y : 590
    },
    p1 : {
      x : 655,
      y : 735
    }
  }, {
    type : "slope0",
    p0 : {
      x : 144,
      y : 296
    },
    p1 : {
      x : 655,
      y : 440
    }
  }]
}]);
/** @type {Location} */
var loc = window.top.location;
loadPreAssets();

