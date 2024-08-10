export const customStyles = (open: any) => ({
  menuList: (base: any) => ({
    ...base,
    height: "150px",
    "::-webkit-scrollbar": {
      width: "6px",
      height: "0px",
    },
    "::-webkit-scrollbar-thumb": {
      borderRadius: "3px",
      background: "#3a3b3c",
    },
    "::-webkit-scrollbar-thumb:hover": {
      background: "#555",
    },
  }),
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
    overflow: "hidden",
    opacity: open ? 1 : 0,
    transition: "all 0.3s ease-in-out",
    visibility: open ? "visible" : "hidden",
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
  singleValue: (provided: any) => ({
    ...provided,
    color: "#fff",
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
});

export const lightTheme = (open: any) => ({
  menuList: (base: any) => ({
    ...base,
    height: "150px",
    "::-webkit-scrollbar": {
      width: "6px",
      height: "0px",
    },
    "::-webkit-scrollbar-thumb": {
      borderRadius: "3px",
      background: "#3a3ffb3c",
    },
    "::-webkit-scrollbar-thumb:hover": {
      background: "#555",
    },
  }),
  control: (provided: any) => ({
    ...provided,
    backgroundColor: "#fff",
    borderColor: "#c0c4cc",
    color: "#666",
    borderRadius: "0.375rem",
    paddingInline: "0.5rem",
    paddingBlock: "2px",
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
    backgroundColor: "#fff",
    borderColor: "#242424",
    zIndex: 10,
    overflow: "hidden",
    opacity: open ? 1 : 0,
    transition: "all 0.3s ease-in-out",
    visibility: open ? "visible" : "hidden",
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#fff"
      : state.isFocused
      ? "#fff"
      : "#fff",
    color: state.isSelected ? "#409eff" : "#000",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#00000011",
    },
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "#fff",
  }),
  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: "transparent",
    color: "#000",
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: "#000",
  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    color: "#000",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#409eff",
      color: "#ffffff",
    },
  }),
});
