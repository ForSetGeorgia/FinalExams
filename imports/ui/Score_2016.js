import React from 'react'
import ReactHighmaps from 'react-highcharts'

const config = (data) => {
	return (
		{
		    chart: {
		        type: 'column'
		    },
		    title: {
		        text: '2016'
		    },
		    yAxis: {
		        title: {
		            text: 'Student Percents'
		        }
		    },
			xAxis: {
		    	categories: [5, 6, 7, 8, 9, 10]
		  	},
		    legend: {
		        enabled: true
		    },
		 	series: data.map((pair) => {
		 								var percents = pair.results.map((val) => {
		 									return parseFloat(val[1].substring(0, val[1].length - 1))
		 								})
							 			return (
							 				{
							 					name: pair.name,
							 					data: percents
							 				}
							 			)		
								})
		}
	)
};


const Score_2016 = React.createClass({
	getInitialState () {
		var data = preload.map((dict) => {
						var name = dict['Subject']
						var results = []
						for (var key in dict) {
							if(key.indexOf('Score') == 0)
								results.push([dict[key], dict["%"+key]])
							else 
								continue
						}
						return {
								name: name,
								results: results
								}
					})

		return {
			data: data
		}
	},
	render () {
		return (
		  <div className='score_2016'>
		    <ReactHighmaps config={config(this.state.data)} />
		  </div>
		)
	}
})

export default Score_2016