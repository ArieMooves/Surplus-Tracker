"use client"
import { useState } from "react"
import { addAsset } from "../../lib/api"

export default function AddAsset() {
  const [form, setForm] = useState({
    id: "",
    asset_tag: "",
    item_name: "",
    condition: "",
    current_status: "active",
  })

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const result = await addAsset({
      ...form,
      id: Number(form.id),
    })

    alert(result.message || result.error)
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Add Asset</h1>

      <input name="id" placeholder="ID" onChange={handleChange} />
      <input name="asset_tag" placeholder="Asset Tag" onChange={handleChange} />
      <input name="item_name" placeholder="Item Name" onChange={handleChange} />
      <input name="condition" placeholder="Condition" onChange={handleChange} />

      <button type="submit">Add</button>
    </form>
  )
}
