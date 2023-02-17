import React, { SetStateAction, useState } from "react";
/**
 * Upgraded input component with beauty
 * @param props{size, type, name, state, setState}
 * @returns
 */
export function InputField({
	size,
	type,
	name,
	state,
	setState,
	onKeyUp,
}: {
	size?: string;
	type: string;
	name: string;
	state: string;
	setState: SetStateAction<any>;
	onKeyUp?: any;
}) {
	function onChange(e: React.ChangeEvent<HTMLInputElement>) {
		setState(e.currentTarget.value);
	}
	return (
		<div className={`field ${size ? size : ""}`}>
			<label>{name}</label>
			<input
				type={type}
				name={name}
				onChange={onChange}
				value={state}
				onKeyUp={onKeyUp}
			/>
		</div>
	);
}
