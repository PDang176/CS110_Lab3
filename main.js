// URL for the Twitterfeed server
const url = "http://ec2-18-209-247-77.compute-1.amazonaws.com:3000/feed/random?q=weather";

// Timer variable for refreshing tweets
var timer;

// List of all tweets
const tweets = [];

// Set of all tweet ids seen
const tweetsIDs = new Set();

// String in the search bar
var searchString = "";

// Fetch 10 new tweets removing all duplicates then call refreshTweets
function fetchTweets(tweetContainer){
    fetch(url)
        .then(res => res.json())
        .then(data =>{
            let newTweets = data.statuses;
            // Remove Duplicates
            for(let i = 0; i < newTweets.length; i++){
                // If the new tweet hasn't been seen before then add it
                if(!tweetsIDs.has(newTweets[i].id)){
                    tweets.push(newTweets[i]);
                    tweetsIDs.add(newTweets[i].id);
                }
            }
            
            // Refresh Page
            refreshTweets(tweetContainer);
    }).catch(err => {
        console.log(err);
    });
}

// Refresh the page to display new tweets
function refreshTweets(tweetContainer){
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
    // Reference to the div with the tag tweet-container
    const tweetContainer = document.getElementById('tweet-container');

    // Fetch new tweets and display them every 10 seconds
    timer = setInterval(fetchTweets, 10000, tweetContainer);

    // Add Event Listener to Search Bar
    document.getElementById('searchBar').addEventListener('input', event => {
        searchString = event.target.value.trim().toLowerCase();
        refreshTweets(tweetContainer);
    });

    // Add Event Listener to Pause Box
    document.getElementById('pausebox').addEventListener('change', event => {
        if(event.target.checked){
            clearInterval(timer);
        }
        else{
            timer = setInterval(fetchTweets, 10000, tweetContainer);
        }
    });
});