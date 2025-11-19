import { useState } from "react";
import "./CreateContainer.css";
import { useNavigate } from 'react-router-dom'

export default function CreateContainer() {
    const [form, setForm] = useState({
        name: "",
        image: "",
        hostPort: "",
        containerPort: "",
    });
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await fetch(`
                http://172.19.80.1:3003/api/v1/container`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // <-- IMPORTANT
                },
                body: JSON.stringify(form),
                credentials: 'include',
            });
            if (result.ok)
                navigate('/containers')
            if (!result.ok && result.status == 403)
                alert('vous n\'etes pas autorisé a faire une telle operation')
            setForm({ name: "", image: "", hostPort: "", containerPort: "" });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cf-wrapper">
            <h2 className="cf-title">Lancer un nouveau conteneur</h2>
            <form className="cf-form" onSubmit={handleSubmit}>
                <label>
                    Nom du conteneur
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="webapp-front"
                        required
                    />
                </label>

                <label>
                    Image
                    <input
                        type="text"
                        name="image"
                        value={form.image}
                        onChange={handleChange}
                        placeholder="ubuntu:24.04"
                        required
                    />
                </label>

                <label>
                    Port hôte
                    <input
                        type="number"
                        name="hostPort"
                        value={form.hostPort}
                        onChange={handleChange}
                        placeholder="8080"
                        required
                    />
                </label>

                <label>
                    Port conteneur
                    <input
                        type="number"
                        name="containerPort"
                        value={form.containerPort}
                        onChange={handleChange}
                        placeholder="80"
                        required
                    />
                </label>

                <button type="submit" className="cf-btn" disabled={loading}>
                    {loading ? "Lancement..." : "Lancer le conteneur"}
                </button>
            </form>
        </div>
    );
}
