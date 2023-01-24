import React, { SetStateAction, useEffect } from "react";

export function TextareaField({
	name,
	state,
	setState,
}: {
	name: string;
	state: string;
	setState: SetStateAction<any>;
}) {
	function onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
		setState(e.currentTarget.value);
	}
	return (
		<div className="field">
			<label>{name}</label>
			<textarea name={name} value={state} onChange={onChange}></textarea>
		</div>
	);
}
