import React from 'react'
import Average from './Average'
import Score_2016 from './Score_2016'


const SelectButtons = React.createClass({
	createSelectButtons (name_list, className, handleFunction, key) {
		return (
			<div id={className + '_wrapper'} className='select_buttons' key={key}>
				{name_list.map((obj, i) => {
					return <button className={className + " selected"} data-filter-name={obj} key={i} onClick={handleFunction}> {obj} </button>
				})}
			</div>
		)
	},

	render () {
		return (
			<div className='select_buttons_wrapper'> 
				{this.props.button_groups.map((group, i) => (
					this.createSelectButtons(group.list, group.className, this.props.handleFunction, i)
				))}
			</div>
		)
	} 
})


function toggle_to_array(curr_array, stat_array, elem, first_select) {
	{/* if it is first selection, we unselect everything */}
	if(first_select) {
		curr_array.length =  0
	}

	{/*
		We check, whether the value is in current options list or not
		If it is, we simply remove it.
		If not, we find where it should be added, according to the full list of options.
	*/}

	var curr_index = curr_array.indexOf(elem)
	if(curr_index >= 0) {
		curr_array.splice(curr_index, 1);
	} else {
		stat_index = stat_array.indexOf(elem)
		var pushed = false;
		var i; 
		for(i=0; i<curr_array.length; i++){
			if(stat_array.indexOf(curr_array[i]) > stat_index){
				if(i == 0) {
					curr_array.splice(0, 0, elem)
				}
				else {
					curr_array.splice(i, 0, elem)
				}
				pushed = true;
				break;
			}
		}
		if(!pushed){
			curr_array.push(elem)
		}
	}
}

function toggle_clicked_classname(class_name, curr_array, elem, elem_value, first_select) {
	{/* if it is first selection, we unselect everything */}
	if(first_select) {
		var buttons = document.getElementsByClassName(class_name)
		for(var i = 0; i < buttons.length; i++) {
			buttons[i].classList.remove('selected')
		}
	}

	{/*
		We check, whether the value is in current options list or not
		If it is, we add 'selected' class to the button, 
		If not, we remove it. 
	*/}
	var curr_index = curr_array.indexOf(elem_value)

	if(curr_index >= 0) {
		elem.classList.add('selected')
	} else {
		elem.classList.remove('selected')
	}
}


const ExamResults = React.createClass({
	statics: {
		subject_list: [
			'ბიოლოგია', 'გეოგრაფია', 'გერმანული', 'ინგლისური',
			'ისტორია', 'მათემატიკა', 'რუსული', 'ფიზიკა',
			'ქართული ენა', 'ქართული ენა და ლიტ.', 'ქიმია'
		],
		year_list: [
			2011, 2012, 2013, 2014, 2015, 2016
		],
		language_list: [
			'ქართული', 'აზერბაიჯანული', 'რუსული', 'სომხური', 'არაქართული'
		]
	},

	select_options: {},

	getInitialState () {
		this.select_options.subject_list = ExamResults.subject_list.slice()
		this.select_options.year_list = ExamResults.year_list.slice()
		this.select_options.language_list = ExamResults.language_list.slice()
		return {
			highchart: <Average data={this.props.data} selected_options={this.select_options}/>,
			subject_initial_select: true,
			year_initial_select: true,
			language_initial_select: true
		}
	},


	handleSelectButton (event) {
		{/* Handles highchart change after select buttons are clicked */}
		var class_list = event.target.classList
		var value = event.target.getAttribute('data-filter-name')
		var options = this.select_options
		var first_select = false;
		if(class_list.contains('year_buttons')) {
			{/* if it is first selection, we save in states, that first selection has happened. */}
			if(this.state.year_initial_select){
				first_select = true
				this.setState({year_initial_select: false})
			}
			{/* we select or unselect option from selected list */}
			toggle_to_array(options.year_list, ExamResults.year_list, parseInt(value), first_select)
			toggle_clicked_classname('year_buttons', options.year_list, event.target, parseInt(value), first_select)
		} else if(class_list.contains('subject_buttons')) {
			{/* if it is first selection, we save in states, that first selection has happened. */}

			if(this.state.subject_initial_select){
				first_select = true
				this.setState({subject_initial_select: false})
			}
			{/* we select or unselect option from selected list */}
			toggle_to_array(options.subject_list, ExamResults.subject_list, value, first_select)
			toggle_clicked_classname('subject_buttons', options.subject_list, event.target, value, first_select)
		} else {
			{/* if it is first selection, we save in states, that first selection has happened. */}
			if(this.state.language_initial_select){
				first_select = true
				this.setState({language_initial_select: false})
			}
			{/* we select or unselect option from selected list */}
			toggle_to_array(options.language_list, ExamResults.language_list, value, first_select)
			toggle_clicked_classname('language_buttons', options.language_list, event.target, value, first_select)
		}

		{/* After the selection, we update the highchart with updated list of options */}
		this.setState({highchart: <Average data={this.props.data} selected_options={options}/>})
	},

	
	handleHighchartChange (event) {
		{/* handles highchart type change */}
		if(event.target.id == 'average') {
			this.setState({highchart: <Average data={this.props.data} selected_options={this.select_options}/>})
		} else if(event.target.id == 'score_2016') {
			this.setState({highchart: <Score_2016 data={this.props.data} selected_options={this.select_options}/>})
		}
	},

	render () {
		return (
		  <div className='exam_results'>
	  		{/* Creates buttons for years, subjects and languages */}
		  	<section className='select_buttons_section'>
		  		<SelectButtons button_groups={[ {list: ExamResults.year_list, className: 'year_buttons'},
		  										{list: ExamResults.subject_list, className: 'subject_buttons'},
		  										{list: ExamResults.language_list, className: 'language_buttons'} ]}  
		  					   handleFunction={this.handleSelectButton}/>
		  	</section>

		  	{/*Creates highchart, initially with Average*/}
		  	<section className='highchart_section'>
		  		{this.state.highchart}
		  	</section>

		  	{/*Creates options for chart types.*/}
		  	<section className='option_buttons_section'>
		      	<button id='average' onClick={this.handleHighchartChange}> Average Scores </button>
		  	</section>
		  </div>
		)
	}
})

export default ExamResults



