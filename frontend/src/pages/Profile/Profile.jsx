import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [editedUser, setEditedUser] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_PRODUCTION_URL}/api/v1/users/fetch-profile`,
                    { withCredentials: true }
                );
                const userData = res.data.user;
                const formatted = {
                    name: userData.fullName || '',
                    username: userData.userName || '',
                    dob: userData.dob || '2000-01-01',
                    location: userData.location || '',
                    bio: userData.bio || '',
                    profilePicture:
                        userData.profilePicture ||
                        'https://via.placeholder.com/150?text=Default+Profile+Pic',
                    interests: userData.interests || [],
                };
                setUser(formatted);
                setEditedUser({ ...formatted });
                setSelectedFile(null);
            } catch (err) {
                console.error('Failed to fetch profile:', err);
            }
        };

        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUser((prev) => ({ ...prev, [name]: value }));
    };

    const handlePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setEditedUser((prevUser) => ({
                    ...prevUser,
                    profilePicture: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddInterest = () => {
        const newInterest = prompt('Enter a new interest:');
        if (newInterest) {
            setEditedUser((prev) => ({
                ...prev,
                interests: [...prev.interests, newInterest],
            }));
        }
    };

    const handleRemoveInterest = (index) => {
        const updated = editedUser.interests.filter((_, i) => i !== index);
        setEditedUser((prev) => ({ ...prev, interests: updated }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('fullName', editedUser.name);
            formData.append('userName', editedUser.username);
            formData.append('dob', editedUser.dob);
            formData.append('location', editedUser.location);
            formData.append('bio', editedUser.bio);
            formData.append('interests', JSON.stringify(editedUser.interests));

            if (selectedFile) {
                setIsUploading(true);
                formData.append('profilePicture', selectedFile);
            }

            const res = await axios.put(
                `${import.meta.env.VITE_PRODUCTION_URL}/api/v1/users/edit-profile`,
                formData,
                {
                    withCredentials: true,
                }
            );

            const updatedUser = res.data.user;
            const formatted = {
                name: updatedUser.fullName,
                username: updatedUser.userName,
                dob: updatedUser.dob || '2000-01-01',
                location: updatedUser.location || '',
                bio: updatedUser.bio || '',
                profilePicture: updatedUser.profilePicture || '',
                interests: updatedUser.interests || [],
            };
            setUser(formatted);
            setEditedUser(formatted);
            setSelectedFile(null);
            setIsEditing(false);
        } catch (err) {
            console.error('Failed to update profile:', err);
        } finally {
            setIsSaving(false);
            setIsUploading(false);
        }
    };

    const handleCancel = () => {
        setEditedUser({ ...user });
        setSelectedFile(null);
        setIsEditing(false);
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="profile-container">
            <header className="profile-header">
                <h1 className="logo">Couplespace</h1>
                <nav className="nav-links">
                    <a href="/home">Home</a>
                    <a href="/messages">Messages</a>
                </nav>
            </header>

            <div className="profile-card">
                <div className="profile-picture-wrapper relative w-32 h-32 mx-auto mb-4">
                    <img
                        src={editedUser.profilePicture}
                        alt="Profile"
                        className="profile-picture w-full h-full rounded-full object-cover border-2 border-gray-300"
                    />

                    {isEditing && (
                        <>
                            {/* Hidden file input for image upload */}
                            <input
                                type="file"
                                accept="image/*"
                                id="profilePicInput"
                                onChange={handlePictureChange}
                                className="upload-input hidden"
                            />

                            {/* Overlay label that opens file input */}
                            <label
                                htmlFor="profilePicInput"
                                className="absolute inset-0 bg-black bg-opacity-50 text-white text-sm flex items-center justify-center rounded-full cursor-pointer transition hover:bg-opacity-70"
                            >
                                Edit
                            </label>

                            {/* Upload feedback */}
                            <div className="mt-2 text-center text-sm text-gray-600">
                                {selectedFile && !isUploading && <p>Preview loaded ✓</p>}
                                {isUploading && <p>Uploading image...</p>}
                            </div>
                        </>
                    )}
                </div>


                {isEditing ? (
                    <>
                        <input
                            type="text"
                            name="name"
                            value={editedUser.name}
                            onChange={handleInputChange}
                            className="edit-input"
                        />
                        <input
                            type="text"
                            name="username"
                            value={editedUser.username}
                            onChange={handleInputChange}
                            className="edit-input"
                            readOnly
                        />
                        <label className="dob-label">DOB:</label>
                        <input
                            type="date"
                            name="dob"
                            value={editedUser.dob}
                            onChange={handleInputChange}
                            className="edit-input"
                        />
                        <input
                            type="text"
                            name="location"
                            value={editedUser.location}
                            onChange={handleInputChange}
                            className="edit-input"
                        />
                        <textarea
                            name="bio"
                            value={editedUser.bio}
                            onChange={handleInputChange}
                            className="edit-textarea"
                        />
                        <div className="interests-editor">
                            <h3>Interests</h3>
                            <div className="interests-list">
                                {editedUser.interests.map((interest, index) => (
                                    <span key={index} className="interest-tag">
                                        {interest}
                                        <button
                                            className="remove-interest-button"
                                            onClick={() => handleRemoveInterest(index)}
                                        >
                                            ✕
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <button className="add-interest-button" onClick={handleAddInterest}>
                                Add Interest
                            </button>
                        </div>

                        {isSaving ? (
                            <button className="save-button" disabled>
                                Saving...
                            </button>
                        ) : (
                            <button className="save-button" onClick={handleSave}>
                                Save
                            </button>
                        )}
                        <button className="cancel-button" onClick={handleCancel}>
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <h2 className="profile-name">{user.name}</h2>
                        <p className="profile-username">{user.username}</p>
                        <p className="profile-age-location">
                            DOB: {new Date(user.dob).toLocaleDateString()} • {user.location}
                        </p>

                        <button className="edit-button" onClick={() => setIsEditing(true)}>
                            Edit Profile
                        </button>

                        <div className="profile-bio">
                            <h3>Bio</h3>
                            <p>{user.bio}</p>
                        </div>

                        <div className="profile-interests">
                            <h3>Interests</h3>
                            <div className="interests-list">
                                {user.interests.map((interest, index) => (
                                    <span key={index} className="interest-tag">
                                        {interest}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Profile;
