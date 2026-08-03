import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Soat nomi kiritilishi shart"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Narx kiritilishi shart"],
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ["Erkaklar uchun", "Ayollar uchun"],
    },
    // Bir nechta rasm: URL yoki base64 (data:image/...;base64,...) bo'lishi mumkin
    images: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "Kamida bitta rasm yuklanishi kerak",
      },
    },
    // Asosiy (kartochkada ko'rinadigan) rasm - odatda images[0]
    mainImage: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    // Afzalliklar ro'yxati, masalan: ["Suv o'tkazmaydi", "1 yil kafolat"]
    features: {
      type: [String],
      default: [],
    },
    // Ishlatish/sotib olish bo'yicha yo'riqnoma
    instructions: {
      type: String,
      default: "",
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
