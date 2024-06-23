import React, { useState } from "react";
import "./Search.css";

type SetSearched = (searched: string) => void;

interface Option {
  id: string;
  text: string;
}

interface SearchProps {
  searched: string;
  setSearched: SetSearched;
  options: Option[];
  placeholder: string;
}

const Search: React.FC<SearchProps> = ({
  searched,
  setSearched,
  options,
  placeholder,
}) => {
  const [searchText, setSearchText] = useState<string>("");
  const [searchOptions, setSearchOptions] = useState<Option[]>([]);

  const handleSearch = (input: string) => {
    const match = options.find(
      (x: Option) =>
        x.text.trim().toLowerCase() === input.trim().toLocaleLowerCase()
    );
    if (input.trim() === "") {
      setSearchText("");
      setSearched("");
      setSearchOptions([]);
    } else if (match) {
      setSearchText(match.text);
      setSearched(match.id);
      setSearchOptions([]);
    } else {
      setSearchText(input);

      const filteredOptions: Option[] = options.filter((option: Option) =>
        option.text.trim().toLowerCase().includes(input)
      );

      setSearchOptions(filteredOptions);
    }
  };

  return (
    <div className="search_container">
      <input
        className="search"
        type="text"
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={placeholder}
      />
      {searchOptions.length > 0 && (
        <ol className="options">
          {searchOptions.map((option: Option, index) => {
            return (
              <li
                key={`${option.id}_${index}`}
                onClick={() => handleSearch(option.text)}
              >
                {option.text}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};

export default Search;
