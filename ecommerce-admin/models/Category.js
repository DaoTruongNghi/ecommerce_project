const { model, models, Schema, mongoose } = require("mongoose");

const CategorySchema = new Schema({
  name: { type: String, required: true },
  parent: { type: mongoose.Types.ObjectId, ref: "Category", default: null },
});

export const Category = models?.Category || model("Category", CategorySchema);
