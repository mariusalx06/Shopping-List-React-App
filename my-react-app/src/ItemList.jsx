import React, { useState, useEffect } from "react";
import BackspaceIcon from "@mui/icons-material/Backspace";
import EditNoteIcon from "@mui/icons-material/EditNote";
import SaveIcon from "@mui/icons-material/Save";
import InputField from "./InputField";
import CloseIcon from "@mui/icons-material/Close";

function ItemList(props) {
  const [newInputText, setNewInputText] = useState(props.content);

  useEffect(() => {
    setNewInputText(props.content);
  }, [props.content]);

  function writingText(event) {
    const { value } = event.target;
    setNewInputText(value);
  }

  function handleDelete(event) {
    props.onDelete(props.id);
    props.setEditMode(null);
    event.preventDefault();
  }

  function handleEdit(event) {
    props.setEditMode(props.id);
    event.preventDefault();
  }

  function handleSave(event) {
    props.onSave(props.id, newInputText);
    props.setEditMode(null);
    event.preventDefault();
  }
  function handleCancel(event) {
    setNewInputText(props.content);
    props.setEditMode(null);
    event.preventDefault();
  }

  return (
    <div>
      <li>
        {props.isEditMode ? (
          <>
            <InputField
              type="text"
              name="inputText"
              value={newInputText}
              writingText={writingText}
            />

            <button onClick={handleDelete} className="deleteButton">
              <BackspaceIcon style={{ verticalAlign: "middle" }} />
            </button>
            <button onClick={handleSave} className="saveButton">
              <SaveIcon style={{ fontSize: "25px", verticalAlign: "middle" }} />
            </button>
            <button onClick={handleCancel} className="cancelButton">
              <CloseIcon
                style={{ fontSize: "25px", verticalAlign: "middle" }}
              />
            </button>
          </>
        ) : (
          <>
            {props.content}
            <button onClick={handleDelete} className="deleteButton">
              <BackspaceIcon style={{ verticalAlign: "middle" }} />
            </button>
            <button onClick={handleEdit} className="editButton">
              <EditNoteIcon
                style={{ fontSize: "25px", verticalAlign: "middle" }}
              />
            </button>
          </>
        )}
      </li>
    </div>
  );
}

export default ItemList;
