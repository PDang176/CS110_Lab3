// URL for the Twitterfeed server
const url = "http://ec2-18-209-247-77.compute-1.amazonaws.com:3000/feed/random?q=weather";

// List of all tweets
const tweets = [];

// Set of all tweet ids seen
const tweetIDs = new Set();

// String in the search bar
var searchString;

// Fetch 10 new tweets removing all duplicates then call refreshTweets
function fetchTweets(){
    // Checking if fetch tweets is paused
    let paused = document.getElementById('pausebox').checked;
    if(paused){
        return;
    }

    fetch(url)
        .then(res => res.json())
        .then(data =>{
            // Remove Duplicates
            console.log(data);

            // // Refresh Page
            // refreshTweets();
    })
}

// Refresh the page to display new tweets
function refreshTweets(){
    // feel free to use a more complicated heuristics like in-place-patch, for simplicity, we will clear all tweets and append all tweets back
    // {@link https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript}
    while (tweetContainer.firstChild) {
        tweetContainer.removeChild(tweetContainer.firstChild);
    }

    // create an unordered list to hold the tweets
    // {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement}
    const tweetList = document.createElement("ul");
    // append the tweetList to the tweetContainer
    // {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild}
    tweetContainer.appendChild(tweetList);

    // all tweet objects (no duplicates) stored in tweets variable

    // filter on search text
    // {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter}
    const filteredResult = tweets.filter(tweet => tweet.text.toLowerCase().indexOf(searchString) !== -1);
    // sort by date
    // {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort}
    const sortedResult = filteredResult.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    // execute the arrow function for each tweet
    // {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach}
    sortedResult.forEach(tweetObject => {
        // create a container for individual tweet
        const tweet = document.createElement("li");

        // e.g. create a div holding tweet content
        const tweetContent = document.createElement("div");
        // create a text node "safely" with HTML characters escaped
        // {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/createTextNode}
        const tweetText = document.createTextNode(tweetObject.text);
        // append the text node to the div
        tweetContent.appendChild(tweetText);

        // you may want to put more stuff here like time, username...
        tweet.appendChild(tweetContent);

        // finally append your tweet into the tweet list
        tweetList.appendChild(tweet);
    });
}

// Run code only after document has been loaded
document.addEventListener('DOMContentLoaded', () => {
    // Fetch new tweets and display them every 10 seconds
    var timer = setInterval(fetchTweets, 10000);

    // Add Event Listener to Search Bar
    document.getElementById('searchBar').addEventListener("input", event => {
        searchString = event.target.value.trim().toLowerCase();
    });
});