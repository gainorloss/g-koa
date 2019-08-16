module.exports={
    'get /':async app=>{
        app.ctx.body={code:0,msg:'获取成功',data:Date.now()};
    }
}