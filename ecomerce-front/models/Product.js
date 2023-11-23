const { model, Schema, models, mongoose } = require("mongoose");

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    images: [{ type: String }],
    category: { type: mongoose.Types.ObjectId, ref: "Category", default: null },
    properties: { type: Object },
  },
  {
    timestamps: true,
  }
);

export const Product = models?.Products || model("Products", ProductSchema);
