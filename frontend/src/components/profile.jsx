'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
    Box,
    Typography,
    Button,
    TextField,
    TextareaAutosize,
    Checkbox,
    FormControlLabel,
    Divider,
    Avatar,
    Stack,
    IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { jwtDecode } from 'jwt-decode';

export default function ProfilePage({id}) {

    const [profile, setProfile] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        avatar: '',
        location: '',
        status: '',
        skills: [],
        bio: '',
        experience: [],
        education: [],
        social: [],
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:5000/api/profile/${id}`, {
                    token : token
                })
                const data = res.data;
               // console.log(data);
                if (res.status === 200) {
                    setProfile(data);
                    setFormData({
                        name: data?.name || "",
                        email: data?.email || "",
                        avatar: data?.user.avatar || "",
                        location: data?.location || "",
                        status: data?.status || "",
                        skills: (data?.skills || []).join(", "),
                        bio: data?.bio || "",
                        experience: data?.experience?.map(exp => ({
                            ...exp,
                            from: exp.from ? exp.from.substring(0, 10) : "",
                            to: exp.to ? exp.to.substring(0, 10) : "",
                        })) || [],
                        education: data.education?.map(edu => ({
                            ...edu,
                            from: edu.from ? edu.from.substring(0, 10) : "",
                            to: edu.to ? edu.to.substring(0, 10) : "",
                        })) || [],
                        social: data?.social || [],
                    });
                    setAvatarPreview(data.avatar || "")
                } else {
                    setError(data.message || "Failed to load profile");
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    //console.log(profile)
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            const previewURL = URL.createObjectURL(file);
            setAvatarPreview(previewURL);
            setFormData(prev => ({ ...prev, avatar: '' }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNestedChange = (section, index, field, value) => {
        setFormData(prev => {
            const updatedSection = [...prev[section]];
            updatedSection[index] = { ...updatedSection[index], [field]: value };
            return { ...prev, [section]: updatedSection };
        });
    };

    const handleCheckboxChange = (section, index, field, checked) => {
        setFormData(prev => {
            const updatedSection = [...prev[section]];
            updatedSection[index] = { ...updatedSection[index], [field]: checked };
            if (field === "current" && checked) updatedSection[index].to = "";
            return { ...prev, [section]: updatedSection };
        });
    };

    const addEntry = (section) => {
        const emptyExp = {
            title: "", company: "", location: "", from: "", to: "", current: false, description: ""
        };
        const emptyEdu = {
            school: "", degree: "", from: "", to: "", current: false, description: ""
        };
        setFormData(prev => ({
            ...prev,
            [section]: [...prev[section], section === "experience" ? emptyExp : emptyEdu],
        }));
    };

    const removeEntry = (section, index) => {
        setFormData(prev => {
            const updatedSection = prev[section].filter((_, i) => i !== index);
            return { ...prev, [section]: updatedSection };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        let avatarUrlToSave = formData.avatar;

        // If user selected a new avatar file, upload it first
        if (avatarFile) {
            try {
                const token = localStorage.getItem("token");
                const formDataFile = new FormData();
                formDataFile.append('image', avatarFile);

                // Replace with your upload API endpoint
                const uploadRes = await axios.post("http://localhost:5000/api/upload/profile", formDataFile, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        token,
                    },
                });

                if (uploadRes.data && uploadRes.data.url) {
                    avatarUrlToSave = uploadRes.data.url; // URL returned from server after upload
                } else {
                    setError("Avatar upload failed");
                    return;
                }
            } catch (err) {
                setError("Avatar upload failed");
                return;
            }
        }
        const updateData = {
            ...formData,
            avatar: avatarUrlToSave,
            skills: formData.skills.split(',').map(s => s.trim()),
            experience: formData.experience.map(exp => ({
                ...exp,
                from: exp.from ? new Date(exp.from) : null,
                to: exp.current ? null : (exp.to ? new Date(exp.to) : null),
            })),
            education: formData.education.map(edu => ({
                ...edu,
                from: edu.from ? new Date(edu.from) : null,
                to: edu.current ? null : (edu.to ? new Date(edu.to) : null),
            })),
        };

        try {
            const token = localStorage.getItem("token");
            const res = await axios.put("http://localhost:5000/api/profile/update", updateData, {
                headers: { token },
            });
            const data = res.data;
            if (res.status == 200) {
                setProfile(data);
                setEditMode(false);
                setAvatarFile(null);
                setAvatarPreview(data.avatar || avatarUrlToSave);
            } else {
                setError(data.message || "Update failed");
            }
        } catch {
            setError("Update failed");
        }
    };

    if (loading) return <Typography color="white" p={3}>Loading profile...</Typography>;
    if (error) return <Typography color="error" p={3}>{error}</Typography>;
    if (!profile) return <Typography color="white" p={3}>Profile not found.</Typography>;

    const userID = jwtDecode(localStorage.getItem('token')).id;
    const isOwner = userID==id;

    return (
        <Box sx={{ display: "flex", height: "100vh", bgcolor: "#141414", flexDirection: "column" }}>
            <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                        overflow: "hidden",
                        p: 3,
                    }}
                >
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            width: "100%",
                            maxWidth: "900px",
                            display: "flex",
                            flexDirection: "column",
                            flex: 1,
                            color: "white",
                            overflowY: "auto",
                            bgcolor: "#1e1e1e",
                            borderRadius: 2,
                            p: 3,
                            gap: 2,
                            scrollbarWidth: "none", // Firefox
                            "&::-webkit-scrollbar": { display: "none" }, // Chrome, Safari, Edge
                        }}
                    >
                        <Typography variant="h4" mb={2}>
                            Profile
                        </Typography>
                        <Box
                            sx={{
                                //transform: 'translateX(350px)',
                                display: "flex",
                                flexDirection: "column",   // ✅ correct property
                                alignItems: "center",      // ✅ center avatar + button
                                gap: 2,
                                mb: 2,
                                p: '10px'
                            }}
                        >
                            <Avatar
                                src={avatarPreview || '/default-avatar.png'}
                                sx={{
                                    width: 180,
                                    height: 180,
                                }}
                            />

                            {editMode && (
                                <Button
                                    variant="contained"
                                    component="label"
                                    sx={{
                                        borderRadius: '50px',
                                        height: '30px',
                                        width: '150px',
                                        bgcolor: "#e50914",
                                        "&:hover": { bgcolor: "#b20710" }
                                    }}
                                >
                                    Upload Image
                                    <input
                                        hidden
                                        accept="image/*"
                                        type="file"
                                        onChange={handleAvatarChange}
                                    />
                                </Button>
                            )}
                        </Box>


                        {!editMode && (
                            <>

                                <Stack spacing={1}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", bgcolor: "#2a2a2a", p: 1, borderRadius: 1 }}>
                                        <Typography fontWeight="bold">Name:</Typography>
                                        <Typography>{profile.name}</Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", bgcolor: "#2a2a2a", p: 1, borderRadius: 1 }}>
                                        <Typography fontWeight="bold">Email:</Typography>
                                        <Typography>{profile.email}</Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", bgcolor: "#2a2a2a", p: 1, borderRadius: 1 }}>
                                        <Typography fontWeight="bold">Location:</Typography>
                                        <Typography>{profile.location}</Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", bgcolor: "#2a2a2a", p: 1, borderRadius: 1 }}>
                                        <Typography fontWeight="bold">Status:</Typography>
                                        <Typography>{profile.status}</Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", bgcolor: "#2a2a2a", p: 1, borderRadius: 1 }}>
                                        <Typography fontWeight="bold">Bio:</Typography>
                                        <Typography>{profile.bio}</Typography>
                                    </Box>
                                </Stack>

                                <Typography variant="h6" mt={3} mb={1} sx={{ borderBottom: "3px solid #e50914", pb: 0.5 }}>
                                    Skills
                                </Typography>
                                {profile.skills && profile.skills.length > 0 ? (
                                    <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                                        {profile.skills.map((skill, idx) => (
                                            <li key={idx}>{skill}</li>
                                        ))}
                                    </Box>
                                ) : (
                                    <Typography>No skills listed.</Typography>
                                )}

                                <Typography variant="h6" mt={3} mb={1} sx={{ borderBottom: "3px solid #e50914", pb: 0.5 }}>
                                    Experience
                                </Typography>
                                {profile.experience && profile.experience.length > 0 ? (
                                    <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                                        {profile.experience.map((exp, idx) => (
                                            <li key={idx} style={{ marginBottom: 8 }}>
                                                <Typography>
                                                    <strong>{exp.title}</strong> at {exp.company} ({exp.from?.substring(0, 10)} - {exp.current ? 'Present' : exp.to?.substring(0, 10) || 'N/A'})
                                                </Typography>
                                                {exp.location && <Typography sx={{ ml: 2 }}>{exp.location}</Typography>}
                                                {exp.description && <Typography sx={{ ml: 2 }}>{exp.description}</Typography>}
                                            </li>
                                        ))}
                                    </Box>
                                ) : (
                                    <Typography>No experience listed.</Typography>
                                )}

                                <Typography variant="h6" mt={3} mb={1} sx={{ borderBottom: "3px solid #e50914", pb: 0.5 }}>
                                    Education
                                </Typography>
                                {profile.education && profile.education.length > 0 ? (
                                    <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                                        {profile.education.map((edu, idx) => (
                                            <li key={idx} style={{ marginBottom: 8 }}>
                                                <Typography>
                                                    <strong>{edu.degree}</strong> at {edu.school} ({edu.from?.substring(0, 10)} - {edu.current ? 'Present' : edu.to?.substring(0, 10) || 'N/A'})
                                                </Typography>
                                                {edu.description && <Typography sx={{ ml: 2 }}>{edu.description}</Typography>}
                                            </li>
                                        ))}
                                    </Box>
                                ) : (
                                    <Typography>No education listed.</Typography>
                                )}

                                <Typography variant="h6" mt={3} mb={1} sx={{ borderBottom: "3px solid #e50914", pb: 0.5 }}>
                                    Social Profiles
                                </Typography>
                                {profile.social && profile.social.length > 0 ? (
                                    <Stack spacing={1} mb={2}>
                                        {profile.social.map((social, idx) => (
                                            <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", bgcolor: "#2a2a2a", p: 1, borderRadius: 1 }}>
                                                <Typography fontWeight="bold">{social.platform}:</Typography>
                                                <Typography>{social.username}</Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                ) : (
                                    <Typography>No social profiles.</Typography>
                                )}

                                {isOwner && (
                                    <Button
                                        variant="contained"
                                        sx={{
                                            bgcolor: "#e50914",
                                            textTransform: "none",
                                            fontWeight: "bold",
                                            alignSelf: "start",
                                        }}
                                        onClick={() => {
                                            setEditMode(true);
                                        }}
                                    >
                                        Edit Profile
                                    </Button>
                                )}
                            </>
                        )}

                        {editMode && (
                            <>
                                <Stack spacing={2}>
                                    <TextField
                                        label="Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                        InputLabelProps={{ style: { color: 'white' } }}
                                        inputProps={{ style: { color: 'white' } }}
                                        sx={{ bgcolor: "#2a2a2a", borderRadius: 1 }}
                                    />
                                    <TextField
                                        label="Email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                        InputLabelProps={{ style: { color: 'white' } }}
                                        inputProps={{ style: { color: 'white' } }}
                                        sx={{ bgcolor: "#2a2a2a", borderRadius: 1 }}
                                    />
                                    {/* <TextField
                                        label="Avatar URL"
                                        name="avatar"
                                        value={formData.avatar}
                                        onChange={handleChange}
                                        fullWidth
                                        InputLabelProps={{ style: { color: 'white' } }}
                                        inputProps={{ style: { color: 'white' } }}
                                        sx={{ bgcolor: "#2a2a2a", borderRadius: 1 }}
                                    /> */}
                                    <TextField
                                        label="Location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        fullWidth
                                        InputLabelProps={{ style: { color: 'white' } }}
                                        inputProps={{ style: { color: 'white' } }}
                                        sx={{ bgcolor: "#2a2a2a", borderRadius: 1 }}
                                    />
                                    <TextField
                                        label="Status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        fullWidth
                                        InputLabelProps={{ style: { color: 'white' } }}
                                        inputProps={{ style: { color: 'white' } }}
                                        sx={{ bgcolor: "#2a2a2a", borderRadius: 1 }}
                                    />
                                    <TextField
                                        label="Skills (comma separated)"
                                        name="skills"
                                        value={formData.skills}
                                        onChange={handleChange}
                                        fullWidth
                                        InputLabelProps={{ style: { color: 'white' } }}
                                        inputProps={{ style: { color: 'white' } }}
                                        sx={{ bgcolor: "#2a2a2a", borderRadius: 1 }}
                                    />
                                    <TextField
                                        label="Bio"
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        fullWidth
                                        multiline
                                        minRows={4}
                                        InputLabelProps={{ style: { color: 'white' } }}
                                        inputProps={{ style: { color: 'white' } }}
                                        sx={{ bgcolor: "#2a2a2a", borderRadius: 1 }}
                                    />

                                    {/* Experience Section */}
                                    <Typography variant="h6">Experience</Typography>
                                    {formData.experience.map((exp, idx) => (
                                        <Box key={idx} sx={{ bgcolor: "#2a2a2a", p: 2, borderRadius: 1, mb: 2 }}>
                                            <Stack spacing={1}>
                                                <TextField
                                                    label="Title"
                                                    value={exp.title}
                                                    onChange={(e) => handleNestedChange("experience", idx, "title", e.target.value)}
                                                    fullWidth
                                                    required
                                                    InputLabelProps={{ style: { color: 'white' } }}
                                                    inputProps={{ style: { color: 'white' } }}
                                                    sx={{ bgcolor: "#141414", borderRadius: 1 }}
                                                />
                                                <TextField
                                                    label="Company"
                                                    value={exp.company}
                                                    onChange={(e) => handleNestedChange("experience", idx, "company", e.target.value)}
                                                    fullWidth
                                                    required
                                                    InputLabelProps={{ style: { color: 'white' } }}
                                                    inputProps={{ style: { color: 'white' } }}
                                                    sx={{ bgcolor: "#141414", borderRadius: 1 }}
                                                />
                                                <TextField
                                                    label="Location"
                                                    value={exp.location}
                                                    onChange={(e) => handleNestedChange("experience", idx, "location", e.target.value)}
                                                    fullWidth
                                                    InputLabelProps={{ style: { color: 'white' } }}
                                                    inputProps={{ style: { color: 'white' } }}
                                                    sx={{ bgcolor: "#141414", borderRadius: 1 }}
                                                />
                                                <Stack direction="row" spacing={1}>
                                                    <TextField
                                                        label="From"
                                                        type="date"
                                                        value={exp.from}
                                                        onChange={(e) => handleNestedChange("experience", idx, "from", e.target.value)}
                                                        required
                                                        InputLabelProps={{ shrink: true, style: { color: 'white' } }}
                                                        inputProps={{ style: { color: 'white' } }}
                                                        sx={{ bgcolor: "#141414", borderRadius: 1, flex: 1 }}
                                                    />
                                                    <TextField
                                                        label="To"
                                                        type="date"
                                                        value={exp.to}
                                                        onChange={(e) => handleNestedChange("experience", idx, "to", e.target.value)}
                                                        disabled={exp.current}
                                                        InputLabelProps={{ shrink: true, style: { color: 'white' } }}
                                                        inputProps={{ style: { color: 'white' } }}
                                                        sx={{ bgcolor: "#141414", borderRadius: 1, flex: 1 }}
                                                    />
                                                </Stack>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={exp.current}
                                                            onChange={(e) => handleCheckboxChange("experience", idx, "current", e.target.checked)}
                                                            sx={{ color: "white" }}
                                                        />
                                                    }
                                                    label="Current"
                                                    sx={{ color: "white" }}
                                                />
                                                <TextField
                                                    label="Description"
                                                    value={exp.description}
                                                    onChange={(e) => handleNestedChange("experience", idx, "description", e.target.value)}
                                                    fullWidth
                                                    multiline
                                                    minRows={3}
                                                    InputLabelProps={{ style: { color: 'white' } }}
                                                    inputProps={{ style: { color: 'white' } }}
                                                    sx={{ bgcolor: "#141414", borderRadius: 1 }}
                                                />
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    startIcon={<RemoveIcon />}
                                                    onClick={() => removeEntry("experience", idx)}
                                                    sx={{ mt: 1 }}
                                                >
                                                    Remove Experience
                                                </Button>
                                            </Stack>
                                        </Box>
                                    ))}
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={() => addEntry("experience")}
                                        sx={{ mb: 2, alignSelf: "start", bgcolor: "#e50914", "&:hover": { bgcolor: "#b20710" } }}
                                    >
                                        Add Experience
                                    </Button>

                                    {/* Education Section */}
                                    <Typography variant="h6">Education</Typography>
                                    {formData.education.map((edu, idx) => (
                                        <Box key={idx} sx={{ bgcolor: "#2a2a2a", p: 2, borderRadius: 1, mb: 2 }}>
                                            <Stack spacing={1}>
                                                <TextField
                                                    label="School"
                                                    value={edu.school}
                                                    onChange={(e) => handleNestedChange("education", idx, "school", e.target.value)}
                                                    fullWidth
                                                    required
                                                    InputLabelProps={{ style: { color: 'white' } }}
                                                    inputProps={{ style: { color: 'white' } }}
                                                    sx={{ bgcolor: "#141414", borderRadius: 1 }}
                                                />
                                                <TextField
                                                    label="Degree"
                                                    value={edu.degree}
                                                    onChange={(e) => handleNestedChange("education", idx, "degree", e.target.value)}
                                                    fullWidth
                                                    required
                                                    InputLabelProps={{ style: { color: 'white' } }}
                                                    inputProps={{ style: { color: 'white' } }}
                                                    sx={{ bgcolor: "#141414", borderRadius: 1 }}
                                                />
                                                <Stack direction="row" spacing={1}>
                                                    <TextField
                                                        label="From"
                                                        type="date"
                                                        value={edu.from}
                                                        onChange={(e) => handleNestedChange("education", idx, "from", e.target.value)}
                                                        required
                                                        InputLabelProps={{ shrink: true, style: { color: 'white' } }}
                                                        inputProps={{ style: { color: 'white' } }}
                                                        sx={{ bgcolor: "#141414", borderRadius: 1, flex: 1 }}
                                                    />
                                                    <TextField
                                                        label="To"
                                                        type="date"
                                                        value={edu.to}
                                                        onChange={(e) => handleNestedChange("education", idx, "to", e.target.value)}
                                                        disabled={edu.current}
                                                        InputLabelProps={{ shrink: true, style: { color: 'white' } }}
                                                        inputProps={{ style: { color: 'white' } }}
                                                        sx={{ bgcolor: "#141414", borderRadius: 1, flex: 1 }}
                                                    />
                                                </Stack>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={edu.current}
                                                            onChange={(e) => handleCheckboxChange("education", idx, "current", e.target.checked)}
                                                            sx={{ color: "white" }}
                                                        />
                                                    }
                                                    label="Current"
                                                    sx={{ color: "white" }}
                                                />
                                                <TextField
                                                    label="Description"
                                                    value={edu.description}
                                                    onChange={(e) => handleNestedChange("education", idx, "description", e.target.value)}
                                                    fullWidth
                                                    multiline
                                                    minRows={3}
                                                    InputLabelProps={{ style: { color: 'white' } }}
                                                    inputProps={{ style: { color: 'white' } }}
                                                    sx={{ bgcolor: "#141414", borderRadius: 1 }}
                                                />
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    startIcon={<RemoveIcon />}
                                                    onClick={() => removeEntry("education", idx)}
                                                    sx={{ mt: 1 }}
                                                >
                                                    Remove Education
                                                </Button>
                                            </Stack>
                                        </Box>
                                    ))}
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={() => addEntry("education")}
                                        sx={{ mb: 2, alignSelf: "start", bgcolor: "#e50914", "&:hover": { bgcolor: "#b20710" } }}
                                    >
                                        Add Education
                                    </Button>

                                    {/* Social Profiles Section */}
                                    <Typography variant="h6">Social Profiles</Typography>
                                    {formData.social.map((social, idx) => (
                                        <Box key={idx} sx={{ bgcolor: "#2a2a2a", p: 2, borderRadius: 1, mb: 2 }}>
                                            <Stack spacing={1}>
                                                <TextField
                                                    label="Platform"
                                                    value={social.platform}
                                                    onChange={(e) => handleNestedChange("social", idx, "platform", e.target.value)}
                                                    fullWidth
                                                    InputLabelProps={{ style: { color: 'white' } }}
                                                    inputProps={{ style: { color: 'white' } }}
                                                    sx={{ bgcolor: "#141414", borderRadius: 1 }}
                                                />
                                                <TextField
                                                    label="Username"
                                                    value={social.username}
                                                    onChange={(e) => handleNestedChange("social", idx, "username", e.target.value)}
                                                    fullWidth
                                                    InputLabelProps={{ style: { color: 'white' } }}
                                                    inputProps={{ style: { color: 'white' } }}
                                                    sx={{ bgcolor: "#141414", borderRadius: 1 }}
                                                />
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    startIcon={<RemoveIcon />}
                                                    onClick={() => removeEntry("social", idx)}
                                                    sx={{ mt: 1 }}
                                                >
                                                    Remove Social
                                                </Button>
                                            </Stack>
                                        </Box>
                                    ))}
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={() => addEntry("social")}
                                        sx={{ mb: 2, alignSelf: "start", bgcolor: "#e50914", "&:hover": { bgcolor: "#b20710" } }}
                                    >
                                        Add Social Profile
                                    </Button>

                                    <Stack direction="row" spacing={2} mt={2}>
                                        <Button
                                            variant="contained"
                                            type="submit"
                                            sx={{ bgcolor: "#e50914", fontWeight: "bold", textTransform: "none" }}
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            onClick={() => setEditMode(false)}
                                            sx={{ color: "white", borderColor: "white", textTransform: "none" }}
                                        >
                                            Cancel
                                        </Button>
                                    </Stack>
                                </Stack>
                            </>
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}