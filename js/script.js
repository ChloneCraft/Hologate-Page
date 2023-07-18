    const playPauseBtn = document.querySelector(".playPauseButton")
    const videoWrapper = document.querySelector(".video-wrapper")
    const video = document.querySelector("video")
    const fullscreenButton = document.querySelector(".fullscreenButton")
    const currentTime = document.querySelector(".current-time")
    const totalTime = document.querySelector(".total-time")
    const timelineContainer = document.querySelector(".timeline-container")
    const muteButton = document.querySelector(".muteButton")
    var muted = false
    var TimeoutID
    let wake = true

    video.addEventListener("click", test)

    function togglePlay() {
      video.paused ? video.play() : video.pause();
      
      
    }
    function test() {
      if (video.paused) {
        video.play()
        wake = false
      } else if (wake) {
        video.pause()
      } else {
        clearTimeout(TimeoutID)
        wake = true
        videoWrapper.classList.add("wake")
        TimeoutID = setTimeout(function() {wake = false; videoWrapper.classList.remove("wake")}, 3000)
      }
      
    }

    //Volume

    muteButton.addEventListener("click", toggleMute) 

    function toggleMute() {
      video.muted = !video.muted
      if (video.muted) {
        videoWrapper.classList.add("muted")
      } else {
        videoWrapper.classList.remove("muted")
      }
    }


    //Timeline
    timelineContainer.addEventListener("mousemove", handleTimelineUpdate)
    timelineContainer.addEventListener("mousedown", toggleScrubbing)
    document.addEventListener("mouseup", e => {
      if (isScrubbing) toggleScrubbing(e)
    })
    document.addEventListener("mousemove", e => {
      if (isScrubbing) handleTimelineUpdate(e)
    })

    let isScrubbing = false
    function toggleScrubbing(e) {
      const rect = timelineContainer.getBoundingClientRect()
      const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
      isScrubbing = (e.buttons & 1) === 1
      videoWrapper.classList.toggle("scrubbing", isScrubbing)
      if (isScrubbing) {
        wasPaused = video.paused
        video.pause()
      } else {
        video.currentTime = percent * video.duration
        if (!wasPaused) video.play()
      }

      handleTimelineUpdate(e)
    }

    function handleTimelineUpdate(e) {
      const rect = timelineContainer.getBoundingClientRect()
      const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
      timelineContainer.style.setProperty("--preview-position", percent)

      if (isScrubbing) {
        e.preventDefault()
        timelineContainer.style.setProperty("--progress-position", percent)
      }
    }

    //duration
    video.addEventListener("loadeddata", () => {
      totalTime.textContent = formatDuration(video.duration)
    })

    video.addEventListener("timeupdate", () => {
      currentTime.textContent = formatDuration(video.currentTime)
      const percent = video.currentTime / video.duration
      timelineContainer.style.setProperty("--progress-position", percent)
    })

    const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
      minimumIntegerDigits: 2
    })
    function formatDuration(time) {
      const seconds = Math.floor(time % 60)
      const minutes = Math.floor(time /60) % 60
      return `${minutes}:${leadingZeroFormatter.format(seconds)}`
    }

    //Fullscreen
    fullscreenButton.addEventListener("click", toggleFullscreenMode)

    function toggleFullscreenMode() {
      if (document.fullscreenElement == null) {
        videoWrapper.requestFullscreen()
      } else {
        document.exitFullscreen();
      }
    }

    document.addEventListener("fullscreenchange", () => {
      videoWrapper.classList.toggle("fullscreen", document.fullscreenElement)
    })

    //Play/Pause
    video.addEventListener("play", () => {
      videoWrapper.classList.remove("paused")
    })
    video.addEventListener("pause", () => {
      videoWrapper.classList.add("paused")
    })