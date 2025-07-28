// src/components/NotionList.jsx

import React, { useEffect, useState } from "react";
import { fetchNotionData } from "../utils/fetchNotionData";

export default function NotionList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchNotionData().then(setItems);
  }, []);

  return (
    <div className="grid gap-4">
      {items.map(item => (
        <div key={item.id} className="border p-4 rounded-lg">
          <h2 className="text-xl font-bold">{item.title}</h2>
          <p className="text-sm text-gray-500">{item.type}</p>
          <div className="flex gap-2 mt-2">
            {item.tags.map(tag => (
              <span
                key={tag}
                className="text-xs bg-gray-200 rounded-full px-2 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
          {item.link && (
            <a href={item.link} target="_blank" rel="noopener noreferrer" className="block mt-2 text-blue-500">
              View
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
