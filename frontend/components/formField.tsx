import React, { SetStateAction } from "react";

export function FormField({
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
		<div>
			<label>
				{name}
				<input type={type} name={name} onChange={onChange} value={state} />
			</label>
			<style jsx>{`
				label {
					width: 240px;

					display: flex;
					justify-content: space-between;
				}
				div {
					margin: 16px 0px;
				}
			`}</style>
		</div>
	);
}
