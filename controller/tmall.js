module.exports = {
    'price': async app => {
        const price = await app.$service.tmall.price(15092090913);
        app.ctx.body = { id: 15092090913, price: price };
    }
}