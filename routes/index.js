// module.exports = {
//     'get /': async app => {
//         app.ctx.body = 'index';
//     }
// }
module.exports =async  app => ({
    'get /': app.$controller.index.index
});