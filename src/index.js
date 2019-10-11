import React from "react";
import ReactDOM from "react-dom";
import {
  elementContainsAttribute,
  findElementRecursive,
  initializeIcons,
  Nav,
  NavLink,
  Icon
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

  useNativeEvent(
    "mouseup",
    dragging &&
      (ev => {
        setDragging(false);
        setDragElement(undefined);
        ev.preventDefault();
      })
  );

  function onDragOver(ev) {
    //console.log("on Drag Over");
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
  }
  const onDrop = ev => {
    console.log("on Drop ");
    ev.preventDefault();
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
    /*
    // Get the id of the target and add the moved element to the target's DOM
    var data = ev.dataTransfer.getData("text/plain");
    ev.target.appendChild(document.getElementById(data));
  */
  };
  const onDragStart = ev => {
    console.log("on Drag start ");
    ev.dataTransfer.setData("text", ev.target.id);
  };

  
  return {
    onMouseDown,
    onDragOver,
    onDragStart,
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

const items = ["Item1", "Item2", "Item3", "Item4"];
const addItem = props => {
  return {
    name: props.name,
    disabled: !props.name,
    key: props.key,
    sridhar: {
      isAwesome: true
    }
  };
};



const DragList = props => {
  const {
    onMouseDown,
    onDragOver,
    onDragStart,
    onDrop,
    dragging
  } = useDragging();
  const { items } = props;

  let newItems = [];
  if (items.length > 0) {
    let i = 0;
    for (; i < items.length; i++) {
      newItems.push(addItem({ name: undefined, key: i }));
      newItems.push(addItem({ name: items[i], key: items[i] }));
    }

    newItems.push(addItem({ name: undefined, key: i }));
  }
  return (
    <div>
      <Nav
        selectedKey="Item3"
        selectedAriaLabel="Selected"
        ariaLabel="Nav basic example"
        linkAs={p => {
          //console.log(p);
          const { title } = p;
          if (!title) {
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
                  onMouseDown={onMouseDown}
                  className="DragGrip"
                  iconName="gripperdotsvertical"
                />
                {p.title}
              </div>
            </>
          );
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
      <DragList items={items} />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
