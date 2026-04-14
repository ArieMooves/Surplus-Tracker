const handleGenerateDescription = async () => {
  
  if (!formData.item_name) {
    alert("Please enter an Item Name first so Gemini can describe it.");
    return;
  }

  setLoading(true);
  try {
    
    const response = await fetch('http://localhost:8000/generate-description', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        
        item_name: formData.item_name, 
        condition: formData.condition || "Good" // Providing a default if empty
      }),
    });
    
    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();
    if (data.description) {
      setFormData({ ...formData, description: data.description });
    }
  } catch (error) {
    console.error("Gemini Error:", error);
    alert("Failed to connect to Gemini. Make sure your backend server is running.");
  } finally {
    setLoading(false);
  }
};

return (
  <form className="space-y-4">
    {/* ... other input fields for Name, Tag, etc. ... */}

    <div className="flex flex-col">
      <label className="font-semibold text-gray-700">Description</label>
      <div className="flex items-start gap-2">
        <textarea
          className="w-full p-2 border rounded-md shadow-sm"
          rows="3"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Enter details or use the AI generator..."
        />
        
        {/* JSX EDIT */}
        <button
          type="button"
          onClick={handleGenerateDescription}
          disabled={loading}
          className="whitespace-nowrap bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition disabled:bg-gray-400"
        >
          {loading ? "Thinking..." : "Auto-fill"}
        </button>
      </div>
    </div>

    {/* ... Submit Button ... */}
  </form>
);
