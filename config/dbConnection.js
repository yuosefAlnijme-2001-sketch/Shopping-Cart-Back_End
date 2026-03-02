const mongoose = require("mongoose");

const DBConnection = async () => {
  try {
    const connect = await mongoose.connect(process.env.DB_URL);
    console.log(`DB Connected: ${connect.connection.host}`);
  } catch (error) {
    console.error("DB Error:", error.message);
    process.exit(1); // مهم عشان يوضح المشكلة
  }
};

module.exports = DBConnection;