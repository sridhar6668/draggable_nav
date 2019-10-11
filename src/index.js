import React from "react";
import ReactDOM from "react-dom";
import {
  initializeIcons,
  Nav,
  Icon,
  ActionButton
} from "office-ui-fabric-react";
//import { useDragging }  from './DragEvents';
import { DragDropItems } from "./ItemCreator";
import "./styles.css";

initializeIcons();

const withDragProps = (options = {}) => {
  if (options.grip) {
    return { "data-draggrip": true };
  }

  return { "data-draggable": true };
};

const DragList = props => {
  const { items, dragging, createDroppableItem, updatePinOrder } = DragDropItems();

  let draggableItems = [];

  for (let i = 0; i < items.length; i++) {
    console.log("item id: " + items[i].id + ",  item pinOrder: ", items[i].pinOrder);
    draggableItems.push(items[i]);
    draggableItems.push(
      createDroppableItem({
        topPinOrder: items[i].pinOrder,
        bottomPinOrder: (items[i + 1] && items[i + 1].pinOrder) || 0,
        updatePinOrder: updatePinOrder
      })
    );
  }
  
  const renderLink = p => {
    const { title, name } = p;
    if (!title && !name) {
      return (
        <div
          style={{ background: dragging ? "blue" : "none" }}
          className="line"
          onDrop={p.onDrop}
          onDragOver={p.onDragOver}
        />
      );
    }
    return (
      <>
        <div className={p.className} {...withDragProps()}>
          <Icon
            {...withDragProps({ grip: true })}
            draggable="true"
            onDragStart={p.onDragStart}
            onDragEnd={p.onDragEnd}
            //onMouseDown={onMouseDown}
            className="DragGrip"
            iconName="gripperdotsvertical"
          />
          {p.title || p.name}
        </div>
      </>
    );
  };
  return (
    <div>
      <Nav
        selectedKey="Item3"
        selectedAriaLabel="Selected"
        ariaLabel="Nav basic example"
        onRenderLink={renderLink}
        linkAs={p => {
          if (p.title) {
            return <ActionButton {...p} />;
          }
          return <>{p.children}</>;
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
            links: draggableItems
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
