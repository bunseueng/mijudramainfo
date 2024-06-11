export const customStyles = {
  control: (provided: any) => ({
    ...provided,
    backgroundColor: "#3a3b3c",
    borderColor: "#3a3b3c",
    color: "#666",
    borderRadius: "0.375rem",
    padding: "0.5rem",
    marginTop: "0.25rem",
    outline: "none",
    boxShadow: "none",
    cursor: "text",
    "&:hover": {
      borderColor: "#409eff",
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: "#242424",
    borderColor: "#242424",
    zIndex: 10,
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#2a2b2c"
      : state.isFocused
      ? "#2a2b2c"
      : "#242424",
    color: state.isSelected ? "#409eff" : "#ffffff",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#2a2b2c",
    },
  }),
  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: "#3a3b3c",
    color: "#ffffff",
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: "#ffffff",
  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    color: "#ffffff",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#409eff",
      color: "#ffffff",
    },
  }),
};
