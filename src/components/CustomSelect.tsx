import React from "react";
import {Controller} from "react-hook-form";

const CustomSelect = ({name, control, options, placeholder}) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({field}) => (
                <div className="relative">
                    <select
                        {...field}
                        className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
                    >
                        <option value="" disabled hidden>
                            {placeholder}
                        </option>
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        />
    );
};

export default CustomSelect;
