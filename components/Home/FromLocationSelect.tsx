'use client';

import { useState } from 'react';
import { Combobox } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';


const cities = [
    'Karachi, Pakistan',
    'Dubai, UAE',
    'Lahore, Pakistan',
    'Islamabad, Pakistan',
];

export default function FromLocationSelect() {
    const [selectedCity, setSelectedCity] = useState('Karachi, Pakistan');
    const [query, setQuery] = useState('');

    const filteredCities =
        query === ''
            ? cities
            : cities.filter((city) =>
                city.toLowerCase().includes(query.toLowerCase())
            );

    return (
        <div className="w-full max-w-md bg-white rounded shadow-md p-4">
            <Combobox value={selectedCity} onChange={setSelectedCity}>
                <div className="relative">
                    {/* Input Box */}
                    <div className="relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-sm border bg-popover text-popover-foreground shadow-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
                        <Combobox.Input
                            className="w-full placeholder-[#212529] px-4 py-2 text-sm leading-5 text-gray-900  focus:outline-none"
                            placeholder="From"
                            onChange={(e) => setQuery(e.target.value)}
                            displayValue={(city: string) => city}
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                        </Combobox.Button>
                    </div>

                    {/* Dropdown Panel */}
                    {filteredCities.length > 0 && (
                        <Combobox.Options className="absolute mt-2 w-full z-10 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto text-sm text-gray-900">
                            <div className="px-4 pt-3 pb-1 text-xs font-medium text-gray-500 uppercase">
                                Suggestions
                            </div>
                            {filteredCities.map((city) => (
                                <Combobox.Option
                                    key={city}
                                    value={city}
                                    className={({ active }) =>
                                        `flex justify-between items-center px-4 py-2 cursor-pointer ${active ? 'bg-blue-100' : 'hover:bg-gray-100'
                                        }`
                                    }
                                >
                                    <span className="truncate">{city}</span>
                                    <button className="text-blue-500 font-bold text-lg">+</button>
                                </Combobox.Option>
                            ))}
                        </Combobox.Options>
                    )}
                </div>
            </Combobox>



        </div>
    );
}
