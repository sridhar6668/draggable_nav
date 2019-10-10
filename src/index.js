import React, { Children } from "react";
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

const items = ["Item 1", "Item 2", "Item 3", "Item 4"];
const DragList = props => {
  const { onMouseDown, dragging } = useDragging();

  return (
    <div
      style={{ background: dragging ? "blue" : "none" }}
      onMouseDown={onMouseDown}
    >
      <Nav
        selectedKey="key3"
        selectedAriaLabel="Selected"
        ariaLabel="Nav basic example"
        onRenderLink={p => (
          <div className={p.className}>
            <Icon
              {...withDragProps({ grip: true })}
              className="DragGrip"
              iconName="gripperdotsvertical"
            />
            {p.name}
          </div>
        )}
        styles={{
          root: {
            width: 208,
            height: 350,
            boxSizing: "border-box",
            border: "1px solid #eee",
            overflowY: "auto"
          }
        }}
        groups={[
          {
            links: [
              {
                ...withDragProps(),
                name: "Documents",
                url: "http://example.com",
                key: "key3",
                isExpanded: true,
                target: "_blank"
              },
              {
                name: "Pages",
                url: "http://msn.com",
                key: "key4",
                target: "_blank"
              },
              {
                name: "Notebook",
                url: "http://msn.com",
                key: "key5",
                disabled: true
              },
              {
                name: "Communication and Media",
                url: "http://msn.com",
                key: "key6",
                target: "_blank"
              },
              {
                name: "News",
                url: "http://cnn.com",
                icon: "News",
                key: "key7",
                target: "_blank"
              }
            ]
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
