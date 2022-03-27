const puppeteer = require('puppeteer');

const BASE_URL = 'https://twitter.com/';
const LOGIN_URL = 'https://twitter.com/login';
const USERNAME_URL = (username) => `https://twitter.com/${username}`;

let browser = null;
let page = null;

const twitter = {

    initialize: async () => {
        
        browser = await puppeteer.launch({
            headless: false
        });

        page = await browser.newPage();

        await page.goto(BASE_URL);
        
    },



    getUser: async (username) => {

        let url = await page.url();
        
        if(url != USERNAME_URL(username)) {
            await page.goto(USERNAME_URL(username));
        }
        
        await page.waitFor('h1[class="ProfileHeaderCard-name"] > a');

        let details = await page.evaluate(() => {
            return {
                fullName: document.querySelector('h1[class="ProfileHeaderCard-name"] > a') ? document.querySelector('h1[class="ProfileHeaderCard-name"] > a').innerText : false,
                description: document.querySelector('p[class="ProfileHeaderCard-bio u-dir"]') ? document.querySelector('p[class="ProfileHeaderCard-bio u-dir"]').innerText : false,
                followersCount: document.querySelector('li[class="ProfileNav-item ProfileNav-item--followers"] > a > span[data-count]') ? document.querySelector('li[class="ProfileNav-item ProfileNav-item--followers"] > a > span[data-count]').getAttribute('data-count') : false,
                tweetsCount: document.querySelector('li[class="ProfileNav-item ProfileNav-item--tweets is-active"] > a > span[data-count]') ? document.querySelector('li[class="ProfileNav-item ProfileNav-item--tweets is-active"] > a > span[data-count]').getAttribute('data-count') : false,
                followingsCount: document.querySelector('li[class="ProfileNav-item ProfileNav-item--following"] > a > span[data-count]') ? document.querySelector('li[class="ProfileNav-item ProfileNav-item--following"] > a > span[data-count]').getAttribute('data-count') : false,
                likesCount: document.querySelector('li[class="ProfileNav-item ProfileNav-item--favorites"] > a > span[data-count]') ? document.querySelector('li[class="ProfileNav-item ProfileNav-item--favorites"] > a > span[data-count]').getAttribute('data-count') : false,
                location: document.querySelector('span[class="ProfileHeaderCard-locationText u-dir"]') ? document.querySelector('span[class="ProfileHeaderCard-locationText u-dir"]').innerText.trim() : false,
                url: document.querySelector('span[class="ProfileHeaderCard-urlText u-dir"] > a') ? document.querySelector('span[class="ProfileHeaderCard-urlText u-dir"] > a').getAttribute('href') : false,
                registrationDate: document.querySelector('span[class="ProfileHeaderCard-joinDateText js-tooltip u-dir"]') ? document.querySelector('span[class="ProfileHeaderCard-joinDateText js-tooltip u-dir"]').innerText : false,
                isVerified: document.querySelector('span[class="ProfileHeaderCard-badges"] span[class="Icon Icon--verified"]') ? true : false
            }
        })


        return details;

    },

    getTweets: async (username, count = 10) => {

        let url = await page.url();
        
        if(url != USERNAME_URL(username)) {
            await page.goto(USERNAME_URL(username));
        }

        await page.waitFor('#stream-items-id');

        let tweetsArray = await page.$$('#stream-items-id > li');
        let tweets = [];

        for(let tweetElement of tweetsArray) {
 
            let tweet = await tweetElement.$eval('div[class="js-tweet-text-container"]', element => element.innerText);
            let postedDate = await tweetElement.$eval('a[class="tweet-timestamp js-permalink js-nav js-tooltip"]', element => element.getAttribute('title'));
            let repliesCount = await tweetElement.$eval('span[class="ProfileTweet-actionCountForPresentation"]', element => element.innerText);
            let retweetsCount = await tweetElement.$eval('div[class="ProfileTweet-action ProfileTweet-action--retweet js-toggleState js-toggleRt"] span[class="ProfileTweet-actionCountForPresentation"]', element => element.innerText);
            let likesCount = await tweetElement.$eval('div[class="ProfileTweet-action ProfileTweet-action--favorite js-toggleState"] span[class="ProfileTweet-actionCountForPresentation"]', element => element.innerText);

            tweets.push({ tweet, postedDate, repliesCount, retweetsCount, likesCount });
        }

        debugger;

    },

    end: async () => {
        await browser.close();
    }

};

module.exports = twitter;