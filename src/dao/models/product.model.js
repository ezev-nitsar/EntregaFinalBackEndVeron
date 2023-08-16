import mongoose from 'mongoose';

const productsCollection = 'products';

const stringRequired = {
    type: String,
    required: true
}
const numberRequired = {
    type: Number,
    required: true
}

const productsSchema = new mongoose.Schema({
    id: numberRequired,
    title: stringRequired,
    description: stringRequired,
    price: stringRequired,
    code: stringRequired,
    thumbnails: String,
    code: stringRequired,
    stock: { type: Number },
    status: { type: Boolean }
});

export const productModel = mongoose.model(productsCollection, productsSchema);