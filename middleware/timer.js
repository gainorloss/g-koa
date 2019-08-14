module.exports=async (ctx,next)=>{
    const start=Date.now();
    await next();
    console.log(`${ctx.method} ${ctx.url} - ${Date.now()-start}ms`);
}