import { useEffect, useState } from "react";
import "./DashboardStats.css";

export default function DashboardStats() {
    const [stats, setStats] = useState([]);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:3003/ws/v1/container/stats");

        ws.onopen = () => setConnected(true);
        ws.onclose = () => setConnected(false);
        ws.onerror = () => setConnected(false);

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setStats(data);
            } catch { }
        };
        return () => ws.close();
    }, []);

    const handleDetails = (id) => {
        console.log("Voir détails du container :", id);
    };

    return (
        <div className="ds-container">
            <div className="ds-header">
                <h2>Containers Live Stats</h2>
                <span className={`ds-status ${connected ? "on" : "off"}`}></span>
            </div>

            {stats.length === 0 ? (
                <p className="empty">les ressources sont entrain de se charger...</p>
            ) : (
                <table className="ds-table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>CPU (%)</th>
                            <th>Mémoire (MB)</th>
                            <th>Limite Memoire</th>
                            <th>Entrée</th>
                            <th>Sortie</th>
                        </tr>
                    </thead>

                    <tbody>
                        {stats.map((c) => (
                            <tr key={c.id}>
                                <td>{c.name}</td>
                                <td><span className="tag tag-cpu">{c.cpu}%</span></td>
                                <td><span className="tag tag-mem">{c.memory}</span></td>
                                <td>{c.memoryLimit}</td>
                                <td>{c.network.Input}</td>
                                <td>{c.network.Output}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
