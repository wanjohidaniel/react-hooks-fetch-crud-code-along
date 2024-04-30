import React, { useState, useEffect } from "react";
import ItemForm from "./ItemForm";
import Filter from "./Filter";
import Item from "./Item";

function ShoppingList() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    fetchItems();

    // Cleanup function to set mounted to false when unmounting
    return () => {
      setMounted(false);
    };
  }, []);

  function fetchItems() {
    fetch("http://localhost:4000/items")
      .then((response) => response.json())
      .then((data) => {
        // Check if the component is still mounted before updating the state
        if (!mounted) return;
        setItems(data);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
        setError("Error fetching items. Please try again later.");
      });
  }

  function handleCategoryChange(category) {
    setSelectedCategory(category);
  }

  function handleAddItem(newItem) {
    setItems([...items, newItem]);
  }

  function handleUpdateItem(updatedItem) {
    const updatedItems = items.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setItems(updatedItems);
  }

  function handleDeleteItem(deletedItem) {
    const updatedItems = items.filter((item) => item.id !== deletedItem.id);
    setItems(updatedItems);
  }

  const itemsToDisplay = items.filter((item) => {
    if (selectedCategory === "All") return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="ShoppingList">
      <ItemForm onAddItem={handleAddItem} />
      <Filter
        category={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      {error && <div className="error">{error}</div>}
      <ul className="Items">
        {itemsToDisplay.map((item) => (
          <Item
            key={item.id}
            item={item}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
          />
        ))}
      </ul>
    </div>
  );
}

export default ShoppingList;
