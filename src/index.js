import React from "react";
import ReactDOM from "react-dom";
import { initializeIcons, Nav, Icon } from "office-ui-fabric-react";
import "./styles.css";

initializeIcons();

const items = ["Item1", "Item2", "Item3", "Item4"];
const addItem = props => {
  return {
    name: props.name,
    disabled: !props.name,
    key: props.key
  };
};
const DragList = props => {
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
          const {
            title
          } = p;
          if(!title)
          {
            return (<div className="line"></div>);
          }
          return (
            <>
              <div className={p.className}>
                <Icon className="DragGrip" iconName="gripperdotsvertical" />
                {p.title}
              </div>
            </>
          );
        }}
        styles={{
          root: {
            width: 258,
            height: 550,
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

/*
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
    if (dragElement) {
      // render ghost
      ghost = dragElement.cloneNode(true);
      ghost.style = "opacity: .5";
      document.body.appendChild(ghost);
    }
    return () => {
      if (ghost) {
        document.body.removeChild(ghost);
      }
    };
  }, [dragElement]);

  const onMouseDown = ev => {
    if (elementContainsAttribute(ev.target, "data-draggrip")) {
      console.log("mousedown");
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

  return {
    onMouseDown,
    dragging
  };
};

const withDragProps = (options = {}) => {
  if (options.grip) {
    return { "data-draggrip": true };
  }

  return { "data-draggable": true };
};

*/
