import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const productCollection="products";

const productShema= new mongoose.Schema({
    title:{type:String,max:20},
    description:{type:String,max:30},
    code:{type:String,max:30},
    price:{type:Number},
    status:{type:Boolean},
    owner:{ type: String},
    stock:{type:Number},
    cat:{type:String,max:30}
});

productShema.plugin(mongoosePaginate)
const productModel= mongoose.model(productCollection,productShema);
export default productModel