import './UserCard.css';

export default function UserCard({ user }) {
    // Ici on peut déterminer un dot en fonction de role ou expérience
    const getRoleDotClass = (role) => {
        switch (role) {
            case 'devops': return 'dot--green';
            case 'technicien': return 'dot--blue';
            case 'manager': return 'dot--red';
            default: return 'dot--gray';
        }
    };

    return (
        <div className="user-card">
            <div className="user-left">
                <div className={`user-dot ${getRoleDotClass(user.role)}`} aria-hidden />
                <img className="user-avatar" src={"/assila.jpeg"} alt={user.fullName} />
                <div className="user-meta">
                    <div className="user-name">{user.fullName}</div>
                    <div className="user-role">{user.metier}</div>
                    <div className="user-exp">{user.experience} ans d'expérience</div>
                </div>
            </div>
            <div className="user-right">
                <button className="user-btn">Voir profil</button>
            </div>
        </div>
    );
}
