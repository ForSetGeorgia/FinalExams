import React from 'react'
import ReactHighmaps from 'react-highcharts'

const config = (data, x_data, title) => {
	return (
		{
		    chart: {
		        spacingBottom: 10
		    },
		    title: {
		        text: title
		    },
		    yAxis: {
		        title: {
		            text: 'Student Scores'
		        }
		    },
			xAxis: {
		    	categories: x_data
		  	},
		    legend: {
		        enabled: true
		    },
		 	series: data
		}
	)
}




const value_is_included = (included_values, val) => {
	var included = true;
	included_values.map((elem) => {
		if(elem.list.indexOf(val[elem.assoc_key]) < 0)
			included = false;
	})
	return included
}

const fill_checkpoint_values = (checkpoint_values, checkpoints, val) => {
	checkpoints.map((elem) => {
		checkpoint_values[elem] = val[elem]
	})
}

const start_new_iteration = (checkpoint_values, val) => {
	for(var key in checkpoint_values) {
		if(checkpoint_values[key] != val[key])
			return true
	}
	return ( false || Object.keys(checkpoint_values).length == 0 ) 
}

var find_subject = (data, combined_by, val) => {
	var name = get_name(val, combined_by)
	for(var i in data) {
		if(data[i].name == name) {
			return data[i]
		}
	}
	return null
}

const get_name = (values, combined_by) => {
	var name = ''
	for (var i=0; i<combined_by.length; i++){
		if(i!=0)
			name += " "
		name += values[combined_by[i]]
	}
	return name
}


const average_data = (data) => {
	data.map((curr_data) => {
		for(var i=0; i<curr_data.data.length; i++){
			curr_data.data[i]= curr_data.data[i]["sum"] / curr_data.data[i]["num"]
		}
	})
}

const add_in_existing_place = (data, sum, num, filter_value) => {
	for(var i=0; i<data.length; i++){
		if(data[i]["filter_value"] == filter_value) {
			data[i]['num'] = num
			data[i]['sum'] = sum
			return true
		}
	}
	return false
}


{/*
	Unfiltered data - Raw data that needs to be filtered and than averaged
	Included values - what values should be included while filtering - what options has user selected
	Checkpoints - according to what kind of value we should start new iteration. 
	Combined by - according to what kind of value we should sum up the data
	Filtered by - 
*/}
const get_data = (unfiltered_data, included_values, checkpoints, combined_by, filtered_by) => {
	var checkpoint_values = {}
	var final_data = []
	var sum = 0, num = 0, average = 0
	var first_iter = true;
	var current_element;
	unfiltered_data.map((data_elem) => {
		{/* checks whether all values of data element are included in included_values */}
		if(!value_is_included(included_values, data_elem)) {
			return
		}
		{/* if we should start new iteration*/}
		if(start_new_iteration(checkpoint_values, data_elem)){
			if(!first_iter) {
				{/*
				  Checks if there exists exact combination of "combined_by" and "filtered_by" values
				  and if it exists, updates its sum and num
				 */}
				if(!add_in_existing_place(current_element.data, sum, num, checkpoint_values[filtered_by]))
					current_element.data.push({sum: sum, num: num, filter_value: checkpoint_values[filtered_by]})
				sum = 0
				num = 0
			} else {
				first_iter = false
			}
			{/* gets checkpoint values of data element and stores in "checkpoint_values" */}
			fill_checkpoint_values(checkpoint_values, checkpoints, data_elem)
			{/* tries to find if there exists exactly same combination of "combined_by" values according to data element values*/}
			current_element = find_subject(final_data, combined_by, data_elem)
			{/* if it doesn't exist, creates a new one*/}
			if(current_element == null){
 				current_element = {	name: get_name(checkpoint_values, combined_by), data: [] }
				final_data.push(current_element)
			}
		}
		sum += data_elem.average * data_elem.count
		num += data_elem.count
	})

	{/* stores one last data element */}
	if(!add_in_existing_place(current_element.data, sum, num, checkpoint_values[filtered_by]))
		current_element.data.push({sum: sum, num: num, filter_value: checkpoint_values[filtered_by]})
	average_data(final_data)
	return final_data
}


const Average = React.createClass({
	render () {
		{/* List of options, that user has selected */}
		var options = this.props.selected_options
		{/* Averaged data according to selected options */}
		var data_average = get_data(this.props.data, 
										included_values = [{'list': options.subject_list, 'assoc_key': 'subject'},
									 				   	   {'list': options.year_list, 'assoc_key': 'year'},
									 				   		{'list': options.language_list, 'assoc_key': 'language'}],
										checkpoints = ['subject', 'year'],
										combined_by =  ['subject'],
										filtered_by = 'year'
									)
		var	x_data =  options.year_list
		return (
			<div className='average'>
				<ReactHighmaps config={config(data_average, x_data, 'Average Score')} />
			</div>
		)
	}
})

export default Average