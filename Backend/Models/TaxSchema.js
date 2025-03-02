const mongoose=require("mongoose")

const TaxSchema= new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: String,
    price: Number,
    description: String,
    taxRate: Number,
    taxAmount: Number,
    basePrice: Number
})

module.exports=mongoose.model("Tax",TaxSchema);