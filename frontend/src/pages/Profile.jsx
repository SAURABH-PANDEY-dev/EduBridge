import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getMyProfile,
    updateProfile,
    uploadProfilePic,
} from "../api/userApi";
import "../styles/Profile.css"

function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [image, setImage] = useState(null);
    const navigate = useNavigate();
    
    // Fetch profile on page load
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await getMyProfile();
            setProfile(res.data);
        } catch (err) {
            console.log(err);
            alert("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    // Update name & university
    const handleUpdate = async () => {
        try {
            await updateProfile({
                name: profile.name,
                university: profile.university,
            });
            alert("Profile updated successfully");
        } catch (err) {
            console.log(err);
            alert("Profile update failed");
        }
    };

    // Upload profile picture
    const handleUpload = async () => {
        if (!image) {
            alert("Please select an image");
            return;
        }
        try {
            const res = await uploadProfilePic(image);
            alert(res.data); // backend returns text message
            fetchProfile(); // refresh profile
        } catch (err) {
            console.log(err);
            alert("Image upload failed");
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h2>My Profile</h2>

                {/* Profile Picture */}
                {profile.profilePicUrl ? (
                    <img
                        src={profile.profilePicUrl}
                        alt="Profile"
                        className="profile-pic"
                    />
                ) : (
                    <div className="profile-pic" style={{ background: '#ddd', display: 'flex', alignitems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                        No Image
                    </div>
                )}

                <div className="upload-section">
                    <input
                        type="file"
                        accept="image/*"
                        className="file-input"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                    <button className="upload-btn" onClick={handleUpload}>Upload Picture</button>
                </div>

                <hr />

                {/* Profile Info */}
                <input
                    type="text"
                    value={profile.name || ""}
                    onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                    }
                    placeholder="Name"
                />

                <input
                    type="text"
                    value={profile.university || ""}
                    onChange={(e) =>
                        setProfile({ ...profile, university: e.target.value })
                    }
                    placeholder="University"
                />

                <button onClick={handleUpdate}>Update Profile</button>

                <hr />

                <button onClick={() => navigate("/change-password")}>
                    Change Password
                </button>

            </div>
        </div>
    );
}

export default Profile;