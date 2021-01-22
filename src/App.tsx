import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface IProduct {
  id: number;
  name: string;
}

interface IPackages {
  type: string;
  products: IProduct[];
}

function App() {
  const [items, setItems] = useState<any>({
    orderNumber: 2,
    packages: [
      {
        type: "A",
        products: [
          {
            id: 1,
            name: "producto1",
          },
          {
            id: 2,
            name: "producto2",
          },
        ],
      },
      {
        type: "B",
        products: [
          {
            id: 3,
            name: "producto3",
          },
          {
            id: 4,
            name: "producto4",
          },
        ],
      },
      {
        type: "C",
        products: [
          {
            id: 5,
            name: "producto5",
          },
          {
            id: 6,
            name: "producto6",
          },
        ],
      },
    ],
  });

  const reorder = (list: any, startIndex: any, endIndex: any) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    console.log(result);
    return result;
  };

  const move = (
    source: any,
    destination: any,
    droppableSource: any,
    droppableDestination: any
  ) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result: any = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
  };

  const onDragEnd = (result: any) => {
    // dropped outside the list

    const { source, destination } = result;
    if (!result.destination) {
      return;
    }

    //start

    if (source.droppableId === destination.droppableId) {
      let newPack = items.packages.find(
        (t: any) => t.type === source.droppableId
      );

      let newPackIndex = items.packages.findIndex(
        (t: any) => t.type === source.droppableId
      );

      newPack.products = reorder(
        newPack.products,
        result.source.index,
        result.destination.index
      );
      items.packages[newPackIndex] = newPack;

      const itemsD = {
        orderNumber: items.orderNumber,
        packages: items.packages,
      };
      setItems(itemsD);
    } else {
      let newPackSource = items.packages.find(
        (t: any) => t.type === source.droppableId
      );
      let newPackDestination = items.packages.find(
        (t: any) => t.type === destination.droppableId
      );

      const result = move(
        newPackSource.products,
        newPackDestination.products,
        source,
        destination
      );

      let newPackSourceIndex = items.packages.findIndex(
        (t: any) => t.type === source.droppableId
      );
      let newPackDestinationIndex = items.packages.findIndex(
        (t: any) => t.type === destination.droppableId
      );

      items.packages[newPackSourceIndex].products = result[source.droppableId];
      items.packages[newPackDestinationIndex].products =
        result[destination.droppableId];

      const itemsD = {
        orderNumber: items.orderNumber,
        packages: items.packages,
      };
      setItems(itemsD);
    }
  };

  const getListStyle = (isDraggingOver: boolean) => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    padding: "15px",
    width: 250,
  });

  return (
    <div className="App">
      <DragDropContext onDragEnd={onDragEnd}>
        {items.packages.map((item: any, index: number) => (
          <Droppable droppableId={item.type}>
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                {item.products.map((p: any, index: number) => (
                  <Draggable
                    key={p.id}
                    draggableId={String(p.id)}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {p.name} {/* Poner los tablecellAqui*/}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </div>
  );
}

export default App;
