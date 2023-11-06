import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === "GET") {
    const getData = await Category.find().populate("parent");
    res.json(getData);
  }

  if (method === "POST") {
    const { name, parentCategories } = req.body;
    const categoryDoc = await Category.create({
      name,
      parent: null ? null : parentCategories,
    });
    res.json(categoryDoc);
  }

  if (method === "PUT") {
    const { name, parentCategories, _id } = req.body;
    const categoryDoc = await Category.updateOne(
      { _id },
      {
        name,
        parent: parentCategories,
      }
    );
    res.json(categoryDoc);
  }

  if (method === "DELETE") {
    const { _id } = req.query;
    await Category.deleteOne({ _id });
    res.json("ok");
  }

  // Trong trường hợp updateOne, parent: parentCategories sẽ cập nhật trường "parent" của bản ghi bằng giá trị parentCategories.
  // Nếu parentCategories là một chuỗi ObjectId, thì điều này có thể hoạt động. Tuy nhiên, nếu parentCategories là một mảng của
  // các ObjectId (nếu có nhiều danh mục cha), bạn cần xem xét cách bạn muốn lưu trữ thông tin này trong MongoDB.
  // if (method === "PUT") {
  //   const { name, parentCategories, _id } = req.body;
  //   const updatedCategory = await Category.findByIdAndUpdate(
  //     _id,
  //     { name, parent: parentCategories },
  //     { new: true } // Để trả về bản ghi đã cập nhật
  //   );
  //   res.json(updatedCategory);
  // }
}
