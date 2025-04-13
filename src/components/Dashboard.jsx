export default function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome Home 🎉</h1>
      <button
        onClick={() => {
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          window.location.reload();
        }}
        className="mt-4 text-blue-600 hover:underline"
      >
        Log Out
      </button>
    </div>
  );
}