let initialised = false
let extractors = []
let topics = []

// Base class for all topics
class Topic{
    // Constructor
    constructor(name){
        this.name = name    // String
        this.needVideo = 0  // Number (of videos needed)
        this.queque = []    // Array of Objects
        this.query = ''     // String
        topics.push(this)
    }
    // If video needed, push it to Dart side. Otherwise, add video to queque.
    publish(video){ 
        if (this.needVideo) this.pushVideo(video)
        else this.queque.push(video)
    }
    // Pushes video to Dart side.
    pushVideo(video){
        video["topic"] = this.name
        this.needVideo--
        if(!initialised){
            console.log(video)
            return
        }
        window.flutter_inappwebview.callHandler('addSearchVideo', video)
    }
    // Pushes random video to Dart side.
    pushRandom(){
        let random = this.queque.splice(Math.floor(Math.random()*this.queque.length), 1)[0]
        this.pushVideo(random)
    }
    // Changing this.needVideo to given number. Called from Dart side!
    requestVideo(num){
        console.log("Requested " + num + ' videos for topic ' + this.name)
        this.needVideo = num
        notifyDart()
    }
    // Manages queque
    tick(){
        if(this.needVideo > 0){
            if(this.queque.length > 0) this.pushRandom()
            else {
                for(let extractor of extractors) extractor.parseVideos(this)
            }
        }
    }
}

// Triggers .tick() for all topics 
function notifyDart(){ 
    for(let topic of topics)
        topic.tick()
}

// Performs CORS request
async function corsRequest(url) {
    url = encodeURIComponent(url)
    return await fetch('http://cors.proxy?url=' + url)
}

// Returns document parsed from given URL
async function parseDomFromUrl(url){
    response = await (await corsRequest(url)).text()
    parser = new DOMParser()
    return parser.parseFromString(response, "text/html")
}

// Cleans queque, set query, request videos
function setSearchQuery(query, topic = search){
    console.log('ExtractorJS: Called setSearchQuery with query ' + query)
    topic.queque = []
    topic.query = query
    for(let i of extractors)
        i.page[topic] = 0
    topic.requestVideo(3)
    notifyDart()
}

// Base class for any extractor
class Extractor{
    // Constructor
    constructor(name){
        this.name = name
        this.inProgress = Object()
        this.page = Object()
        extractors.push(this)
    }
    // Refer to Example
    async extract(doc){
        throw("EngineJS: Error: Called Extractor.extract, but method is not defined")
    }
    // Refer to Example
    async getDocument(topic){
        throw("EngineJS: Error: Called Extractor.getDocument, but method is not defined")
    }
    async parseVideos(topic){
        if(this.inProgress[topic]) return
        if(!(topic in this.page)) this.page[topic] = 0
        this.inProgress[topic] = true
        try{
            let doc = await this.getDocument(topic)
            let result = await this.extract(doc)
            for(let video of result){
                topic.publish(video)
                notifyDart()
            }
        }
        finally{
            this.inProgress[topic] = false
            this.page[topic]++
        }
    }
}

class Example extends Extractor{
    async getDocument(topic){
        if(topic.name == 'search') return await parseDomFromUrl("https://peachtube.github.io/example/page_" + (this.page[topic] + 1) + ".html?query=" + topic.query.replace(' ', '+')) // TODO
        if(topic.name == 'related') return await parseDomFromUrl("https://peachtube.github.io/example/page_" + (this.page[topic] + 1) + ".html?query=" + topic.query.replace(' ', '+')) // TODO
        if(topic.name == 'trending') return await parseDomFromUrl("https://peachtube.github.io/example/page_" + (this.page[topic] + 1) + ".html") // TODO
    }
    extract(doc){
        let result = []
        for(let video of doc.getElementById('videos').childNodes){
            if(!video.querySelector) continue
            console.log(video)
            let videoInfo = Object()
            videoInfo.poster = video.querySelector('img').src
            videoInfo.preview = video.querySelector('video').src
            videoInfo.url = "https://peachtube.github.io/example/" + video.querySelector('a').getAttribute('href')
            videoInfo.title = video.querySelector('a').textContent
            videoInfo.channel = "Example Channel"
            videoInfo.channelUrl = "ExampleChannel"
            videoInfo.avatarUrl = 'https://images.emojiterra.com/google/noto-emoji/v2.034/512px/1f351.png'
            videoInfo.duration = Math.floor(Math.random() * 100)
            result.push(videoInfo)
        }
        return result;
    }
}

let search = new Topic("search")
let related = new Topic("related")
let trending = new Topic("trending")

let example = new Example()

function initialise(test = false){
    console.log("EngineJs: Platform initialised");
    initialised = !test
    trending.requestVideo(4)
}

initialise()