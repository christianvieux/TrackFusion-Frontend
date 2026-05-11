import { Label, SearchField } from '@heroui/react'

export default function SearchInput({
    value = '',
    onChange,
    onClear,
    className = '',
    placeholder = 'Search tracks...',
}) {
    return (
        <SearchField name="track-search" className={className}>
            <Label className="sr-only">Search tracks</Label>

            <SearchField.Group>
                <SearchField.SearchIcon />

                <SearchField.Input
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full"
                />

                <SearchField.ClearButton onPress={onClear} />
            </SearchField.Group>
        </SearchField>
    )
}