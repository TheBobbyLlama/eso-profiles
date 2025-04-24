import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { localize } from "../../localization";
import { getUrlBase } from "../../util";

import "./QuickMenu.css";

function QuickMenu({displayFunc}) {
	const navigate = useNavigate();

	return <div id="quick-menu-holder" onClick={() => displayFunc(false)}>
		<div id="quick-menu">
			<ul>
				<li>
					<a href="https://www.esoui.com/downloads/info2959-RPProfileViewer.html" target="_blank" rel="noreferrer">
						{localize("LABEL_ADDON_NAME")}
					</a>
				</li>
				{!window.location.pathname.endsWith("helper") && <li>
					<a href={`${getUrlBase()}/helper`} target="_blank" rel="noreferrer">
						{localize("LABEL_RP_HELPER")}
					</a>
				</li>}
				{!window.location.pathname.endsWith("name-generator") && <li>
					<a href={`${getUrlBase()}/name-generator`} target="_blank" rel="noreferrer">
						{localize("LABEL_NAME_GENERATOR")}
					</a>
				</li>}
				<li>
					<a href="https://eso-rollplay.net/" target="_blank" rel="noreferrer">
						{localize("LABEL_LEGACY_SITE")}
					</a>
				</li>
			</ul>
		</div>
	</div>
}

export default QuickMenu;