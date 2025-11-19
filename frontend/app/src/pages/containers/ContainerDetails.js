import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ContainerDetails.css";

export default function ContainerDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [container, setContainer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);

    const fetchDetails = async () => {
        try {
            const res = await fetch(
                `http://172.19.80.1:3003/api/v1/container/${id}`, {
                credentials: "include"
            });
            if (!res.ok) throw new Error("Container introuvable");
            const data = await res.json();
            setContainer(data);
        } catch (err) {
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const action = async (type, method) => {
        setBusy(true);
        try {
            const response = await fetch(`http://172.19.80.1:3003/api/v1/container/${id}/${type}`, {
                method,
                credentials: "include"
            });
            if (response.ok)
                navigate(-1);
            if (!response.ok && response.status == 403)
                alert('vous n\'etes pas autorisé de faire une telle operation')
            await fetchDetails(); // refresh data
        } catch (err) {
            console.error(err);
        }
        setBusy(false);
    };

    useEffect(() => {
        fetchDetails();
    }, []);

    if (loading) return <div className="cd-loading">Chargement...</div>;
    if (!container) return <div>Container introuvable</div>;

    const stateMeta = {
        running: { label: "Running", cls: "cd-running" },
        stopped: { label: "Stopped", cls: "cd-stopped" },
        exited: { label: "Exited", cls: "cd-exited" }
    };

    const stateInfo = container.State?.Status || container.State?.status || "unknown";

    return (
        <div className="cd-wrapper">
            <button className="cd-back" onClick={() => navigate(-1)}>← Retour</button>

            <div className="cd-header">
                <h2>{container.Name || container.Id.substring(0, 12)}</h2>
                <span className={`cd-badge ${stateMeta[stateInfo]?.cls || "cd-unknown"}`}>
                    {stateInfo.toUpperCase()}
                </span>
            </div>

            <div className="cd-cards">

                <div className="cd-card">
                    <h3>Général</h3>
                    <p><strong>ID:</strong> {container.Id}</p>
                    <p><strong>Image:</strong> {container.Image}</p>
                    <p><strong>Path:</strong> {container.Path} {container.Args?.join(" ")}</p>
                    <p><strong>Created:</strong> {new Date(container.Created).toLocaleString()}</p>
                    <p><strong>Platform:</strong> {container.Platform}</p>
                    <p><strong>RestartCount:</strong> {container.RestartCount}</p>
                </div>

                <div className="cd-card">
                    <h3>État</h3>
                    <p><strong>Running:</strong> {container.State?.Running ? "✅" : "❌"}</p>
                    <p><strong>Paused:</strong> {container.State?.Paused ? "✅" : "❌"}</p>
                    <p><strong>Restarting:</strong> {container.State?.Restarting ? "✅" : "❌"}</p>
                    <p><strong>OOMKilled:</strong> {container.State?.OOMKilled ? "✅" : "❌"}</p>
                </div>

                <div className="cd-card">
                    <h3>Réseau & Ports</h3>
                    {container.NetworkSettings?.Ports ? (
                        Object.entries(container.NetworkSettings.Ports).map(([port, val]) => (
                            <p key={port}><strong>{port}:</strong> {val?.map(v => v.HostPort).join(", ") || "–"}</p>
                        ))
                    ) : <p>Aucun port exposé</p>}
                </div>

                <div className="cd-card">
                    <h3>Volumes</h3>
                    {container.Mounts?.length > 0 ? container.Mounts.map((m, i) => (
                        <p key={i}><strong>{m.Destination}</strong> → {m.Source}</p>
                    )) : <p>Aucun volume</p>}
                </div>
            </div>

            <div className="cd-actions">
                <button className="cd-btn cd-start" disabled={busy || container.State?.Running} onClick={() => action("start", 'PUT')}>Start</button>
                <button className="cd-btn cd-stop" disabled={busy || !container.State?.Running} onClick={() => action("stop", "PUT")}>Stop</button>
                <button className="cd-btn cd-restart" disabled={busy} onClick={() => action("restart", 'PUT')}>Restart</button>
                <button className="cd-btn cd-delete" disabled={busy} onClick={() => action("", 'DELETE')}>Delete</button>
            </div>
        </div>
    );
}
