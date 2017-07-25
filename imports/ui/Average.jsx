import React from 'react'
import ReactHighmaps from 'react-highcharts'

const config = (data, xData) => {
	return (
		{
		    chart: {
		        spacingBottom: 10
		    },
		    title: {
		        text: 'Average Score'
		    },
		    yAxis: {
		        title: {
		            text: 'Student Scores'
		        }
		    },
			xAxis: {
		    	categories: xData
		  	},
		    legend: {
		        enabled: true
		    },
		 	series: data
		}
	)
}

var find_subject = (data, subject) => {
	for(var i in data) {
		if(data[i].name == subject) {
			return data[i]
		}
	}
	return null
}


const getData = (preload, subjectList, yearList, languageList) => {
	var subject = null, year = null, current_element = null
	var final_data = []
	var  sum = 0, num = 0, average = 0
	preload.map((val) => {
		if(subjectList.indexOf(val.subject) < 0 || yearList.indexOf(val.year) < 0 || languageList.indexOf(val.language) < 0) {
			return
		}
		{/* if we should start new iteration for the new subject */}
		if(subject != val.subject || year != val.year){
			if(subject != null) {
				average = sum / num
				current_element.data.push(average)
				sum = 0
				num = 0
			}
			subject = val.subject
			year = val.year
			current_element = find_subject(final_data, val.subject)
			if(current_element == null){
 				current_element = {	name: subject, data: [] }
				final_data.push(current_element)
			}
		}
		sum += val.average * val.count
		num += val.count
	})

	average = sum / num
	current_element.data.push(average)
	return final_data
}

const Average = React.createClass({
	render () {
		var options = this.props.selected_options
		var dataAverage = getData(this.props.data, options.subjectList, 
									options.yearList, options.languageList)
		var	xData =  options.yearList
		return (
			   <div className='average'>
				<ReactHighmaps config={config(dataAverage, xData)} />
			</div>
		)
	}
})

export default Average