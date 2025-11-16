import { useFetch } from "../../hooks/useFetch";
import './ContainerList.css';

export default function ContainerList() {
    const { data: containers, loading, error } = useFetch(
        "http://localhost:3003/api/v1/container"
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

    return (
        <div className="cl-wrapper">
            <h2 className="cl-title">Containers</h2>

            <ul className="cl-list">
                {containers?.length === 0 && (
                    <li className="cl-empty">Aucun container disponible</li>
                )}

                {containers?.map((c) => {
                    const meta = getMeta(c.state);
                    return (
                        <li key={c.id} className="cl-item">
                            <div className="cl-left">
                                <div className={`cl-dot ${meta.cls}`} aria-hidden></div>
                                <div className="cl-meta">
                                    <div className="cl-name">{c.name}</div>
                                    <div className="cl-id">ID: {String(c.id)}</div>
                                </div>
                            </div>

                            <div className="cl-right">
                                <div className="cl-status">{meta.label}</div>
                                <button className="cl-btn">Détails</button>
                            </div>
                        </li>
                    );
                })}
            </ul>

            <div className="cl-legend">
                <div className="cl-legend-item"><span className="cl-dot dot--green" /> Running</div>
                <div className="cl-legend-item"><span className="cl-dot dot--gray" /> Stopped</div>
                <div className="cl-legend-item"><span className="cl-dot dot--red" /> Exited</div>
            </div>
        </div>
    );
}

