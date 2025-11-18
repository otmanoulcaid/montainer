import { useFetch } from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import './ContainerList.css';

export default function ContainerList() {
    const navigate = useNavigate();
    const { data: containers, loading } = useFetch(
        `http://192.168.100.38:3003/api/v1/container`
    );

    const getMeta = (status) => {
        switch (status) {
            case 'running':
                return { label: 'Running', cls: 'dot--green' };
            case 'stopped':
                return { label: 'Stopped', cls: 'dot--gray' };
            case 'exited':
                return { label: 'Exited', cls: 'dot--red' };
            default:
                return { label: 'Unknown', cls: 'dot--gray-light' };
        }
    };

    function clickHandler() {
        navigate('/containers/new');
    }

    return (
        <div className="cl-wrapper">

            {/* Header */}
            <div className="cl-header">
                <h2 className="cl-title">Containers</h2>
                <button onClick={clickHandler} className="cl-create-btn">+ Créer un conteneur</button>
            </div>

            {/* List */}
            <ul className="cl-list">
                {loading && <li className="cl-empty">Chargement...</li>}

                {!loading && containers?.length === 0 && (
                    <li className="cl-empty">Aucun container disponible</li>
                )}

                {!loading && containers?.map((c) => {
                    const meta = getMeta(c.state);
                    return (
                        <li key={c.id} className="cl-item">
                            <div className="cl-left">
                                <div className={`cl-dot ${meta.cls}`}></div>

                                <div className="cl-meta">
                                    <div className="cl-name">{c.name}</div>
                                    <div className="cl-id">ID: {c.id}</div>
                                </div>
                            </div>

                            <div className="cl-right">
                                <span className="cl-status">{meta.label}</span>
                                
                                {/* Bouton navigable */}
                                <button
                                    className="cl-btn"
                                    onClick={() => navigate(`/containers/${c.id}`)}
                                >
                                    Détails
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>

        </div>
    );
}
