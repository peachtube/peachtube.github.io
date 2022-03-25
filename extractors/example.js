const fullscreenElementStyle = "position: fixed !important; width: 100% !important; height: 100% !important; left: 0 !important; top: 0 !important; z-index: 2147483647 !important; visibility: visible !important;" // 2147483647 is maximum value fof z-index

let videos = {}
let hls = false
let currentQuality = 0
let channelName = "Example"
let channelId = channelName
let channelAvatar = "https://picsum.photos/200/200"
let video

const setQuality = (target = 'max') => {
    if(target == 'max') target = Math.max(...Object.keys(videos))
    currentQuality = target
    let time = video.currentTime
    video.src = videos[String(target)]
    video.currentTime = time
}

const play = () => video.play()
const pause = () => video.pause()
const setCurrentTime = (time) => {video.currentTime = time}
const getPlayingStatus = () => !video.paused
const getQualities = () => Object.keys(videos)
const getDuration = () => video.duration
const getControls = () => true
const getCurrentTime = () => video.currentTime
const getCurrentQuality = () => Number(currentQuality)
const getChannelName = () => channelName
const getChannelId = () => channelId
const getChannelAvatar = () => channelAvatar


function extractVideo(){
    for(let source of document.querySelector('#video').childNodes){
        if(!source.querySelector) continue
        let url = source.src
        let quality = url.split('/')[7]
        videos[quality] = url
    }
    console.log('Extracted videos: ')
    console.log(videos)
    video = document.querySelector("#video")
    video.controls = false
    video.setAttribute('style', fullscreenElementStyle)
    video.setAttribute('preload', 'metadata')
    video.setAttribute('muted', 'muted')
    setQuality()
}

extractVideo()