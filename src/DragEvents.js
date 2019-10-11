import React from "react";
import {
  elementContainsAttribute,
  findElementRecursive,

} from "office-ui-fabric-react";

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
*/

export const useDragging = () => {
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
  const onDrop = (ev, updatePinOrder) => {
    console.log("drop");
    if (dragging) {
      let itemInfo = ev.dataTransfer.getData("text");
      console("Drop info" + itemInfo);
      updatePinOrder(itemInfo);
      //ev.target.appendChild(dragElement);
      setDragging(false);
      //setDragElement(undefined);
      ev.preventDefault();
    }
  };
  const onDragStart = (ev,itemInfo) => {
    console.log("on Drag start ");
    ev.dataTransfer.setData("text", itemInfo);
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