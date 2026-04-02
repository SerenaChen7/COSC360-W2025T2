import Course from '../models/Course.js';

// This function tells MongoDB to remove a course by its ID
export const removeCourseFromDb = async (id) => {
  // Use Mongoose to find and delete
  const result = await Course.findByIdAndDelete(id);
  return result;
};