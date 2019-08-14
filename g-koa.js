const Koa = require('koa');
const { loadRouter, loadSchedule, loadController, loadService, loadMiddleware } = require('./loader');
const os = require('os');
const cluster = require('cluster');

module.exports = class GKoa {
    constructor(conf) {
        this.$app = new Koa(conf);
        this.$middleware = loadMiddleware(this);
        this.$service = loadService(this);
        this.$controller = loadController();

        this.$router = loadRouter(this);
        this.$app.use(this.$router.routes());

        this.$schedule = loadSchedule();

        this.$workers = [];
    }

    start(port) {
        port = port || 3000;
        if (cluster.isMaster) {
            for (let index = 0; index < os.cpus().length; index++) {
                const worker = cluster.fork();
                this.$workers.push({ workerid:worker.id,pid:process.pid});
            }
            cluster.on('error',worker=>{
                const worker = cluster.fork();
                this.$workers.push({ workerid:worker.id,pid:process.pid});
            });
            console.log(this.$workers);
        } else {
            this.$app.listen(port, () => {
                console.log(`server start at: http://localhost:${port},worker id:${cluster.worker.id},pid:${process.pid}`);
            })
        }
    }
}