import React from "react";
import ReactDOM from "react-dom";
import {
  initializeIcons,
  Nav,
  Icon,
  ActionButton
} from "office-ui-fabric-react";
import { useDragging }  from './DragEvents'; 
import "./styles.css";

initializeIcons();

const withDragProps = (options = {}) => {
  if (options.grip) {
    return { "data-draggrip": true };
  }

  return { "data-draggable": true };
};

const addItem = props => {
  return {
    name: props.name,
    disabled: !props.name,
    key: props.key,
    asdf: {
      isEnabled: true
    }
  };
};

const DragList = props => {
  const {
    onMouseDown,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDrop,
    dragging
  } = useDragging();

  const renderLink = p => {
    const { title, name } = p;
    if (!title && !name) {
      return (
        <div
          style={{ background: dragging ? "blue" : "none" }}
          className="line"
          onDrop={onDrop}
          onDragOver={onDragOver}
        />
      );
    }
    return (
      <>
        <div className={p.className} {...withDragProps()}>
          <Icon
            {...withDragProps({ grip: true })}
            draggable="true"
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onMouseDown={onMouseDown}
            className="DragGrip"
            iconName="gripperdotsvertical"
          />
          {p.title || p.name}
        </div>
      </>
    );
  };

  let newItems = [];
  let i = 1;
  for (; i < 5; i++) {
    newItems.push(addItem({ name: undefined, key: i }));
    newItems.push(addItem({ name: "Item" + i, key: "Item" + i }));
  }

  newItems.push(addItem({ name: undefined, key: i }));
  return (
    <div>
      <Nav
        selectedKey="Item3"
        selectedAriaLabel="Selected"
        ariaLabel="Nav basic example"
        onRenderLink={renderLink}
        linkAs={p => {
          if(p.title){
            return <ActionButton {...p} />;
          }
          return (<>{p.children}</>);
        }}
        styles={{
          root: {
            width: 258,
            height: 350,
            boxSizing: "border-box",
            border: "1px solid #eee",
            overflowY: "auto"
          }
        }}
        groups={[
          {
            links: newItems
          }
        ]}
      />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <DragList />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
