import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserCard from "./UserCard";
import './UserListPage.css';

export default function UserListPage() {
  const { role } = useParams(); // "devops" ou "technicien"
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:3003/api/v1/user", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Erreur lors du fetch des users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleClick = (user) => {
    navigate(`/users/${user.matricule}`);
  };

  if (loading) return <h2 className="loading-text">Loading users...</h2>;
  if (error) return <h2 className="error-text">Error: {error}</h2>;

  // Filtrage par rôle
  const filteredUsers = role ? users.filter(u => u.role === role) : users;

  return (
    <div className="user-list-wrapper">
      <h2>Liste des {role ? role.charAt(0).toUpperCase() + role.slice(1) : "utilisateurs"}</h2>

      {filteredUsers.length === 0 && (
        <p className="user-list-empty">Aucun utilisateur trouvé</p>
      )}

      <div className="user-list-grid">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="user-card-wrapper"
            onClick={() => handleClick(user)}
          >
            <UserCard user={user} />
          </div>
        ))}
      </div>
    </div>
  );
}
