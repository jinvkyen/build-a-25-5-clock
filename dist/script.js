const { useState, useEffect, useRef } = React;

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("session"); // "session" or "break"
  const timeoutRef = useRef(null);

  // Format seconds as mm:ss with leading zeros
  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.
    toString().
    padStart(2, "0")}`;
  };

  // Toggle timer start/pause
  const toggleTimer = () => setIsRunning(prev => !prev);

  // Reset all settings and timer
  const resetTimer = () => {
    setIsRunning(false);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setMode("session");
    clearTimeout(timeoutRef.current);
    const beep = document.getElementById("beep");
    beep.pause();
    beep.currentTime = 0;
  };

  // Adjust session length (only when timer is not running)
  const adjustSession = delta => {
    if (!isRunning) {
      setSessionLength(prev => {
        const newVal = Math.min(60, Math.max(1, prev + delta));
        if (mode === "session") setTimeLeft(newVal * 60);
        return newVal;
      });
    }
  };

  // Adjust break length (only when timer is not running)
  const adjustBreak = delta => {
    if (!isRunning) {
      setBreakLength(prev => {
        const newVal = Math.min(60, Math.max(1, prev + delta));
        if (mode === "break") setTimeLeft(newVal * 60);
        return newVal;
      });
    }
  };

  // Countdown effect: runs only when isRunning changes.
  useEffect(() => {
    let timer = null;
    if (isRunning) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          // Decrement if there's time left, otherwise return 0.
          return prev > 0 ? prev - 1 : 0;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  // When timeLeft hits 0, play the beep and after 1 second switch modes.
  useEffect(() => {
    if (timeLeft === 0) {
      const beep = document.getElementById("beep");
      beep.play();
      timeoutRef.current = setTimeout(() => {
        setMode(prevMode => {
          const newMode = prevMode === "session" ? "break" : "session";
          setTimeLeft(
          newMode === "session" ? sessionLength * 60 : breakLength * 60);

          return newMode;
        });
      }, 1000);
    }
  }, [timeLeft, sessionLength, breakLength]);

  // Cleanup timeout on unmount.
  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return /*#__PURE__*/(
    React.createElement("div", { id: "container" }, /*#__PURE__*/
    React.createElement("div", { id: "length-controls" }, /*#__PURE__*/
    React.createElement("div", null, /*#__PURE__*/
    React.createElement("h2", { id: "break-label" }, "Break Length"), /*#__PURE__*/
    React.createElement("button", { id: "break-decrement", onClick: () => adjustBreak(-1) }, "-"), /*#__PURE__*/


    React.createElement("span", { id: "break-length" }, breakLength), /*#__PURE__*/
    React.createElement("button", { id: "break-increment", onClick: () => adjustBreak(1) }, "+")), /*#__PURE__*/



    React.createElement("div", null, /*#__PURE__*/
    React.createElement("h2", { id: "session-label" }, "Session Length"), /*#__PURE__*/
    React.createElement("button", { id: "session-decrement", onClick: () => adjustSession(-1) }, "-"), /*#__PURE__*/


    React.createElement("span", { id: "session-length" }, sessionLength), /*#__PURE__*/
    React.createElement("button", { id: "session-increment", onClick: () => adjustSession(1) }, "+"))), /*#__PURE__*/





    React.createElement("div", { className: "timer" }, /*#__PURE__*/
    React.createElement("h3", { id: "time-left" }, formatTime(timeLeft)), /*#__PURE__*/
    React.createElement("h2", { id: "timer-label" }, mode === "session" ? "Session" : "Break"), /*#__PURE__*/
    React.createElement("div", { className: "timer-controls" }, /*#__PURE__*/
    React.createElement("button", { id: "start_stop", onClick: toggleTimer }, /*#__PURE__*/
    React.createElement("i", {
      className: `ph-duotone ${isRunning ? "ph-pause" : "ph-play"}` })), /*#__PURE__*/


    React.createElement("button", { id: "reset", onClick: resetTimer }, /*#__PURE__*/
    React.createElement("i", { className: "ph-duotone ph-clock-clockwise" })))), /*#__PURE__*/



    React.createElement("audio", {
      id: "beep",
      src: "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" })));



}

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("app"));