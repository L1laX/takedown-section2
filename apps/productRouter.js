import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";
const productRouter = Router();

const productCollection = db.collection("products");
// เรียกดู ข้อมูลทั้งหมด

//1.กำหนด path เข้าใช้งาน
productRouter.get("/", async (req, res) => {
  //2.ดึงข้อมูลจากฐานข้อมูลไปฝากไว้ที่ตัวแปรนึง
  try {
    const data = await productCollection.find({}).toArray();
    return res.json({
      message: "Fetching successfully",
      data: data,
    });
  } catch {
    return res.status(500).json({
      message: "Server error",
    });
  }
  //3.ส่งข้อมูลกลับไปให้ client
});

productRouter.get("/:id", async (req, res) => {
  //นำค่าอ้างอิงมา เพื่อหาให้ db
  const id = new ObjectId(req.params.id);
  // หาค่าใน db โดยกำหนดเงื่อนไขให้เอาเฉพาะตัวที่ ไอดีตรงกัน
  try {
    const data = await productCollection.findOne({ _id: id });
    return res.json({
      message: "Fetching successfully",
      data: data,
    });
  } catch {
    return res.status(500).json({
      message: "Server error",
    });
  }
});

productRouter.post("/", async (req, res) => {
  //1.รับข้อมูลที่เราจะสร้างจาก client
  const newProduct = { ...req.body };
  //1.1 กำหนดว่าตัว body ควรมี อะไรบ้าง
  if (newProduct.name && newProduct.price && newProduct.description) {
    try {
      //2.กำหนด endpoint เพื่อนำข้อมูลลงไปใน db
      await productCollection.insertOne(newProduct);
      //3.ตอบกลับ client ว่า เสร็จแล้วจ้า
      return res.json({
        message: "เรียบร้อยแล้วจ้า",
      });
    } catch {
      return res.status(500).json({
        message: "Server error",
      });
    }
  } else {
    return res.status(400).json({
      message: "กรอกข้อมูลไม่ครบจ้า",
    });
  }
});

productRouter.put("/:id", async (req, res) => {
  //ไอดีอ้างอิ่ง
  const id = new ObjectId(req.params.id);
  //บอดี้ที่จะอัพเดท
  const updateProduct = { ...req.body };

  //เช็คว่ามีข้อมูลตรงกันไหม
  const check = await productCollection.countDocuments({ _id: id });
  if (check === 1) {
    //อัพเดทค่า
    try {
      //return to client ว่า อัพเสร็จ
      await productCollection.updateOne({ _id: id }, { $set: updateProduct });
      return res.json({
        message: "อัพเสร็จแล้วจ้า",
      });
    } catch {
      return res.status(500).json({
        message: "Server error",
      });
    }
  } else {
    //แจ้งว่าไม่มีค่าตรงกับใน  db
    return res.status(400).json({
      message: "ไม่พบไอดีที่ส่งมา",
    });
  }
});

productRouter.delete("/:id", async (req, res) => {
      // ค่าอ้างอิง
  const id = new ObjectId(req.params.id);
  try {
      //ดำเนินการลบ
    const result = await productCollection.deleteOne({ _id: id });
    console.log(result);
    if (result.deletedCount) {
      return res.json({
        message: "delete successfully",
      });
    } else {
      return res.status(400).json({
        message: "error can't find product",
      });
    }
  } catch {
    return res.status(500).json({
      message: "Server error",
    });
  }
});

export default productRouter;
