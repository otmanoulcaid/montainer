import { useFetch } from "../../hooks/useFetch";

export default function ContainerList() {
    const { data: containers, loading, error } = useFetch(
        "http://localhost:3003/api/v1/container"
    );

    if (loading) return <p>Loading containers...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>Containers</h2>
            <ul>
                {containers.map((c) => (
                    <li key={c.id}>
                        {c.name} - {c.status}
                    </li>
                ))}
            </ul>
        </div>
    );
}
