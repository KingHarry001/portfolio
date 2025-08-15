import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableCard = ({ id, feature }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
  ref={setNodeRef}
  style={style}
  {...attributes}
  {...listeners}
  className="p-6 cursor-grab active:cursor-grabbing bg-gradient-to-br from-gray-900 to-gray-800 hover:scale-[1.02] transform transition-all duration-300 border border-white/10 shadow-[10px_10px_30px_rgba(0,0,0,0.4),-10px_-10px_30px_rgba(255,255,255,0.05)] rounded-[2rem_0.5rem_2rem_0.5rem]"
>

      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
      {Array.isArray(feature.desc) ? (
        <ul className="text-gray-400 space-y-1">
          {feature.desc.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">{feature.desc}</p>
      )}
    </div>
  );
};

export default function FeaturesGrid({ features }) {
  const [items, setItems] = useState(features.map((_, i) => i.toString()));

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((prevItems) => {
        const oldIndex = prevItems.indexOf(active.id);
        const newIndex = prevItems.indexOf(over.id);
        return arrayMove(prevItems, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items}>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {items.map((id) => (
            <SortableCard key={id} id={id} feature={features[parseInt(id)]} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
