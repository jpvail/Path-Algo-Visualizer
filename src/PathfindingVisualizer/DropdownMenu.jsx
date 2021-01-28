import "./DropdownMenu.css";

const DropdownMenu = props => {
  const { handleDropdownSelect } = props;
  const DropdownItem = props => {
    const { onclick } = props;

    return (
      <a className="menu-item" onClick={onclick}>
        {props.children}
      </a>
    );
  };

  return (
    <div className="dropdown">
      <DropdownItem onclick={() => handleDropdownSelect(1)}>
        Dijkstra's
      </DropdownItem>
      <DropdownItem onclick={() => handleDropdownSelect(2)}>
        Depth-First Search
      </DropdownItem>
      <DropdownItem onclick={() => handleDropdownSelect(3)}>
        Breadth-First Search
      </DropdownItem>
      <DropdownItem onclick={() => handleDropdownSelect(4)}>A*</DropdownItem>
    </div>
  );
};

export default DropdownMenu;
