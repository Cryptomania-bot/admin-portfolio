const BASE_URL = "https://portfolio-backend-production-d48f.up.railway.app/api"
// const BASE_URL = "http://localhost:5000/api";

/* ADMIN LOGIN */
export async function loginAdmin(data) {
  const res = await fetch(`${BASE_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || `Error: ${res.status}`);
  }
  return res.json();
}

/* GET MESSAGES */
export async function getMessages(token) {
  const res = await fetch(`${BASE_URL}/messages`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Error: ${res.status}`);
  }
  return res.json();
}

/* DELETE MESSAGE */
export async function deleteMessage(id, token) {
  const res = await fetch(`${BASE_URL}/messages/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Error: ${res.status}`);
  }
  return res.json();
}
