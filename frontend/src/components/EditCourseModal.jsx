import { useEffect, useRef, useState } from "react";
import "../pages/CreateCourse.css";

export default function EditCourseModal({ course, onClose, onUpdated }) {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: course?.title || "",
    type: course?.type || "",
    field: course?.field || "",
    description: course?.description || "",
    startDate: course?.duration?.startDate
      ? new Date(course.duration.startDate).toISOString().split("T")[0]
      : "",
    endDate: course?.duration?.endDate
      ? new Date(course.duration.endDate).toISOString().split("T")[0]
      : "",
    location: course?.location || "",
    currentTagInput: "",
    tags: course?.tags || []
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [preview, setPreview] = useState(
    course?.thumbnail ? `${import.meta.env.VITE_API_URL}${course.thumbnail}` : ""
  );
  const [courseTypeOptions, setCourseTypeOptions] = useState([]);
  const [courseFieldOptions, setCourseFieldOptions] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);
  const [saving, setSaving] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    fetch(`${API_URL}/api/courses/options`)
      .then((res) => res.json())
      .then((data) => {
        setCourseTypeOptions(data.types || []);
        setCourseFieldOptions(data.fields || []);
        setTagOptions(data.tags || []);
      })
      .catch(() => alert("Failed to load course options."));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }

    setThumbnailFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleAddTag = () => {
    const newTag = formData.currentTagInput.trim();
    if (!newTag) return;

    if (formData.tags.length >= 5) {
      alert("You can add at most 5 tags.");
      return;
    }

    if (formData.tags.some((tag) => tag.toLowerCase() === newTag.toLowerCase())) {
      alert("That tag has already been added.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, newTag],
      currentTagInput: ""
    }));
  };

  const handleQuickAddTag = (tag) => {
    if (!tag) return;

    if (formData.tags.length >= 5) {
      alert("You can add at most 5 tags.");
      return;
    }

    if (formData.tags.some((t) => t.toLowerCase() === tag.toLowerCase())) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, tag],
      currentTagInput: ""
    }));
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove)
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

    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      const formPayload = new FormData();
      formPayload.append("title", formData.title);
      formPayload.append("type", formData.type);
      formPayload.append("field", formData.field);
      formPayload.append("description", formData.description);
      formPayload.append("startDate", formData.startDate || "");
      formPayload.append("endDate", formData.endDate || "");
      formPayload.append("location", formData.location || "");
      formData.tags.forEach((tag) => formPayload.append("tags[]", tag));
      if (thumbnailFile) {
        formPayload.append("thumbnail", thumbnailFile);
      }

      const res = await fetch(`${API_URL}/api/courses/${course._id}`, {
        method: "PATCH",
        headers: token
          ? {
              Authorization: `Bearer ${token}`
            }
          : undefined,
        body: formPayload
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update course.");
      }

      onUpdated(data);
      onClose();
    } catch (err) {
      alert(err.message || "Failed to update course.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="create-course-overlay">
      <div className="create-course-modal">
        <div className="create-course-header">
          <div>
            <h2>Course Management – Edit Course</h2>
            <p>Admin</p>
          </div>
          <button type="button" className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="create-course-form" onSubmit={handleSubmit}>
          <div className="upload-section">
            <label className="section-title">Course Thumbnail</label>
            <p className="section-subtitle">Upload an image to showcase your course</p>
            <div className="upload-box" onClick={() => fileInputRef.current?.click()}>
              {preview ? (
                <img src={preview} alt="Course preview" className="preview-img" />
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
            <div className="form-group">
              <label>Course Type</label>
              <p>What is the type of your Course?</p>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="">Select course type</option>
                {courseTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Course Field</label>
              <p>What are the fields of your Course?</p>
              <select name="field" value={formData.field} onChange={handleChange}>
                <option value="">Select course field</option>
                {courseFieldOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Tags</label>
            <p>What are the tags to describe your Course? (Max 5)</p>

            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                name="currentTagInput"
                placeholder="Type a tag or choose one below"
                value={formData.currentTagInput}
                onChange={handleChange}
                disabled={formData.tags.length >= 5}
              />
              <button
                type="button"
                className="add-tag-btn"
                onClick={handleAddTag}
                disabled={formData.tags.length >= 5}
              >
                +
              </button>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginTop: "10px"
              }}
            >
              {tagOptions.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleQuickAddTag(tag)}
                  disabled={formData.tags.length >= 5 || formData.tags.includes(tag)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "999px",
                    border: "1px solid #2b6cb0",
                    background: "transparent",
                    color: "#cbd5e1",
                    cursor: "pointer",
                    fontSize: "12px"
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="tag-count" style={{ marginTop: "10px" }}>
              {formData.tags.length}/5 tags added
            </div>

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
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}