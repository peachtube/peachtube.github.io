    const fullscreenElementStyle = "position: fixed !important; width: 100% !important; height: 100% !important; left: 0 !important; top: 0 !important; z-index: 2147483647 !important; visibility: visible !important;" // 2147483647 is maximum value fof z-index

    var videos = {}

    function setQuality(target = 'max') {
        if(target == 'max')
            target = Math.max(...Object.keys(videos))
        var video = getVideo()
        var time = video.currentTime
        video.setAttribute('src', videos[String(target)])
        video.currentTime = time
    }

    function getQuality(){
        return(Object.keys(videos))
    }

    function extractVideo(){
        console.log(data)
        video = getVideo()
        document.getElementsByTagName("body")[0].innerHTML = '<video src="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_5mb.mp4"></video>'
        videos[360] = "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_5mb.mp4"
        videos[720] = "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_5mb.mp4"
        videos[1080] = "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_5mb.mp4"
        video.setAttribute('src', document.getElementById("trailerplayer_html5").src)
        video.setAttribute('style', fullscreenElementStyle)
        video.setAttribute('controls', 'controls')
        video.setAttribute('muted', 'muted')
        setQuality()
        console.log(videos)
    }

    document.addEventListener("DOMContentLoaded", function(event) {
        console.log("DOM fully loaded and parsed");
        extractVideo()
    });