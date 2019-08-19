const Koa = require('koa');
const { loadRouter, loadSchedule, loadController, loadService, loadMiddleware } = require('./loader');
const os = require('os');
const cluster = require('cluster');
const wechat=require('co-wechat');
const wechatConf=require('./wechat.conf');

module.exports = class GKoa {
    constructor(conf) {
        this.$app = new Koa(conf);
        this.$middleware = loadMiddleware(this);
        this.$service = loadService(this);
        this.$controller = loadController();
        
        this.$router = loadRouter(this);
        this.$app.use(this.$router.routes());
        this.$app.use(wechat({...wechatConf}).middleware(async(message,ctx)=>{
            console.log(message);
            return "Welcome wechatmedia";
        }));
        this.$schedule = loadSchedule();

        this.$workers = {};
    }

    start(port) {
        port = port || 3000;
        if (cluster.isMaster) {
            cluster.on('death', function (worker) {
                worker = cluster.fork();
                this.$workers[worker.process.pid]=worker;
            })
            for (let index = 0; index < os.cpus().length; index++) {
                const fork = cluster.fork();
                this.$workers[fork.process.id]=fork;
            }
        } else {
            this.$app.listen(port, () => {
                console.log(`server start at: http://localhost:${port},worker id:${cluster.worker.id},pid:${cluster.worker.process.pid}`);
            })
        }
        cluster.on('SIGTERM', () => {
            Object.keys(this.$workers).forEach(pid => {
                process.kill(pid);
            });
            process.exit(1);
        });
    }
}