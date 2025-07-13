import React, { useState, useEffect, useCallback } from 'react';
import { Input, IconButton, HStack } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import debounce from 'lodash/debounce';

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialValue?: string;
  placeholder?: string;
  debounceDelay?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  initialValue = '',
  placeholder = 'Search transactions...',
  debounceDelay = 300,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onSearch(query);
    }, debounceDelay),
    [onSearch, debounceDelay]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    debouncedSearch(text);
  };

  const handleClear = () => {
    setSearchQuery('');
    debouncedSearch('');
  };

  return (
    <HStack space={2} alignItems="center" w="100%">
      <Input
        flex={1}
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder={placeholder}
        fontSize="md"
        borderRadius="lg"
        py={2}
        px={4}
        InputLeftElement={
          <MaterialIcons
            name="search"
            size={24}
            color="gray"
            style={{ marginLeft: 8 }}
          />
        }
        InputRightElement={
          searchQuery ? (
            <IconButton
              testID="clear-button"
              icon={<MaterialIcons name="close" size={24} />}
              onPress={handleClear}
              colorScheme="gray"
              variant="ghost"
              _pressed={{ bg: 'transparent' }}
            />
          ) : undefined
        }
      />
    </HStack>
  );
}; 