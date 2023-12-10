const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        manufacturer :{ type: String, required: true},
        image: { type: String, required: true },
        type: { type: String, required: true },
        price: { type: Number, required: true },
        countInStock: { type: Number, required: true },
        description: { type: String },
        discount: { type: Number,required: true },
        colour : { type: String, required: true },
        memory: { type: Number},
        ram: { type: Number },
        chip : { type: String },
        gpu : { type: String},
        camera : { type: Number},
        battery : { type: String},
        weight : { type: Number,required: true },
    },
    {
        timestamps: true,
    }
);
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
