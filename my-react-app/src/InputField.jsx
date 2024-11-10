import React, { useState } from "react";

function InputField(props) {
  return (
    <input
      onChange={props.writingText}
      type={props.type}
      name={props.name}
      value={props.value}
    />
  );
}

export default InputField;
