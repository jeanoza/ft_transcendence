import React, { SetStateAction } from "react";
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
	socket,
	onKeydown,
}: {
	size?: string;
	type: string;
	name: string;
	state: string;
	setState: SetStateAction<any>;
	socket?: any;
}) {
	function onChange(e: React.ChangeEvent<HTMLInputElement>) {
		setState(e.currentTarget.value);
	}

	//function onKeydown(e) {
	//	if (e.keyCode === 13) {
	//	}
	//}

	return (
		<div className={`field ${size ? size : ""}`}>
			<label>{name}</label>
			<input
				type={type}
				name={name}
				onChange={onChange}
				value={state}
				onKeyDown={onKeydown}
			></input>
		</div>
	);
}
