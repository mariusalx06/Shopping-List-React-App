import React, { useEffect, useState } from "react";
import ItemList from "./ItemList";
import InputField from "./InputField";
import axios from "axios";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import DoneAllIcon from "@mui/icons-material/DoneAll";

function ToDoList() {
  const [items, setItem] = useState([]);
  const [inputText, setInputText] = useState("");
  const [editMode, setEditMode] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await axios.get("http://localhost:3000/todoapi/all");
      console.log(response.data);
      setItem(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  function writingText(event) {
    const { value } = event.target;
    setInputText(value);
  }

  async function addItem(event) {
    event.preventDefault();
    const newItem = { itemtext: inputText };
    try {
      const response = await axios.post(
        "http://localhost:3000/todoapi/createtodo",
        newItem
      );
    } catch (error) {
      console.log(error);
    }
    setInputText("");
    fetchData();
  }

  async function deleteItem(id) {
    try {
      const response = await axios.delete(
        `http://localhost:3000/todoapi/deletetodo/${id}`
      );
      setItem(items.filter((item) => item.id !== id));
    } catch (error) {
      console.log(error);
    }
  }
  async function completeAll(event) {
    event.preventDefault();
    try {
      await axios.delete("http://localhost:3000/todoapi/deleteall/");
    } catch (error) {
      console.log(error);
    }
    fetchData();
  }

  async function handleSaveEdit(id, updatedText) {
    setItem(
      items.map((item) =>
        item.id === id ? { ...item, itemtext: updatedText } : item
      )
    );
    const newItem = { itemtext: updatedText };
    try {
      await axios.put(
        `http://localhost:3000/todoapi/replacetodo/${id}`,
        newItem
      );
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="container">
      <div className="heading">
        <h1>Shopping List</h1>
      </div>
      <div className="formdiv">
        <InputField
          type="text"
          name="inputText"
          value={inputText}
          writingText={writingText}
        />
        <button onClick={addItem} type="submit">
          <AddShoppingCartIcon style={{ verticalAlign: "middle" }} />
        </button>
        <button className="completeButton" onClick={completeAll} type="button">
          <DoneAllIcon style={{ verticalAlign: "middle" }} />
        </button>
      </div>
      <div>
        <ul>
          {items.map((item, index) => (
            <ItemList
              key={index}
              id={item.id}
              content={item.itemtext}
              onDelete={deleteItem}
              onSave={handleSaveEdit}
              isEditMode={editMode === item.id}
              setEditMode={setEditMode}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ToDoList;
