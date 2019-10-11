import React from "react";

const sortItems = items => {
  return items.sort((a, b) => {
    return b.pinOrder - a.pinOrder;
  });
};
export const DragDropItems = () => {
  const createItem = props => {
    const { id, pinOrder } = props;
    return {
      id: id,
      name: "Item" + id,
      key: id,
      pinOrder: pinOrder,
      onDragStart: ev => {
        console.log("on Drag start ");
        setDragging(true);
        ev.dataTransfer.setData("text", id);
        console.log("value set: " + id);
      },
      onDragEnd: ev => {
        console.log("on drag end");
      }
    };
  };

  const createDroppableItem = props => {
    const { topPinOrder, bottomPinOrder, updatePinOrder } = props;
    let newPinOrder = (topPinOrder + bottomPinOrder) / 2;
    return {
      name: undefined,
      onDrop: ev => {
        console.log("drop");
        setDragging(false);
        let id = ev.dataTransfer.getData("text");
        console.log("Drop info " + id);
        updatePinOrder(id, newPinOrder);
      },
      onDragOver: ev => {
        //console.log("on Drag Over");
        ev.stopPropagation();
        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move";
      }
    };
  };
  const Items = () => {
    const length = 5;

    let i = 1;
    let items = [];
    for (; i <= length; i++) {
      items.push(createItem({ id: 100 - i, pinOrder: 100 - i }));
    }
    return items;
  };

  const [items, setItems] = React.useState(sortItems(Array.from(Items())));
  const [dragging, setDragging] = React.useState(false);

  console.log(Items());

  const updatePinOrder = (id, newPinOrder) => {
    let newItems = items.map(item => {
      if (item.id == id) {
        return {
          ...item,
          pinOrder: newPinOrder
        };
      }
      return item;
    });
    console.log("ran updatePinOrder. new PinOrder: " + newPinOrder);
    setItems(sortItems(Array.from(newItems)));
  };

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
  return {
    items: draggableItems,
    dragging: dragging
  };
};
