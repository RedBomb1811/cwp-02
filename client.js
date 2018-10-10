const net = require('net');
const fs = require('fs');
const shuffle = require('shuffle-array');

const port = 8124;
const client = new net.Socket();
let arr = [];
let currInd = -1;
let servAnsw;

client.setEncoding('utf8');

client.connect(port, function () {
    console.log('Connected');
    fs.readFile('qa.json', (err, text) => {
        if (err) console.log(err);
        else {
            arr = JSON.parse(text);
            shuffle(arr);
            client.write('QA');
        }
    });
});

client.on('data', function (data) {
    console.log('server: ' + data);
    switch (data) {
        case "DEC":
            client.destroy();
            break;
        case "ACK":
            doTest();
            break;
        default:
            if (data === 1)
                servAnsw = arr[currInd].goodAns;
            else
                servAnsw = arr[currInd].badAns;
            console.log('Question: ' + arr[currInd].question);
            console.log('Good Answer: ' + arr[currInd].goodAns);
            console.log('Server Answer: ' + servAnsw);
            doTest();
            break;
    }
});

client.on('close', function () {
    console.log('Connection closed');
});

function doTest() {
    if (currInd < arr.length - 1)
        client.write(arr[++currInd].question);
    else
        client.destroy();
}