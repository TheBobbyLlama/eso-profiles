import { useState } from "react"

import "./ResponsiveTabView.css"

function ResponsiveTabView({ labels, children }) {
	const [ activeTab, setActiveTab ] = useState(0);

	return <div className={"responsive-tab-view"}>
		<div className="responsive-tab-view--tabs">
			{labels.map((label, index) => {
				return <div key={label} className={(activeTab === index) ? "selected" : ""} onClick={() => { setActiveTab(index); }}>
					<label>{label}</label>
				</div>;
			})}
		</div>
		<div className="responsive-tab-view--content">
			{children.length ? children.map((child, index) => {
				return <div key={labels[index]} className={(activeTab === index) ? "selected" : "hidden"}>
					{child}
				</div>;
			}) : children}
		</div>
	</div>
}

export default ResponsiveTabView;