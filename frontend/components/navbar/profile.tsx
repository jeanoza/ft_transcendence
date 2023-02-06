import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useUser } from "../../utils/hooks/swrHelper";

export function Profile() {
	const { user } = useUser();

	return <div className="profile d-flex center gap justify-between"></div>;
}
