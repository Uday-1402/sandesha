import React from "react";

function PhotoPicker({ onChange }) {
  return (
    <input type="file" id="photo-picker-input" hidden onChange={onChange} />
  );
}

export default PhotoPicker;
