import { useEffect, useRef, useState } from "react";
import "./CreateCourse.css";
import SearchableDropdown from "../components/SearchableDropdown";

export default function CreateCourse({ setPage, setSelectedCourseId }) {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    field: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    currentTagInput: "",
    tags: [],
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [courseTypeOptions, setCourseTypeOptions] = useState([]);
  const [courseFieldOptions, setCourseFieldOptions] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);

  useEffect(() => {
    const fetchCourseOptions = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/courses/options");

        if (!res.ok) {
          throw new Error("Failed to fetch course options");
        }

        const data = await res.json();

        setCourseTypeOptions(data.types || []);
        setCourseFieldOptions(data.fields || []);
        setTagOptions(data.tags || []);
      } catch (error) {
        console.error("Failed to load course options:", error);
        alert("Failed to load course options.");
      }
    };

    fetchCourseOptions();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleAddTag = () => {
    const newTag = formData.currentTagInput.trim();

    if (!newTag) {
      alert("Please enter or select a tag first.");
      return;
    }

    if (formData.tags.length >= 5) {
      alert("You can add at most 5 tags.");
      return;
    }

    const alreadyExists = formData.tags.some(
      (tag) => tag.toLowerCase() === newTag.toLowerCase()
    );

    if (alreadyExists) {
      alert("That tag has already been added.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, newTag],
      currentTagInput: "",
    }));
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Course title is required.");
      return;
    }

    if (!formData.type.trim()) {
      alert("Course type is required.");
      return;
    }

    if (!formData.field.trim()) {
      alert("Course field is required.");
      return;
    }

    if (!formData.description.trim()) {
      alert("Course description is required.");
      return;
    }

    if (formData.tags.length === 0) {
      alert("Please add at least one tag.");
      return;
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        alert("Start date cannot be after end date.");
        return;
      }
    }

    try {
      const payload = {
        title: formData.title,
        type: formData.type,
        field: formData.field,
        description: formData.description,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        location: formData.location || "",
        tags: formData.tags,
      };

      const res = await fetch("http://localhost:3000/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create course.");
      }

      alert("Course submitted successfully!");

      if (data?._id) {
        setSelectedCourseId(data._id);
      }

      setPage("course");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to submit course.");
    }
  };

  return (
    <div className="create-course-overlay">
      <div className="create-course-modal">
        <div className="create-course-header">
          <div>
            <h2>Course Management – Create Course</h2>
            <p>User / Admin</p>
          </div>

          <button
            type="button"
            className="close-btn"
            onClick={() => setPage("dashboard")}
          >
            ×
          </button>
        </div>

        <form className="create-course-form" onSubmit={handleSubmit}>
          <div className="upload-section">
            <label className="section-title">Course Thumbnail</label>
            <p className="section-subtitle">
              Upload an image to showcase your course
            </p>

            <div className="upload-box" onClick={handleUploadClick}>
              {preview ? (
                <img
                  src={preview}
                  alt="Course preview"
                  className="preview-img"
                />
              ) : (
                <span>Click Here To Upload</span>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden-file-input"
              onChange={handleFileChange}
            />
          </div>

          <div className="form-group">
            <label>Course Title</label>
            <p>What is the title of your Course?</p>
            <input
              type="text"
              name="title"
              placeholder="Enter title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="two-column">
            <SearchableDropdown
              label="Course Type"
              helperText="What is the type of your Course?"
              name="type"
              value={formData.type}
              options={courseTypeOptions}
              onChange={handleChange}
            />

            <SearchableDropdown
              label="Course Field"
              helperText="What are the fields of your Course?"
              name="field"
              value={formData.field}
              options={courseFieldOptions}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <SearchableDropdown
              label="Tags"
              helperText="What are the tags to describe your Course? (Max 5)"
              name="currentTagInput"
              value={formData.currentTagInput}
              options={tagOptions}
              placeholder="Type or choose a tag"
              onChange={handleChange}
              disabled={formData.tags.length >= 5}
              rightButton={
                <button
                  type="button"
                  className="add-tag-btn"
                  onClick={handleAddTag}
                  disabled={formData.tags.length >= 5}
                >
                  +
                </button>
              }
            />

            <div className="tag-count">{formData.tags.length}/5 tags added</div>

            <div className="selected-tags">
              {formData.tags.map((tag) => (
                <div key={tag} className="tag-chip">
                  <span>{tag}</span>
                  <button
                    type="button"
                    className="remove-tag-btn"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Course Description</label>
            <p>What is the course about?</p>
            <textarea
              name="description"
              placeholder="Enter description..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Course Duration (Optional)</label>
            <p>How long is this course?</p>

            <div className="two-column">
              <div className="form-group small-gap">
                <span className="mini-label">Start Date</span>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group small-gap">
                <span className="mini-label">End Date</span>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Course Location (Optional)</label>
            <input
              type="text"
              name="location"
              placeholder="e.g. Arts 141"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setPage("dashboard")}
            >
              Cancel
            </button>

            <button type="submit" className="submit-btn">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}