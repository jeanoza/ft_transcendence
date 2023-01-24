import React, { SetStateAction } from "react";

export function InputField({
	type,
	name,
	state,
	setState,
}: {
	type: string;
	name: string;
	state: string;
	setState: SetStateAction<any>;
}) {
	function onChange(e: React.ChangeEvent<HTMLInputElement>) {
		setState(e.currentTarget.value);
	}
	return (
		<div className="field">
			<label>{name}</label>
			<input type={type} name={name} onChange={onChange} value={state}></input>
		</div>
	);
}
