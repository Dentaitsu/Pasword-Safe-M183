import { useEffect, useState } from "react";
import { TestApi, type TestEntry } from "./api";

const testApi = new TestApi();

function App() {
    const [entries, setEntries] = useState<TestEntry[]>([]);
    const [input, setInput] = useState("");

    const fetchEntries = async () => {
        const result = await testApi.testGetAllTestEntries();
        setEntries(result);
    };

    const addEntry = async () => {
        if (!input.trim()) return;
        await testApi.testCreateTestEntry({ createTestEntryCommand: { message: input } });
        setInput("");
        fetchEntries();
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    return (
        <div style={{ padding: "2rem" }}>
            <h1>DB Test</h1>
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter a message"
            />
            <button onClick={addEntry}>Save</button>
            <ul>
                {entries.map((e, i) => (
                    <li key={i}>{e.message}</li>
                ))}
            </ul>
        </div>
    );
}

export default App;