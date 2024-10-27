import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

export default function AutoComplete({ menu, setItem }) {
  const handleSetItem = (item) => {
    setItem(item);
  };

  return (
    <div style={{display:"flex", width:"100%", flexWrap:"wrap", gap:"1rem"}}>
      <Autocomplete
        style={{maxWidth:"20rem"}}
        label="Chế độ bạn chọn"
        placeholder="Search..."
        defaultItems={menu}
        listboxProps={{
          emptyContent: "Your own empty content text.",
        }}
        onSelect={handleSetItem} // Use onSelect instead of onChange
      >
        {(item) => (
          <AutocompleteItem key={item.id} value={item.id}>
            {item.value}
          </AutocompleteItem>
        )}
      </Autocomplete>
    </div>
  );
}
