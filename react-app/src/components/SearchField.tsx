import React, { FC, useState, ChangeEvent, KeyboardEvent } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import SearchIcon from "@atlaskit/icon/glyph/search";

interface SearchFieldProps {
  placeholder?: string;
  onSubmit: (searchText: string) => void;
}

const SearchField: FC<SearchFieldProps> = ({
  placeholder = "Search...",
  onSubmit,
}) => {
  const [searchText, setSearchText] = useState("");

  const setSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.currentTarget.value);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    onSubmit(searchText);
  };

  return (
    <div>
      <InputGroup>
        <input
          type="text"
          className="form-control"
          value={searchText}
          onChange={setSearch}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
        />
        <InputGroup.Append>
          <Button variant="outline-secondary" onClick={handleSearch}>
            <SearchIcon label="Search" size="small" />
          </Button>
        </InputGroup.Append>
      </InputGroup>
    </div>
  );
};

export default SearchField;
