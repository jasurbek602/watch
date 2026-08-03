import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    // Buyurtma paytidagi mahsulot ma'lumotlari saqlanadi (mahsulot keyin
    // o'chirilsa yoki narxi o'zgarsa ham buyurtma tarixi buzilmasin uchun)
    productSnapshot: {
      title: String,
      price: Number,
      image: String,
    },
    customerName: {
      type: String,
      required: [true, "Ism kiritilishi shart"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Telefon raqami kiritilishi shart"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Manzil kiritilishi shart"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Yangi", "Bajarildi", "Bekor qilindi"],
      default: "Yangi",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
