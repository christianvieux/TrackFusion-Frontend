import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import OptionsMenu from "../components/Track_Options_Menu";
import Pagination from "../pagination/pagination";
import { Input } from "@nextui-org/react";
import { useSession } from "../context/SessionContext";
import {deleteOwnedTrack} from "../services/user"

const SearchIcon = (props) => (
  <svg aria-hidden="true" fill="none" focusable="false" height="1em" role="presentation" viewBox="0 0 24 24" width="1em" {...props}>
    <path
      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path d="M22 22L20 20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
  </svg>
);

const TrackTable = ({ page, setPage, appliedFilter, ownedTracks, setOwnedTracks }) => {
  const { user } = useSession();
  const [searchBarFilter, setSearchBarFilter] = useState("");
  const [trackBeingInteracted, setTrackBeingInteracted] = useState(0);
  const rowsPerPage = 8;

  const filteredItems = useMemo(() => {
    let newFilteredItems = ownedTracks;

    if (searchBarFilter) {
      newFilteredItems = newFilteredItems.filter((track) => track.name.toLowerCase().includes(searchBarFilter.toLowerCase()));
    }
    // if (appliedFilter.genre) {
    //   newFilteredItems = newFilteredItems.filter((track) => track.genre?.toLowerCase().includes(appliedFilter.genre.toLowerCase()));
    // }
    // if (appliedFilter.mood.length) {
    //   newFilteredItems = newFilteredItems.filter((track) =>
    //     appliedFilter.mood.some((mood) => track.mood?.toLowerCase() === mood.toLowerCase())
    //   );
    // }

    return newFilteredItems;
  }, [ownedTracks, searchBarFilter, appliedFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    // Sort filteredItems by updated_at in descending order
    const sortedItems = filteredItems.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    
    const start = (page - 1) * rowsPerPage;
    return filteredItems.slice(start, start + rowsPerPage);
  }, [page, filteredItems]);

  const onSearchBarChange = useCallback((value) => {
    setSearchBarFilter(value);
    setPage(1);
  }, [setPage]);

  const onSearchBarClear = useCallback(() => {
    setSearchBarFilter("");
    setPage(1);
  }, [setPage]);

  const handleDeleteTrack = async (trackId) => {
    if (user) {
      try {
        // Remove the track from ownedTracks state
        setOwnedTracks((prevTracks) =>
          prevTracks.filter((track) => track.id !== trackId)
        );
        // Call removeFavoriteTrack service function
        // await deleteOwnedTrack(trackId, user.id); // Assuming removeFavoriteTrackService handles the API call
      } catch (error) {
        console.error("Error deleting favorite track:", error);
      }
    }
  };

  useEffect(() => {
    const rows = document.querySelectorAll('.TableRow');
    const classesToAdd = 'trackIsBeingHovered !bg-gray-darker';

    rows.forEach(row => {
      const isActive = row.classList.contains(`Id-${trackBeingInteracted}`);
      classesToAdd.split(' ').forEach(className => {
        row.classList.toggle(className, isActive);
      });
    });
  }, [trackBeingInteracted]);

  return (
    <Table
      aria-label="Example table with client side pagination"
      bottomContent={
        <div className="flex justify-center">
          <Pagination page={page} total={pages} onChange={setPage} />
        </div>
      }
      classNames={{
        wrapper: "min-h-[222px]",
        tbody: "text-green-dark bg-black",
        thead: "[&>tr:last-child]:!mt-0 [&>tr:last-child]:!h-0",
        tr: "hover:trackIsBeingHovered hover:bg-gray-dark ease-out duration-200",
        td: "p-px px-3 border-b-1 border-gray-dark",
        th: "sm:truncate bg-gray-darkest first:rounded-l-none last:rounded-r-none first:rounded-tl-sm last:rounded-tr-sm",
        base: "h-full overflow-auto",
      }}
      removeWrapper
    >
      <TableHeader>
        <TableColumn>
          <Input
            isClearable
            fullWidth
            className=""
            classNames={{
              inputWrapper: "text-gray-light bg-black border border-gray-darkest data-[hover=true]:bg-gray-dark data-[focus=true]:!bg-gray/50 data-[focus=true]:!outline-none",
            }}
            placeholder="Search by name of track..."
            startContent={<SearchIcon />}
            value={searchBarFilter}
            onClear={onSearchBarClear}
            onValueChange={onSearchBarChange}
          />
        </TableColumn>
        <TableColumn></TableColumn>
        <TableColumn></TableColumn>
        <TableColumn></TableColumn>
      </TableHeader>
      <TableBody items={items}>
        {(item) => (
          <TableRow key={item.id} className={`TableRow Id-${item.id}`}>
            <TableCell>
              <div className="text-gray flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                </svg>
                <span className="overflow-scroll">{item.name}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="text-gray flex items-center gap-2">
                <span className="overflow-scroll">WAV File</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex gap-4 h-5 bg-purple-dark overflow-hidden rounded-full max-w-28">
                <svg className="w-7 h-7 text-white -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                </svg>
                <p className="w-1/2 text-center">{item.created_by || "?"}</p>
              </div>
            </TableCell>
            <TableCell>
              <OptionsMenu setTrackBeingInteracted={setTrackBeingInteracted} item={item} updateTrackList={setOwnedTracks} onDelete={() => handleDeleteTrack(item.id)} />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default TrackTable;
