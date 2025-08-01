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

export const updateUserInfo = (userId, updateData) =>
  API.put(`/auth/update-user/${userId}`, updateData);
