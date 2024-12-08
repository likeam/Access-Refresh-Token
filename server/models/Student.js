import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  mame: String,
  email: String,
  password: String,
});

const StudentModel = mongoose.model("Students", StudentSchema);
export default StudentModel;
