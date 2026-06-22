import { useEffect, useState } from "react";

interface TestEntry {
  id: number;
  message: string;
}

function App() {
  const [entries, setEntries] = useState<TestEntry[]>([]);
  const [input, setInput] = useState("");

  const fetchEntries = async () => {
    const res = await fetch("http://localhost:8080/api/entries");
    const data = await res.json();
    setEntries(data);
  };

  const addEntry = async () => {
    if (!input.trim()) return;
    await fetch("http://localhost:8080/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });
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
        {entries.map((e) => (
          <li key={e.id}>{e.message}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;