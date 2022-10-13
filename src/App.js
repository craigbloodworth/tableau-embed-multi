import React, { useState } from 'react';
import TableauEmbed from './components/TableauEmbed';
import env from "react-dotenv";

function App() {
  const [ category, setCategory ] = useState();
  return (
    <div className="App"> 
      <label htmlFor="category">Select category:</label>
      <select name="category" id="category" onChange={(e) => {
        console.log('[App.js] Category', e.target.value)
        setCategory(e.target.value)
      }}>
        <option value="All">All</option>
        <option value="Furniture">Furniture</option>
        <option value="Office Supplies">Office Supplies</option>
        <option value="Technology">Technology</option>
      </select>
      <TableauEmbed 
        viewUrl={`${env.TS_URL}/t/til2/views/SuperstoreDemoNummer1/SuperstoreSalesAnalysis`}
        category={category}
        id="Map"
      />
      {/* <TableauEmbed 
        viewUrl={`${env.TS_URL}/t/til2/views/SuperstoreDemoNummer1/ProductSalesvsProfit`}
        category={category}
        noToken={true}
        id="Scatter"
      /> */}
    </div>
  );
}

export default App;
