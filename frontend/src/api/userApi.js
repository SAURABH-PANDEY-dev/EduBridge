import api from "./axios";

/*
 Fetch logged-in user's profile
 GET /api/users/profile
*/
export const getMyProfile = () => {
    return api.get("/api/users/profile");
};

/*
 Update logged-in user's profile
 PUT /api/users/profile
*/
export const updateProfile = (data) => {
    return api.put("/api/users/profile", data);
};

/*
 Upload profile picture
 POST /api/users/profile-pic
 multipart/form-data
*/
export const uploadProfilePic = (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return api.post("/api/users/profile-pic", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};