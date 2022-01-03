import React from "react";

const Theme = React.createContext("white");

const TopLevelContainer = (props) => {
	return <>{props.children}</>;
};

export { Theme, TopLevelContainer };
