import { useEffect, useMemo, useState } from 'react'
import { Button, Modal } from '@heroui/react'

import AttributeChip from './AttributeChip'
import SearchInput from './SearchInput'

import { fetchTrackAttributes } from '../../../services/enumService'
import { getColorForAttribute } from '../../../../config/Colors'

const FILTER_TYPES = ['category', 'genre', 'mood']

function getSortedAttributes(attributes = []) {
    return [...attributes].sort((a, b) =>
        getColorForAttribute(a).localeCompare(getColorForAttribute(b))
    )
}

function getSelectedFilters(filters) {
    return Object.entries(filters.includes).flatMap(([type, values = []]) =>
        values.map((value) => ({ type, value }))
    )
}

function FilterModal({
    filterType,
    options = [],
    selected = [],
    onToggle,
    onClear,
}) {
    const [search, setSearch] = useState('')

    const filteredOptions = useMemo(() => {
        return getSortedAttributes(options).filter((option) =>
            option.toLowerCase().includes(search.toLowerCase())
        )
    }, [options, search])

    if (!filterType) return null

    return (
        <Modal>
            <Modal.Trigger>
                <Button variant="bordered" size="sm" className="capitalize">
                    + {filterType}
                </Button>
            </Modal.Trigger>

            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog className="max-w-md space-y-4 border-2 border-foreground/40">
                        <Modal.CloseTrigger className="text-foreground" />

                        <Modal.Header>
                            <Modal.Heading className="capitalize">
                                Filter by {filterType}
                            </Modal.Heading>
                        </Modal.Header>

                        <Modal.Body className="space-y-4 p-2">
                            <SearchInput
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                onClear={() => setSearch('')}
                                placeholder={`Search ${filterType}...`}
                            />

                            <div className="flex flex-wrap gap-2">
                                {filteredOptions.map((option) => {
                                    const isSelected = selected.includes(option)

                                    return (
                                        <button
                                            key={option}
                                            type="button"
                                            onClick={() =>
                                                onToggle(filterType, option)
                                            }
                                            className="rounded-full"
                                        >
                                            <AttributeChip
                                                attribute={option}
                                                className={`transition-all duration-150 hover:opacity-90 ${
                                                    isSelected
                                                        ? 'opacity-85'
                                                        : 'opacity-60'
                                                }`}
                                            />
                                        </button>
                                    )
                                })}
                            </div>
                        </Modal.Body>

                        <Modal.Footer className="p-2">
                            <Button
                                variant="bordered"
                                size="sm"
                                onPress={() => onClear(filterType)}
                            >
                                Clear {filterType}
                            </Button>

                            <Button size="sm" slot="close">
                                Done
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}

export default function TrackFilters({ filters, setFilters }) {
    const [filterOptions, setFilterOptions] = useState({})

    const selectedFilters = useMemo(() => {
        return getSelectedFilters(filters)
    }, [filters])

    function updateSearchTerm(event) {
        setFilters((prev) => ({
            ...prev,
            searchTerm: event.target.value,
        }))
    }

    function clearSearchTerm() {
        setFilters((prev) => ({
            ...prev,
            searchTerm: '',
        }))
    }

    function toggleFilter(filterType, value) {
        setFilters((prev) => {
            const currentValues = prev.includes[filterType] || []
            const isSelected = currentValues.includes(value)

            const nextValues = isSelected
                ? currentValues.filter((item) => item !== value)
                : [...currentValues, value]

            return {
                ...prev,
                includes: {
                    ...prev.includes,
                    [filterType]: nextValues,
                },
            }
        })
    }

    function clearFilterType(filterType) {
        setFilters((prev) => ({
            ...prev,
            includes: {
                ...prev.includes,
                [filterType]: [],
            },
        }))
    }

    function removeSelectedFilter(filterType, value) {
        setFilters((prev) => ({
            ...prev,
            includes: {
                ...prev.includes,
                [filterType]: prev.includes[filterType].filter(
                    (item) => item !== value
                ),
            },
        }))
    }

    function clearAllFilters() {
        setFilters((prev) => ({
            ...prev,
            includes: {},
            excludes: {},
            searchTerm: '',
        }))
    }

    useEffect(() => {
        fetchTrackAttributes()
            .then((data = {}) => setFilterOptions(data))
            .catch((error) => {
                console.error('Failed to fetch track attributes:', error)
            })
    }, [])

    return (
        <div className="flex flex-col gap-2 md:gap-3">
            <SearchInput
                className="w-full"
                value={filters.searchTerm}
                onChange={updateSearchTerm}
                onClear={clearSearchTerm}
            />

            <div className="hidden flex-wrap items-center gap-2 md:flex">
                {FILTER_TYPES.map((filterType) => (
                    <FilterModal
                        key={filterType}
                        filterType={filterType}
                        options={filterOptions[filterType]?.values || []}
                        selected={filters.includes[filterType] || []}
                        onToggle={toggleFilter}
                        onClear={clearFilterType}
                    />
                ))}

                {selectedFilters.length > 0 && (
                    <Button
                        variant="bordered"
                        size="sm"
                        className="border-danger/50 text-danger"
                        onPress={clearAllFilters}
                    >
                        Clear
                    </Button>
                )}
            </div>

            {selectedFilters.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedFilters.map(({ type, value }) => (
                        <button
                            key={`${type}-${value}`}
                            type="button"
                            onClick={() => removeSelectedFilter(type, value)}
                            className="rounded-full"
                            title={`Remove ${value}`}
                        >
                            <AttributeChip
                                attribute={value}
                                className="border-foreground/70"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
