import { Product } from "@/models/Products";
import { mongooseConnect } from "@/lib/mongoose";

export default async function handler(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Product.findOne({ _id: req.query?.id }));
    } else {
      res.json(await Product.find());
    }
  }

  if (method === "POST") {
    const { title, description, price, images, category } = req.body;
    const productDOc = await Product.create({
      title,
      description,
      price,
      images,
      category,
    });
    res.json(productDOc);
  }

  if (method === "PUT") {
    const { title, description, price, images, category, _id } = req.body;
    await Product.updateOne(
      { _id },
      { title, description, price, images, category }
    );
    res.json(true);
  }

  if (method === "DELETE") {
    if (req?.query.id) {
      await Product.deleteOne({ _id: req?.query.id });
      res.json(true);
    }
  }
}
