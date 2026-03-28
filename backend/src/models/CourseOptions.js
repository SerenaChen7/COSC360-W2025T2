import mongoose from "mongoose";

const courseOptionsSchema = new mongoose.Schema(
  {
    types: {
      type: [String],
      default: [],
    },
    fields: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("CourseOptions", courseOptionsSchema);