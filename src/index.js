import React from "react";
import ReactDOM from "react-dom";
import {
  elementContainsAttribute,
  findElementRecursive,
  initializeIcons,
  Nav,
  Icon,
  ActionButton
} from "office-ui-fabric-react";
import "./styles.css";

initializeIcons();

const useNativeEvent = (eventName, callback) => {
  React.useEffect(() => {
    if (callback) {
      window.addEventListener(eventName, callback, true);
      return () => {
        window.removeEventListener(eventName, callback, true);
      };
    }
  }, [eventName, callback]);
};

const useDragging = () => {
  const [dragging, setDragging] = React.useState(false);
  const [dragElement, setDragElement] = React.useState(null);

  React.useEffect(() => {
    let ghost = undefined;
    console.log("inside useEffect");
    if (dragElement) {
      // render ghost
      ghost = dragElement.cloneNode(true);
      ghost.style = "opacity: .5";
      document.body.appendChild(ghost);
      console.log("ghost added");
    }
    return () => {
      if (ghost) {
        document.body.removeChild(ghost);
        console.log("ghost removed");
      }
    };
  }, [dragElement]);

  const onMouseDown = ev => {
    console.log("Inside mouse down");
    if (elementContainsAttribute(ev.target, "data-draggrip")) {
      console.log("mousedown data-datagrip");
      setDragging(true);
      // find thing to ghost
      setDragElement(
        findElementRecursive(
          ev.target,
          el => el.getAttribute("data-draggable") !== null
        )
      );
    }
  };
  /*
  useNativeEvent(
    "dragend",
    dragging &&
      (ev => {
        console.log("native dragend");
        setDragging(false);
        setDragElement(undefined);
        ev.preventDefault();
      })
  );

  useNativeEvent(
    "drop",
    dragging &&
      (ev => {
        console.log("native drop");
        ev.target.appendChild(dragElement);
        ev.preventDefault();
      })
  );
*/
  function onDragOver(ev) {
    //console.log("on Drag Over");
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
  }

  let onDragEnd = ev => {
    if (dragging) {
      console.log("dragend");
      //setDragging(false);
      //setDragElement(undefined);
      ev.preventDefault();
    }
  };
  const onDrop = ev => {
    console.log("drop");
    if (dragging) {
      ev.target.appendChild(dragElement);
      setDragging(false);
      setDragElement(undefined);
      ev.preventDefault();
    }
  };
  const onDragStart = ev => {
    console.log("on Drag start ");
    ev.dataTransfer.setData("text", ev.target.id);
  };

  return {
    onMouseDown,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDrop,
    dragging
  };
};

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
    console.log(p);
    const { title, name } = p;
    if (!title && !name) {
      console.log("drawing empty items");
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
          console.log(p)
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
