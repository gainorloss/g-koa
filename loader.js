const path = require('path');
const fs = require('fs');
const Router = require('koa-router');
const schedule = require('node-schedule');

/**
 * 加载文件夹
 * @param {} dir 
 * @param {*} cb 
 */
function load(dir, cb) {
    const files = fs.readdirSync(path.join(__dirname, dir));

    files.forEach(fileName => {
        fileName = fileName.replace('.js', '');
        const module = require(path.join(__dirname, dir, fileName));
        cb(fileName, module);
    })
}

/**
 * 加载路由
 * @param {} dir 
 * @param {*} cb 
 */
function loadRouter(app) {
    const router = new Router();
    load('routes', (fileName, module) => {
        const prefix = fileName === 'index' ? '' : fileName;
        module = typeof module === 'function' ? module(app) : module;
        Object.keys(module).forEach(key => {
            const [method, url] = key.split(' ');
            const _url = `/${prefix}${url}`;
            router[method](_url, async (ctx,next)=> {
                app.next=next;
                app.ctx = ctx;
                await module[key](app);
            });
        })
    });
    load('api', (fileName, module) => {
        module = typeof module === 'function' ? module(app) : module;
        Object.keys(module).forEach(key => {
            const [method, url] = key.split(' ');
            const _url = `/api/${fileName}${url}`;
            router[method](_url, async (ctx,next) => {
                app.next=next;
                app.ctx = ctx;
                app.ctx.type = 'json';
                await module[key](app);
            });
        })
    });
    return router;
}

/**
 * 加载中间件
 */
function loadMiddleware(app) {
    load('middleware', (fileName, module) => {
        app.$app.use(module);
    });
}


/**
 * 加载控制器
 */
function loadController() {
    const controllers = {};
    load('controller', (fileName, module) => {
        controllers[fileName] = module;
    });
    return controllers;
}

/**
 * 加载服务
 */
function loadService() {
    const services = {};
    load('service', (fileName, module) => {
        services[fileName] = module;
    });
    return services;
}

/**
 * 加载调度
 */
function loadSchedule() {
    load('schedule', (fileName, module) => {
        schedule.scheduleJob(module.cron, module.handler);
    });
}

module.exports = { loadRouter, loadSchedule, loadController, loadService, loadMiddleware };