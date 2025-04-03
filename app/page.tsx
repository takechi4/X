"use client";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");

  const handleLoad = async () => {
    setLoading(true);
    setPosts([]);
    setTitle("");
    const tidMatch = url.match(/tid=(\d+)/);
    if (!tidMatch) {
      alert("tid=がURLに含まれていません");
      setLoading(false);
      return;
    }
    const tid = tidMatch[1];
    const allPosts = [];
    let finalTitle = "";
    for (let tp = 50; tp >= 1; tp--) {
      const res = await fetch(`/api/bakusai?tid=${tid}&tp=${tp}`);
      const data = await res.json();
      if (data.posts.length === 0) break;
      if (!finalTitle && data.title) finalTitle = data.title;
      allPosts.push(...data.posts);
    }
    setTitle(finalTitle);
    setPosts(allPosts.reverse());
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 20 }}>
      <h1>爆サイスーパービューア（CORS回避版）</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          type="text"
          placeholder="爆サイスレッドのURLを貼ってください"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={handleLoad} disabled={loading}>
          {loading ? "読み込み中..." : "読み込む"}
        </button>
      </div>
      {title && <h2>🧵 {title}</h2>}
      {posts.map((post, i) => (
        <div key={i} style={{ border: "1px solid #ccc", padding: 8, marginBottom: 8 }}>
          <div style={{ fontSize: 12, color: "#666" }}>{post.num} {post.date}</div>
          <div dangerouslySetInnerHTML={{ __html: post.msg }} />
        </div>
      ))}
      {posts.length > 0 && (
        <p style={{ textAlign: "center", color: "#888" }}>
          ✅ 全{posts.length}件のレスを読み込み完了
        </p>
      )}
    </div>
  );
}