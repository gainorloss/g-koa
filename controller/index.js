module.exports ={
    'index': async app => {
        app.$service.index.index();
        app.ctx.body = 'index';
    }
}