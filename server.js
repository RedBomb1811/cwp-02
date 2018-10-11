const net = require('net');
const fs = require('fs');
const port = 8124;
let seed = 0;
let right = 0;

const server = net.createServer((client) => {
    const logger = fs.createWriteStream('client_' + seed + '.log');
    logger.write('Client ' + seed + ' connected\n');
    client.id = seed++;
    client.setEncoding('utf8');

    client.on('data', (data) => {
        dataHandler(data, client, logger)
    });

    client.on('end', () => logger.write('Client ' + client.id + ' disconnected\n'));
});

server.listen(port, () => {
    console.log(`Server listening on localhost:${port}`);
});

function dataHandler(data, client, logger) {
    if (data === 'QA') {
        client.write("ACK");
        right = 0;
    }
    else {
        logger.write('\nQuestion: ' + data + '\n');
        let answer = Math.floor(Math.random() * 2);
        if (answer === 1)
            right++;
        logger.write('Answer: ' + answer + '\n');
        logger.write('Statistic: ' + right + ' right answer\n')
        client.write(answer.toString());
    }
}