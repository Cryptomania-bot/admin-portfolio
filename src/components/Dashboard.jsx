import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MessageCard from "./MessageCard.jsx";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("messages");
  const [messages, setMessages] = useState([]);
  const [socials, setSocials] = useState([]);
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);

  // Form States
  const [socialForm, setSocialForm] = useState({ icon: "", url: "" });
  const [serviceForm, setServiceForm] = useState({ title: "", description: "", icon: "" });
  const [projectForm, setProjectForm] = useState({ title: "", description: "", image: "", url: "" });
  const [editingId, setEditingId] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL || "https://portfolio-backend-production-d48f.up.railway.app/api";

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchData();
  }, [navigate, token]);

  const fetchData = () => {
    // Fetch Messages
    fetch(`${API_URL}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok ? res.json() : [])
      .then((data) => {
        if (Array.isArray(data)) setMessages(data);
      })
      .catch(() => navigate("/login"));

    // Fetch Content
    fetch(`${API_URL}/content/socials`).then(res => res.json()).then(setSocials);
    fetch(`${API_URL}/content/services`).then(res => res.json()).then(setServices);
    fetch(`${API_URL}/content/projects`).then(res => res.json()).then(setProjects);
  };

  // Generic Handlers
  const handleDelete = async (endpoint, id, setter, list) => {
    if(!confirm("Are you sure you want to delete this item?")) return;
    await fetch(`${API_URL}/${endpoint}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setter(list.filter((item) => item._id !== id));
  };

  const handleSave = async (e, endpoint, form, setForm, setter, list) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${endpoint}/${editingId}` : `${API_URL}/${endpoint}`;
    
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    });
    
    if (res.ok) {
      const savedItem = await res.json();
      if (editingId) {
        setter(list.map(item => item._id === editingId ? savedItem : item));
        setEditingId(null);
      } else {
        setter([...list, savedItem]);
      }
      // Reset form based on type
      if(endpoint.includes("social")) setForm({ icon: "", url: "" });
      if(endpoint.includes("service")) setForm({ title: "", description: "", icon: "" });
      if(endpoint.includes("project")) setForm({ title: "", description: "", image: "", url: "" });
    } else {
      alert("Failed to save item");
    }
  };

  const startEdit = (item, setForm) => {
    setEditingId(item._id);
    setForm(item);
  };

  const cancelEdit = (setForm, defaultState) => {
    setEditingId(null);
    setForm(defaultState);
  }

  return (
    <div className="dashboard-container">
      <nav className="sidebar">
        <h2>Admin Panel</h2>
        <button className={activeTab === "messages" ? "active" : ""} onClick={() => setActiveTab("messages")}>Messages</button>
        <button className={activeTab === "socials" ? "active" : ""} onClick={() => setActiveTab("socials")}>Social Handles</button>
        <button className={activeTab === "services" ? "active" : ""} onClick={() => setActiveTab("services")}>Services</button>
        <button className={activeTab === "projects" ? "active" : ""} onClick={() => setActiveTab("projects")}>Projects</button>
        <button className="logout" onClick={() => { localStorage.clear(); navigate("/login"); }}>Logout</button>
      </nav>

      <div className="content">
        {/* MESSAGES */}
        {activeTab === "messages" && (
          <div className="section">
            <h3>Messages</h3>
            <div className="grid">
              {messages.length === 0 ? <p>No messages found.</p> : messages.map(m => (
                <MessageCard key={m._id} msg={m} onDelete={(id) => handleDelete("messages", id, setMessages, messages)} />
              ))}
            </div>
          </div>
        )}

        {/* SOCIALS */}
        {activeTab === "socials" && (
          <div className="section">
            <h3>Manage Social Handles</h3>
            <form onSubmit={(e) => handleSave(e, "content/socials", socialForm, setSocialForm, setSocials, socials)}>
              <input type="text" placeholder="Icon Class (e.g. bx bxl-facebook)" value={socialForm.icon} onChange={e => setSocialForm({...socialForm, icon: e.target.value})} required />
              <input type="text" placeholder="URL" value={socialForm.url} onChange={e => setSocialForm({...socialForm, url: e.target.value})} required />
              <button type="submit">Add Social</button>
            </form>
            <ul className="list">
              {socials.map(s => (
                <li key={s._id}>
                  <span><i className={s.icon}></i> {s.url}</span>
                  <button className="delete-btn" onClick={() => handleDelete("content/socials", s._id, setSocials, socials)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* SERVICES */}
        {activeTab === "services" && (
          <div className="section">
            <h3>Manage Services</h3>
            <form onSubmit={(e) => handleSave(e, "content/services", serviceForm, setServiceForm, setServices, services)}>
              <input type="text" placeholder="Title" value={serviceForm.title} onChange={e => setServiceForm({...serviceForm, title: e.target.value})} required />
              <input type="text" placeholder="Icon Class (e.g. bx bx-code)" value={serviceForm.icon} onChange={e => setServiceForm({...serviceForm, icon: e.target.value})} required />
              <textarea placeholder="Description" value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} required />
              <div className="form-actions">
                <button type="submit">{editingId ? "Update" : "Add"} Service</button>
                {editingId && <button type="button" onClick={() => cancelEdit(setServiceForm, {title:"", description:"", icon:""})}>Cancel</button>}
              </div>
            </form>
            <div className="grid">
              {services.map(s => (
                <div key={s._id} className="card">
                  <h4><i className={s.icon}></i> {s.title}</h4>
                  <p>{s.description}</p>
                  <div className="actions">
                    <button onClick={() => startEdit(s, setServiceForm)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete("content/services", s._id, setServices, services)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROJECTS */}
        {activeTab === "projects" && (
          <div className="section">
            <h3>Manage Projects</h3>
            <form onSubmit={(e) => handleSave(e, "content/projects", projectForm, setProjectForm, setProjects, projects)}>
              <input type="text" placeholder="Project Title" value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} required />
              <input type="text" placeholder="Image URL" value={projectForm.image} onChange={e => setProjectForm({...projectForm, image: e.target.value})} required />
              <input type="text" placeholder="Project URL" value={projectForm.url} onChange={e => setProjectForm({...projectForm, url: e.target.value})} required />
              <textarea placeholder="Description" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} required />
              <div className="form-actions">
                <button type="submit">{editingId ? "Update" : "Add"} Project</button>
                {editingId && <button type="button" onClick={() => cancelEdit(setProjectForm, {title:"", description:"", image:"", url:""})}>Cancel</button>}
              </div>
            </form>
            <div className="grid">
              {projects.map(p => (
                <div key={p._id} className="card">
                  <img src={p.image} alt={p.title} style={{width: "100%", height: "150px", objectFit: "cover", borderRadius: "4px"}} />
                  <h4>{p.title}</h4>
                  <p>{p.description}</p>
                  <a href={p.url} target="_blank" rel="noreferrer" style={{display: "block", marginBottom: "10px", color: "#0ef"}}>View Project</a>
                  <div className="actions">
                    <button onClick={() => startEdit(p, setProjectForm)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete("content/projects", p._id, setProjects, projects)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
