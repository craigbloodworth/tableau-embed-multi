import React, { useState, useEffect, useRef } from 'react';

const getWidth = () =>
  {
    if (typeof window !== "undefined") {
        return window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth;
    }
    return null;
}

const VizEmbed = (props) => (
	<tableau-viz 
		ref={props.vizRef}
		id={props.id}      
		src={props.viewUrl}
		device={props.showMobile ? "phone" : "desktop"}
		hide-tabs={true}
		token={props.token}
		toolbar='hidden'
		width={props.width}
		touch-optimize={props.showMobile}
	  >
		{props.children}
	  </tableau-viz>
)

function TableauEmbed(props) {
	const [ width, setWidth ] = useState(getWidth());
	const [ showViz, setShowViz ] = useState(false);
	const [ token, setToken ] = useState();
	const [ viz, setViz ] = useState();

	const vizRef = useRef(null);
	const showMobile = width <= 1050;

	const vizIsReady = async (event) => {
		console.log('[TableauEmbed.js] vizIsReady');
		setShowViz(true);
	}

	const loadViz = (t) => {
		console.log('[TableauEmbed.js] loadViz');
		setViz(
			<tableau-viz 
				ref={vizRef}
				id={props.id}      
				src={props.viewUrl}
				device={props.showMobile ? "phone" : "desktop"}
				hide-tabs={true}
				token={t}
				toolbar='hidden'
				width={props.width}
				touch-optimize={props.showMobile}
			>
		  </tableau-viz>
		)
		setTimeout(() => {
			const tableauRef = vizRef.current;
			console.log('[TableauEmbed.js] Add listener to', tableauRef);
			tableauRef.addEventListener("firstinteractive", vizIsReady)
		}, 3000)
	}

	  useEffect(() => {
		if (!props.noToken) {
			fetch('/api/token')
			.then(response => {
			if (response.ok) {
				return response.text();
			}
			throw response;
			})
			.then(data => {
				console.log('[TableauEmbed.js] token', data);
				setToken(data);
				loadViz(data);
			})
		} else {
			setTimeout(() => {
				loadViz();
			  }, 2000)
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		console.log('[TableauEmbed.js] showViz', showViz);
		if (showViz === true) {
			const tableauRef = vizRef.current;
			const sheet = tableauRef.workbook.activeSheet;
			if (sheet && sheet.worksheets) {
				const map = sheet.worksheets.find(ws => ws.name ==="Profit Map");
				if (map && props.category !== 'All') {
					map.applyFilterAsync("Category", [props.category], "replace");
				} else if (map && props.category === 'All') {
					map.applyFilterAsync("Category", [], "all");
				}
				const scatter = sheet.worksheets.find(ws => ws.name ==="Product Sales vs Profit");
				console.log(scatter);
				if (scatter && props.category !== 'All') {
					scatter.applyFilterAsync("Category", [props.category], "replace");
				} else if (scatter && props.category === 'All') {
					scatter.applyFilterAsync("Category", [], "all");
				}
			}
		}
	},[props.category, showViz])
  

	return viz ? viz : null;

  }

export default TableauEmbed;