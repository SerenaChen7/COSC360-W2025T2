import { useEffect, useRef, useState } from "react";
import "./ProfileEdit.css";

export default function ProfileEdit({ currentUser, setCurrentUser, onClose }) {
    const fileInputRef = useRef(null);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return "";
        if (imagePath.startsWith("blob:")) return imagePath;
        if (imagePath.startsWith("http")) return imagePath;
        return `${import.meta.env.VITE_API_URL}${imagePath}`;
    };

    const [formData, setFormData] = useState({
        username: currentUser?.username || "",
        email: currentUser?.email || "",
        bio: currentUser?.bio || "",
    });

    const [preview, setPreview] = useState(getImageUrl(currentUser?.profileImage));
    const [image, setImage] = useState(null);
    const [fitMode, setFitMode] = useState("contain");

    useEffect(() => {
        setFormData({
            username: currentUser?.username || "",
            email: currentUser?.email || "",
            bio: currentUser?.bio || "",
        });
        setPreview(getImageUrl(currentUser?.profileImage));
        setImage(null);
    }, [currentUser]);

    useEffect(() => {
        if (!preview) return;

        const img = new Image();
        img.src = preview;

        img.onload = () => {
            const imageWidth = img.naturalWidth || img.width;
            const imageHeight = img.naturalHeight || img.height;

            if (!imageWidth || !imageHeight) {
                setFitMode("contain");
                return;
            }

            const imageRatio = imageWidth / imageHeight;
            const boxRatio = 1; // 200x200 square box

            // if image aspect ratio is close to square, do not zoom much
            // if it is much wider or taller, use cover so it fills the box
            if (Math.abs(imageRatio - boxRatio) < 0.2) {
                setFitMode("contain");
            } else {
                setFitMode("cover");
            }
        };
    }, [preview]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username.trim()) {
            alert("Username is required.");
            return;
        }

        if (!formData.email.trim()) {
            alert("Email is required.");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                alert("You must be logged in.");
                return;
            }

            const submitData = new FormData();
            submitData.append("username", formData.username);
            submitData.append("email", formData.email);
            submitData.append("bio", formData.bio);

            if (image) {
                submitData.append("profileImage", image);
            }

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: submitData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to update profile.");
            }

            setCurrentUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));

            alert("Profile updated successfully!");
            onClose();
        } catch (error) {
            console.error("Failed to update profile:", error);
            alert(error.message || "Failed to update profile.");
        }
    };

    return (
        <div className="profile-edit-overlay">
            <div className="profile-edit-modal">
                <div className="profile-edit-header">
                    <div>
                        <h2>Edit Profile</h2>
                        <p>Update your account information</p>
                    </div>

                    <button
                        type="button"
                        className="close-btn"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <form className="profile-edit-form" onSubmit={handleSubmit}>
                    <div className="upload-section">
                        <label className="section-title">Profile Picture</label>
                        <p className="section-subtitle">
                            Upload a new profile picture
                        </p>

                        <div className="upload-box" onClick={handleUploadClick}>
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Profile preview"
                                    className="preview-img"
                                    style={{
                                        width: "200px",
                                        height: "200px",
                                        minWidth: "200px",
                                        minHeight: "200px",
                                        maxWidth: "none",
                                        maxHeight: "none",
                                        objectFit: "cover",
                                        objectPosition: "center",
                                        display: "block"
                                    }}
                                />
                            ) : (
                                <span className="upload-placeholder">Click Here To Upload</span>
                            )}

                            {preview && <span className="upload-overlay-text">Click to upload</span>}
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
                        <label>Username</label>
                        <p>Change your display name</p>
                        <input
                            type="text"
                            name="username"
                            placeholder="Enter username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <p>Change your email address</p>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Bio (Optional)</label>
                        <p>Add a short bio</p>
                        <textarea
                            name="bio"
                            placeholder="Write something about yourself..."
                            value={formData.bio}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button type="submit" className="submit-btn">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}