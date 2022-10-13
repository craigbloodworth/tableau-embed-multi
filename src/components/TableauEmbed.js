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
		setShowViz(true);
	}

	const loadViz = (t) => {
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
			<viz-filter field="Category" value={props.category}> </viz-filter> 
		  </tableau-viz>
		)
		vizIsReady();
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
		if (showViz) {
			const tableauRef = vizRef.current;
			const sheet = tableauRef.workbook.activeSheet;
			if (sheet && sheet.worksheets) {
				const map = sheet.worksheets.find(ws => ws.name ==="Profit Map");
				console.log(map);
				if (map) {
					map.applyFilterAsync("Category", [props.category], "replace");
				}
			}
		}
	},[props.category])
  

	return viz ? viz : null;

  }

export default TableauEmbed;