// ======================================
// API CLIENT -  ÎËÂÌÚ ‰Îˇ ‡·ÓÚ˚ Ò ·˝ÍÂÌ‰ÓÏ
// ======================================

// ŒÔÂ‰ÂÎˇÂÏ ·‡ÁÓ‚˚È URL API
const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:3000/api"
  : "https://beautypass-website.onrender.com/api";

console.log("?? API Base URL:", API_BASE_URL);

// ======================================
// ¬—œŒÃŒ√¿“≈À‹Õ€≈ ‘”Õ ÷»»
// ======================================

async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`?? API Request: ${options.method || "GET"} ${url}`);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers
      }
    });
    
    const contentType = response.headers.get("content-type");
    let data;
    
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      try { data = JSON.parse(text); } catch { data = { message: text }; }
    }
    
    console.log(`?? API Response [${response.status}]:`, data);
    
    if (!response.ok) {
      throw new Error(data.message || "???????? ???????");
    }
    
    return data;
  } catch (error) {
    console.error("? API Error:", error);
    throw error;
  }
}

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function authApiCall(endpoint, options = {}) {
  return apiCall(endpoint, {
    ...options,
    headers: { ...getAuthHeaders(), ...options.headers }
  });
}

// ======================================
// œ”¡À»◊Õ€≈ «¿œ–Œ—€
// ======================================

async function checkApiStatus() {
  return apiCall("/status");
}

async function fetchPackages() {
  try {
    return await apiCall("/packages");
  } catch (error) {
    console.error("? ????????? ?????????? ???????:", error);
    return [];
  }
}

async function fetchSalons() {
  try {
    return await apiCall("/salons");
  } catch (error) {
    console.error("? ????????? ?????????? ???????:", error);
    return [];
  }
}

async function fetchServices() {
  try {
    return await apiCall("/services");
  } catch (error) {
    console.error("? ?????????????? ?????????? ???????:", error);
    return [];
  }
}

async function fetchSalonSlotsByName(salonName, date) {
  try {
    return await apiCall(`/salons/${encodeURIComponent(salonName)}/slots?date=${date}`);
  } catch (error) {
    console.error("? ???????? ?????????? ???????:", error);
    return [];
  }
}

async function fetchSalonServices(salonId) {
  try {
    return await apiCall(`/salons/${salonId}/services`);
  } catch (error) {
    console.error("? ??????? ?????????????? ???????:", error);
    return [];
  }
}

async function checkAvailability(type, value) {
  return apiCall(`/check-availability?type=${type}&value=${encodeURIComponent(value)}`);
}

// ======================================
// ¿”“≈Õ“»‘» ¿÷»ﬂ
// ======================================

async function registerUser(userData) {
  console.log("?? ???????????:", userData);
  return apiCall("/register", {
    method: "POST",
    body: JSON.stringify(userData)
  });
}

async function loginUser(credentials) {
  console.log("?? ??????:", credentials.email);
  return apiCall("/login", {
    method: "POST",
    body: JSON.stringify(credentials)
  });
}

async function verify2FA(email, code) {
  console.log("?? 2FA ???????????:", email);
  const data = await apiCall("/confirm-2fa", {
    method: "POST",
    body: JSON.stringify({ email, code })
  });
  
  if (data.token && data.user) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    console.log("? ??????????? ????????????");
  }
  
  return data;
}

async function resendVerificationCode(email) {
  console.log("?? ????? ??????? ????????:", email);
  return apiCall("/auth/send-verification-code", {
    method: "POST",
    body: JSON.stringify({ email })
  });
}

// ======================================
// œŒÀ‹«Œ¬¿“≈À‹— »≈ «¿œ–Œ—€
// ======================================

async function fetchProfile() {
  return authApiCall("/profile");
}

async function buyPackage(plan, price) {
  return authApiCall("/packages/buy", {
    method: "POST",
    body: JSON.stringify({ plan, price })
  });
}

async function addBalance(amount) {
  return authApiCall("/balance/add", {
    method: "POST",
    body: JSON.stringify({ amount })
  });
}

async function createBooking(bookingData) {
  return authApiCall("/bookings", {
    method: "POST",
    body: JSON.stringify(bookingData)
  });
}

async function fetchMyBookings() {
  try {
    return await authApiCall("/bookings");
  } catch (error) {
    console.error("? ????????? ?????????? ???????:", error);
    return [];
  }
}

async function cancelBookingById(bookingId) {
  return authApiCall(`/bookings/${bookingId}/cancel`, {
    method: "PUT"
  });
}

// ======================================
// «¿œ–Œ—€ ¬À¿ƒ≈À‹÷¿ —¿ÀŒÕ¿
// ======================================

async function fetchSalonOwnerServices() {
  try {
    return await authApiCall("/salon-owner/services");
  } catch (error) {
    console.error("? ?????????????? ???????:", error);
    return [];
  }
}

async function addSalonService(serviceData) {
  return authApiCall("/salon-owner/services", {
    method: "POST",
    body: JSON.stringify(serviceData)
  });
}

async function updateSalonService(serviceId, serviceData) {
  return authApiCall(`/salon-owner/services/${serviceId}`, {
    method: "PUT",
    body: JSON.stringify(serviceData)
  });
}

async function deleteSalonService(serviceId) {
  return authApiCall(`/salon-owner/services/${serviceId}`, {
    method: "DELETE"
  });
}

async function addSlots(slotData) {
  return authApiCall("/slots", {
    method: "POST",
    body: JSON.stringify(slotData)
  });
}

async function fetchSalonSlots() {
  try {
    return await authApiCall("/salon-owner/slots");
  } catch (error) {
    console.error("? ???????? ???????:", error);
    return [];
  }
}

async function deleteSlotById(slotId) {
  return authApiCall(`/slots/${slotId}`, {
    method: "DELETE"
  });
}

async function fetchSalonBookings() {
  try {
    return await authApiCall("/salon-owner/bookings");
  } catch (error) {
    console.error("? ????????? ???????:", error);
    return [];
  }
}

async function fetchSalonStatistics() {
  try {
    return await authApiCall("/salon-owner/statistics");
  } catch (error) {
    console.error("? ??????????? ???????:", error);
    return {
      totalSlots: 0, availableSlots: 0, bookedSlots: 0,
      totalBookings: 0, activatedVisits: 0, validCancellations: 0,
      lateCancellations: 0, totalBPSpent: 0, refundableBP: 0, nonRefundableBP: 0
    };
  }
}

// ======================================
// œÀ¿“≈∆»
// ======================================

async function createTransaction(amount) {
  return authApiCall("/transactions/create", {
    method: "POST",
    body: JSON.stringify({ amount })
  });
}

async function getTransactionStatus(transactionId) {
  return apiCall(`/transactions/${transactionId}/status`);
}

console.log("? api-client.js ????????? ??????????!");
