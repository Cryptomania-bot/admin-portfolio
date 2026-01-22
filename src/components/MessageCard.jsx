export default function MessageCard({ msg, onDelete }) {
  return (
    <div className="message-card">
      <h4>{msg.name}</h4>
      <p>{msg.email}</p>
      <p>{msg.phone}</p>
      <p>{msg.message}</p>
      <button onClick={() => onDelete(msg._id)} className="del">Delete</button>
    </div>
  );
}
