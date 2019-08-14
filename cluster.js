const cluster = require('cluster');
const os = require('os');
const process = require('process');

const GKoa = require('./g-koa');
const app = new GKoa();

const cpuNums = os.cpus().length;

// app.start(5000);
// console.log(cpuNums);


if (cluster.isMaster) {
    for (let index = 0; index < cpuNums; index++) {
        cluster.fork();
    }
} else {
    app.start(5000);
}