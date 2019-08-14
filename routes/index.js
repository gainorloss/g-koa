// module.exports = {
//     'get /': async app => {
//         app.ctx.body = 'index';
//     }
// }
module.exports=app=>({
    'get /':app.$controller.index.index
});