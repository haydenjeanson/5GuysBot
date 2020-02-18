const getJSON = require('get-json');

getJSON('https://www.reddit.com/r/insults/top.json?t=month', (error, response) => {
    console.log(response.data.children[24]);
});