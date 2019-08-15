module.exports=async app=>({
    'get /:id':await app.$controller.tmall.price
})