import mongoose from 'mongoose';

const cartsCollection = 'carts';

const cartsSchema = new mongoose.Schema({
    id: Number,
    products: Array
});

export const cartModel = mongoose.model(cartsCollection, cartsSchema);