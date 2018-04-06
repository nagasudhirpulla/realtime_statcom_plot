var playerEl_g = document.getElementById("videoTimeSlider");
var frameTimingVar_;
var frameToFetch_ = 0;
var framesToIncrement_ = 5;
var videoPlayInterval_ = 1000;

var timeFrames = {
    "frames": [] // array of {timestamp: timeStr, x: x, y: y} elements
};

function setCachePlayInterval(){
	videoPlayInterval_ = Number(document.getElementById("cachePlayIntervalInput").value);
}

function getPlayerSliderVals() {
    return {min: playerEl_g.min, max: playerEl_g.max, pos: playerEl_g.value};
}

function setPlayerSliderPosition(val) {
    var sliderVals = getPlayerSliderVals();
    if (val < sliderVals.max && val > sliderVals.min) {
        playerEl_g.value = val;
    }
}

function setPlayerSliderMaxVal(val) {
    if (val > 0) {
        playerEl_g.max = val;
    }
}

//Jump to a frame
function jumpToFrame(framenumber) {
    if (framenumber < 1440 && framenumber >= 0) {
        frameToFetch_ = parseInt(framenumber);
    }
}

function jumpToFrameGUI() {
    jumpToFrame(document.getElementById("jumpToFrameInput").value);
    getFromFrames();
}

function updateFrameFromSlider() {
    jumpToFrame(playerEl_g.value);
    getFromFrames();
}

//set frame rate
function setFrameRate(framerate) {
    if (framerate < timeFrames.frames.length) {
        framesToIncrement_ = parseInt(framerate);
    }
}

function setFrameRateGUI() {
    setFrameRate(document.getElementById("frameRateInput").value);
}

//Timing function
function startFrameFetching() {
    // stop real time fetching also
    pauseFetching();
    //videoCanvas_.getContext("2d").clearRect(0, 0, borderCanvasLayer.getgetCanvas().width, borderCanvasLayer.getgetCanvas().height);
    pauseFrameFetching();
    console.log("Starting Frame Data Fetch", "info");
    setIsFrameBusy(false);
    frameTimingVar_ = setInterval(getFromFrames, videoPlayInterval_);
}

//Timing function
function pauseFrameFetching() {
    //frameToFetch = 0;
    console.log("Pausing Frame Data Fetch", "warning");
    document.getElementById("playbackStatusPaused").innerHTML = "\t(PlayBack Paused)";
    clearInterval(frameTimingVar_);
}

var isFrameBusy_ = false;

//Timing function
function getFromFrames() {
    if (getIsFrameBusy() == true) {
        return;
    }
    setIsFrameBusy(true);
    //express frame fetch start
    //document.getElementById("wrapper").style.border = "2px solid rgb(0,255,0)";
    var frameData = timeFrames.frames[frameToFetch_];
    document.getElementById('videoTimeSlider').value = frameToFetch_;

    var timeStringToDisplay = frameData['timestamp'];

    try {
        updatePlot([frameData['x']], [frameData['y']], "Satna Statcom Operating Point at " + timeStringToDisplay);
    }
    catch (ex) {

    }
    document.getElementById("playbackStatus").innerHTML = timeStringToDisplay;

    setPlayerSliderPosition(frameToFetch_);

    frameToFetch_ += framesToIncrement_;

    document.getElementById("playbackStatusPaused").innerHTML = "";

    if (frameToFetch_ >= timeFrames.frames.length) {
        jumpToFrame(0);
        pauseFrameFetching();
    }
    setIsFrameBusy(false);
    //express server fetch stop / finish
    //document.getElementById("wrapper").style.border = "2px solid #999999";
}
//isBusy getter
function getIsFrameBusy() {
    return isFrameBusy_;
}

//isBusy setter
function setIsFrameBusy(val) {
    isFrameBusy_ = val;
}