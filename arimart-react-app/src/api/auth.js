import API from ".";

export const sendOtp = (mobileNumber) =>
  API.post('/auth/send-otp', { mobileNumber });

export const verifyOtp = (mobileNumber, OTP) =>
  API.post('/auth/login', {
    mobileNumber,
    otp: OTP
  });

export const registerUser = (name, email, phone,referral) =>
  API.post('/auth/register', {
    name,
    email,
    phone,
    refferalCode: referral
  });

export const logout = () =>
  API.post('/auth/logout');

export const getUserInfo = (userId) =>
  API.get(`/auth/user-info/${userId}`);

export const updateUserInfo = (userId, updateData) => {
  const formData = new FormData();

  if (updateData.name) formData.append("Name", updateData.name);
  if (updateData.email) formData.append("Email", updateData.email);
  if (updateData.address) formData.append("Address", updateData.address);
  if (updateData.vendorName) formData.append("VendorName", updateData.vendorName);
  if (updateData.image) formData.append("Image", updateData.image); // file

  return API.put(`/auth/update-user/${userId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

