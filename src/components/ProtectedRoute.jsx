export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return null;
  return children;
}
