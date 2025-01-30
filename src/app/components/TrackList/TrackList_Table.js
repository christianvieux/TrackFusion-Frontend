import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Accordion,
  AccordionItem,
  Chip,
} from "@nextui-org/react";

// import { columns, tracks } from "./data";
import Search_Input from "./Search_Input";
import TrackCard from "../TrackCard";
import UserCard from "../UserCard";
import FavoriteButton from "../favoriteButton";
import Track_Options_Dropdown from "../Track_Options_Dropdown";
import { TrackProvider } from "../../context/TrackContext";
import { useTrackManager } from "../../context/TrackManagerContext";
import Pagination from "../pagination/component";
import { fetchTrackAttributes } from "../../services/enumService";
import { getColorForAttribute } from "../../../config/Colors";
import { useDebounce } from "../../hooks/useDebounce";
import { highlightMatches } from "../../utils/highlightMatches";
import Fuse from "fuse.js";
import { useDeletedTracks } from "../../context/deletedTracksContext";
import { formatDuration } from "../../utils/audio"

const FilterSection = ({
  filters,
  filterType,
  filterAttributes,
  onFilterButtonPressed,
}) => {
  // Sort the attributes based on their colors
  const sortedAttributes = [...filterAttributes].sort((a, b) => {
    const colorA = getColorForAttribute(a);
    const colorB = getColorForAttribute(b);
    return colorA.localeCompare(colorB);
  });

  return (
    <div key={filterType} id="filter" className="flex flex-col gap-2">
      <h3 className="font-bold">
        {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
      </h3>
      <div className="flex flex-wrap gap-2">
        {sortedAttributes.map((attribute, index) => {
          // Check if the attribute is inside 'include' or 'exclude' filters
          const isInclude = filters.includes[filterType]?.includes(attribute);
          const isExclude = filters.excludes[filterType]?.includes(attribute);
          return (
            <Button
              className="rounded-full p-0 text-white/50"
              variant="light"
              size="sm"
              key={index}
              onPress={() => onFilterButtonPressed(filterType, attribute)}
            >
              <AttributeChip
                className={`h-full w-full ${(isInclude && "bg-purple-indigo") || (isExclude && "bg-orange-dark") || ""}`}
                attribute={attribute}
                variant="dot"
              />
            </Button>
          );
        })}
      </div>
    </div>
  );
};

const TopContent = function ({
  className,
  classNames = {},
  filters = {},
  setFilters = () => {},
  ...rest
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const clearFilters = () => {
    setFilters({
      ...filters,
      includes: {},
      excludes: {},
      searchTerm: "",
    });
  };

  // This function will toggle the filter attribute between 'include' and 'exclude' or remove it from both
  const toggleFilterAttribute = (filter, attribute) => {
    const includes = filters.includes[filter] || [];
    const excludes = filters.excludes[filter] || [];

    if (includes.includes(attribute)) {
      setFilters((prev) => ({
        ...prev,
        includes: {
          ...prev.includes,
          [filter]: includes.filter((val) => val !== attribute), // Remove from includes
        },
        excludes: {
          ...prev.excludes,
          [filter]: [...excludes, attribute], // Add to excludes
        },
      }));
    } else if (excludes.includes(attribute)) {
      setFilters((prev) => ({
        ...prev,
        excludes: {
          ...prev.excludes,
          [filter]: excludes.filter((val) => val !== attribute), // Remove from excludes
        },
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        includes: {
          ...prev.includes,
          [filter]: [...includes, attribute], // Add to includes
        },
      }));
    }
  };

  useEffect(() => {
    fetchTrackAttributes()
      .then((data = {}) => {
        // data will look like this: { mood: { values: ['Happy', 'Sad'], ...rest }, genre: { values: ['Rock', 'Pop'], ...rest } }
        // filters list will look like this: { mood: { values: ['Happy', 'Sad'], ...rest }, genre: { values: ['Rock', 'Pop'], ...rest } }
        const filtersList = Object.keys(data).reduce((acc, key) => {
          acc[key] = {
            ...data[key],
          };
          return acc;
        }, {});

        setFilters((prev) => ({
          ...prev,
          filtersList: filtersList,
        }));
      })
      .catch((error) => {
        console.error("Failed to fetch track attributes:", error);
      });
  }, []);

  return (
    <div
      className={`flex w-full items-center text-green ${className}`}
      {...rest}
    >
      <div id="Top_Content" className="flex w-full justify-between">
        <Search_Input
          className="w-[35%]"
          value={filters.searchTerm}
          onChange={(e) => {
            setFilters((prev) => ({
              ...prev,
              searchTerm: e.target.value,
            }));
          }}
          handleClear={() => {
            setFilters((prev) => ({
              ...prev,
              searchTerm: "",
            }));
          }}
        />
        <button
          className="m-5 flex gap-4"
          onClick={() => {
            setIsExpanded(!isExpanded);
          }}
        >
          Filter
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className={`size-6 transform transition-transform ${isExpanded ? "-rotate-90" : ""}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>
      </div>

      <div
        id="Bottom_Content"
        className={`flex h-min w-full items-start justify-between gap-3 overflow-y-auto px-4 transition-max-size ${isExpanded ? "max-h-min" : "max-h-0"}`}
      >
        {Object.keys(filters.filtersList).map((filterType) => (
          <FilterSection
            key={filterType}
            filters={filters}
            filterType={filterType}
            filterAttributes={filters.filtersList[filterType].values}
            onFilterButtonPressed={toggleFilterAttribute}
          />
        ))}
        {/* Clear */}
        <Button
          variant="bordered"
          size="sm"
          className="text-danger"
          onPress={clearFilters}
        >
          [x] Clear
        </Button>
      </div>
    </div>
  );
};

const AttributeChip = ({ attribute, ...rest }) => {
  return (
    <Chip
      className="bg-black"
      variant="bordered"
      color={getColorForAttribute(attribute)}
      {...rest}
    >
      {attribute}
    </Chip>
  );
};

export default function App({
  trackList: tracks=[], 
  setTrackList=() => {},
  className="",
}) {
  const { deletedTracks } = useDeletedTracks();
  const initialFilters = {
    filtersList: {}, // List of filter types (e.g., { mood: ['Happy', 'Sad'], genre: ['Rock', 'Pop'] })
    includes: {}, // { mood: ['Happy'], genre: ['Rock'] }
    excludes: {}, // { mood: ['Sad'], genre: ['Pop'] }
    searchTerm: "", // New state for the search term
  };
  const [filters, setFilters] = React.useState(initialFilters);
  const [rowSelected, setRowSelected] = React.useState(null);
  const [rowHovered, setRowHovered] = React.useState(null);
  const debouncedSearchTerm = useDebounce(filters.searchTerm, 300);
  // Configure Fuse.js options
  const fuseOptions = {
    keys: ["name", "artist", "genre", "mood", "creator"],
    threshold: 0.3, // Adjust the threshold for fuzzy matching
  };
  const fuse = new Fuse(tracks, fuseOptions);

  // Filter
  const filteredTracks = React.useMemo(() => {
    // Apply fuzzy search using Fuse.js
    const searchResults = debouncedSearchTerm
      ? fuse.search(debouncedSearchTerm).map((result) => result.item)
      : tracks;

    return searchResults.filter((track) => {
      // 1. Apply the Filter Conditions (from included and excluded)
      const matchesFilters = Object.keys(filters.includes).every(
        (filterType) => {
          const includedValues = filters.includes[filterType] || [];
          const excludedValues = filters.excludes[filterType] || [];

          // Check if the track matches all of the included filter values for this filterType
          const includesValid = includedValues.every((val) =>
            track[filterType]?.toLowerCase().includes(val.toLowerCase()),
          );

          // Check if the track matches any of the excluded filter values for this filterType
          const excludesInvalid = excludedValues.some((val) =>
            track[filterType]?.toLowerCase().includes(val.toLowerCase()),
          );

          return includesValid && !excludesInvalid;
        },
      );

      // Log the search term and the track fields being checked
      // console.log("Search Term:", searchTerm);
      // console.log("Track Fields:", {
      //   name: track.name,
      //   artist: track.artist,
      //   genre: track.genre,
      //   mood: track.mood,
      //   creator: track.creator,
      // });
      // console.log("Matches Search:", matchesSearch);

      // Only include the track if it matches both the filters and the search term
      return matchesFilters;
    });
  }, [debouncedSearchTerm, fuse, tracks, filters.includes, filters.excludes]); // Re-run when tracks or filters change

  //Pagination
  const [rowsPerPage, setRowsPerPage] = React.useState(8);
  const [page, setPage] = React.useState(1);
  const totalPages = Math.ceil(filteredTracks.length / rowsPerPage);

  const paginatedTracks = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredTracks.slice(start, end);
  }, [filteredTracks, page, rowsPerPage]);

  const AttributeList = ({ attributes, getColorForAttribute }) => {
    const sortedAttributes = attributes
      .replace(/[{}]/g, "")
      .split(",")
      .sort((a, b) =>
        getColorForAttribute(a).localeCompare(getColorForAttribute(b)),
      );

    return (
      <div className="flex flex-wrap gap-2">
        {sortedAttributes.map((attribute, index) => (
          <AttributeChip key={index} attribute={attribute} variant="dot" />
        ))}
      </div>
    );
  };

  const removeTracksFromTrackList = useCallback(
    (deletedTrackIds = []) => {
      setTrackList((prev) => {
        return prev.filter(
          (track) => !deletedTrackIds.includes(Number(track.id)),
        );
      });
    },
    [setTrackList] // Add `setTracks` as dependency (though it's stable in most cases)
  );

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters, tracks]);

  // Delete track from the list if it is in the deletedTracks list
  useEffect(() => {
    const deletedTrackIds = deletedTracks.map((trackId) => Number(trackId));
    removeTracksFromTrackList(deletedTrackIds)
  }
  , [deletedTracks, removeTracksFromTrackList]);

  return (
    <div id="container" className={`relative flex flex-col bg-black p-2 rounded-lg ${className}`}>
      {/* Top_Content */}
      <div id="content" className="mb-10 overflow-auto overflow-x-hidden">
        <TopContent
          id="Top_Content"
          className="flex-wrap"
          filters={filters}
          setFilters={setFilters}
        />
        <div id="Bottom_Content" className="overflow-x-auto p-5">
          <Table
            aria-label="Tracks Table"
            removeWrapper={true}
            selectionMode="single"
            selectedKeys={new Set([String(rowSelected)])}
            onSelectionChange={(selected) =>
              setRowSelected(selected.values().next().value)
            }
            className="h-full w-full"
            classNames={{
              table: "",
              wrapper: "bg-black",
              thead: "text-green w-full",
              tbody: "bg-transparent text-green w-full",
              td: "group-data-[hover=true]:bg-purple-dark first:rounded-l-lg rtl:first:rounded-r-lg rtl:first:rounded-l-[unset] last:rounded-r-lg rtl:last:rounded-l-lg rtl:last:rounded-r-[unset]",
              tr: "group ease-in-out duration-100",
              th: "bg-black/80 text-current font-bold text-md",
            }}
          >
            <TableHeader>
              {[
                "",
                "NAME",
                "",
                "CREATOR",
                "CATEGORY",
                "GENRE",
                "MOOD",
                "DURATION",
                " ",
                " ",
              ].map((column, index) => (
                <TableColumn
                  key={index}
                  className={
                    column == "CREATOR" && "flex items-center justify-center"
                  }
                >
                  {column}
                </TableColumn>
              ))}
            </TableHeader>
            <TableBody emptyContent={"No tracks found"}>
              {paginatedTracks.map((track, index) => (
                <TableRow
                  onMouseEnter={() => setRowHovered(index)}
                  onMouseLeave={() => setRowHovered(null)}
                  key={index}
                  className={`group hover:scale-102 ${rowSelected == index && "*:!bg-purple-blue !scale-102"}`}
                >
                  {/* Track Order Number */}
                  <TableCell>{index + 1}</TableCell>
                  {/* Card */}
                  <TableCell>
                    <TrackCard
                      className="max-w-[200px] mid:max-w-[500px] w-min"
                      classNames={{}}
                      track={track}
                      playlist={paginatedTracks}
                      show_play_pause_button={index == rowHovered || index == rowSelected}
                    />
                  </TableCell>

                  <TableCell>
                    {track.is_private && (
                      <span
                        className="opacity-50"
                        title="This track is private and only you can see it"
                      >
                        Private 🔒
                      </span>
                    )}
                  </TableCell>
                  {/* User/Creator */}
                  <TableCell className="">
                    <UserCard userId={track.creator_id}/>
                  </TableCell>
                  {/* Attributes */}
                  <TableCell>
                    <AttributeChip key={index} attribute={track.category} />
                  </TableCell>
                  <TableCell>
                    <AttributeList
                      attributes={track.genre}
                      getColorForAttribute={getColorForAttribute}
                    />
                  </TableCell>
                  <TableCell>
                    <AttributeList
                      attributes={track.mood}
                      getColorForAttribute={getColorForAttribute}
                    />
                  </TableCell>

                  <TableCell>{formatDuration(track.length)}</TableCell>
                  {/* Favorite/Likes */}
                  <TableCell>
                    <FavoriteButton className="w-full" classNames={{svg: "w-10 h-10"}} track={track} showLikes={true} />
                  </TableCell>
                  <TableCell>
                    <TrackProvider track={track}>
                      <Track_Options_Dropdown track={track} />
                    </TrackProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div
        id="pagination"
        className="absolute bottom-0 flex flex-1 items-end justify-center self-center"
      >
        <Pagination
          page={page}
          total={totalPages}
          onChange={(page) => setPage(page)}
        />
      </div>
    </div>
  );
}
