// MultiSelectDropdown.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const MultiSelectDropdown = ({ options, selectedOptions, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [checkedItems, setCheckedItems] = useState(selectedOptions || []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleCheckboxChange = (option) => {
        setCheckedItems((prev) => {
            const isChecked = prev.includes(option);
            const newCheckedItems = isChecked
                ? prev.filter((item) => item !== option)
                : [...prev, option];
            onChange(newCheckedItems);
            return newCheckedItems;
        });
    };

    useEffect(() => {
        setCheckedItems(selectedOptions);
    }, [selectedOptions]);

    return (
        <DropdownContainer>
            <DropdownHeader onClick={toggleDropdown}>
                {checkedItems.length > 0 ? checkedItems.join(', ') : 'Select Options'}
            </DropdownHeader>
            {isOpen && (
                <DropdownList>
                    {options.map((option, index) => (
                        <DropdownItem key={index}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={checkedItems.includes(option)}
                                    onChange={() => handleCheckboxChange(option)}
                                />
                                {option}
                            </label>
                        </DropdownItem>
                    ))}
                </DropdownList>
            )}
        </DropdownContainer>
    );
};

const DropdownContainer = styled.div`
    position: relative;
    width: 100%;
`;

const DropdownHeader = styled.div`
    padding: 0.5rem;
    border: 2px solid #fff;
    background: transparent;
    cursor: pointer;
`;

const DropdownList = styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    max-height: 150px;
    overflow-y: auto;
    border: 2px solid #fff;
    background: white;
    z-index: 10;
`;

const DropdownItem = styled.div`
    padding: 0.5rem;
    &:hover {
        background: #f0f0f0;
    }
`;

export default MultiSelectDropdown;
